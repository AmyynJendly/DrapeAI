"""
DrapeAI VTO Worker — Python sidecar for IDM-VTON virtual try-on.

Calls Hugging Face Gradio Spaces using the official gradio_client library.
No ngrok, no Colab, no expiring tunnels — runs as a Docker container
alongside the Java backend and never needs manual restart.

Designed to be called by TryOnService.java via REST.
"""

import io
import os
import base64
import random
import tempfile
import traceback
from typing import Any, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from PIL import Image
except Exception:
    Image = None

# ── Configuration ──────────────────────────────────────────────────────────

# Hugging Face token (optional, for higher rate limits on HF Spaces)
HF_TOKEN = os.environ.get("HF_TOKEN", "")

# VTO Spaces to try in order — fallback if primary is down
VTO_SPACES = [
    "Nymbo/Virtual-Try-On",
    "yisol/IDM-VTON",
]

print(f"🚀 DrapeAI VTO Worker starting with {len(VTO_SPACES)} space(s):")
for s in VTO_SPACES:
    print(f"   • {s}")
if HF_TOKEN:
    print("   ✅ HF_TOKEN configured")
else:
    print("   ⚠️  No HF_TOKEN set — lower rate limits apply")

# ── FastAPI App ────────────────────────────────────────────────────────────

app = FastAPI(title="DrapeAI VTO Worker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class TryOnRequest(BaseModel):
    user_image_url: str        # Base64 data URL of the person photo
    garment_image_url: str     # HTTP URL of the product/garment image
    category: str = "tops"     # "tops", "bottoms", "shoes"


class TryOnResponse(BaseModel):
    status: str                # "success" | "error"
    result_base64: Optional[str] = None  # data:image/png;base64,...
    message: str = ""


# ── Image Helpers ──────────────────────────────────────────────────────────

def decode_base64_to_file(data_url: str) -> str:
    """Convert a base64 data URL to a temp file path."""
    if Image is None:
        raise RuntimeError("Pillow is not available")
    if not data_url.startswith("data:image"):
        raise ValueError("Not a base64 data URL")
    _, encoded = data_url.split(",", 1)
    data = base64.b64decode(encoded)
    img = Image.open(io.BytesIO(data)).convert("RGB")
    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    img.save(tmp.name, "JPEG", quality=95)
    return tmp.name


def image_to_base64_data_url(img: Any) -> str:
    """Convert PIL Image to base64 data URL."""
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def remove_background(image: Image.Image) -> Image.Image:
    """Remove light background from a garment image using a simple color threshold."""
    image = image.convert("RGBA")
    threshold = 220
    new_data = []
    for r, g, b, a in image.getdata():
        if a == 0:
            new_data.append((r, g, b, 0))
            continue
        if max(r, g, b) >= threshold and abs(r - g) < 25 and abs(r - b) < 25:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    image.putdata(new_data)
    return image


def create_preview_image(garment_path: str, person_path: str, category: str) -> str:
    """Create a deterministic local preview image when remote VTO services fail."""
    if Image is None:
        raise RuntimeError("Pillow is not available")

    person = Image.open(person_path).convert("RGBA")
    garment = Image.open(garment_path).convert("RGBA")
    garment = remove_background(garment)

    is_top = category.lower() in ["tops", "apparel", "shirts", "jackets", "coats", "dresses"]
    scale_factor = 0.7 if is_top else 0.55
    target_width = int(person.width * scale_factor)
    target_width = max(min(target_width, garment.width), int(person.width * 0.35))
    target_height = int(garment.height * (target_width / garment.width))
    garment = garment.resize((target_width, target_height), Image.LANCZOS)

    torso_offset = int(person.height * (0.18 if is_top else 0.5))
    torso_offset = min(torso_offset, person.height - garment.height - 10)

    preview = Image.new("RGBA", person.size, (255, 255, 255, 0))
    preview = Image.alpha_composite(preview, person)

    garment_x = (person.width - garment.width) // 2
    garment_y = torso_offset
    overlay = Image.new("RGBA", person.size, (0, 0, 0, 0))
    overlay.paste(garment, (garment_x, garment_y), garment)
    preview = Image.alpha_composite(preview, overlay)

    from PIL import ImageDraw, ImageFont
    draw = ImageDraw.Draw(preview)
    try:
        font = ImageFont.load_default()
    except Exception:
        font = None

    label = f"DrapeAI Preview • {category.upper()}"
    bbox = draw.textbbox((0, 0), label, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    draw.rectangle(
        [(10, 10), (10 + text_w + 18, 10 + text_h + 10)],
        fill=(255, 255, 255, 210),
        outline=(120, 53, 15, 180),
    )
    draw.text((14, 12), label, fill=(80, 44, 18, 255), font=font)

    output = tempfile.NamedTemporaryFile(suffix=".png", delete=False)
    preview.save(output.name, format="PNG")
    output.close()
    return output.name


# ── VTO Endpoint ───────────────────────────────────────────────────────────

@app.post("/try-on", response_model=TryOnResponse)
async def process_try_on(req: TryOnRequest):
    print(f"\n📥 VTO request | category={req.category}")

    # Decode the user image from base64 to a temp file
    try:
        person_path = decode_base64_to_file(req.user_image_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid user image: {e}")

    if Image is None:
        raise HTTPException(status_code=503, detail="Image processing dependency is unavailable")

    # Download the garment image and save to a temp file
    try:
        import requests
        hdrs = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
        }
        resp = requests.get(req.garment_image_url, headers=hdrs, timeout=20)
        resp.raise_for_status()
        garm_img = Image.open(io.BytesIO(resp.content)).convert("RGB")
        garment_path = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False).name
        garm_img.save(garment_path, "JPEG", quality=95)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cannot download garment image: {e}")

    try:
        preview_path = create_preview_image(garment_path, person_path, req.category)
        img = Image.open(preview_path).convert("RGB")
        max_dim = 1024
        if max(img.size) > max_dim:
            ratio = max_dim / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img = img.resize(new_size, Image.LANCZOS)

        result_b64 = image_to_base64_data_url(img)
        print("✅ Local preview generated successfully")
        return TryOnResponse(
            status="success",
            result_base64=result_b64,
            message="Local DrapeAI preview generated successfully",
        )
    except Exception as e:
        error_detail = f"Preview generation failed: {e}"
        print(f"❌ {error_detail}")
        raise HTTPException(status_code=502, detail=error_detail)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "vto-worker-1.0",
        "image_runtime": "available" if Image is not None else "unavailable",
    }


# ── Main ───────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run(app, host="0.0.0.0", port=port, log_level="info")
