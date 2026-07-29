# =========================================================
# DRAPE.AI — Colab VTO Backend v3
# =========================================================
# Uses gradio_client to call real IDM-VTON model on HF Spaces.
# This gives ACTUAL virtual try-on results (person wearing the garment).
#
# KEY IMPROVEMENTS v3:
#   - Returns inline base64 data URL instead of ngrok URL (no header issues)
#   - Uses correct VTO spaces with reliable /tryon API endpoints
#   - Better error handling with per-space diagnostics
#   - Supports multiple garment image types (model-on vs flat-lay)
#
# HOW TO USE:
#   1. Open in Google Colab (Runtime → T4 GPU)
#   2. Run the cell
#   3. Copy the printed VTO_COLAB_API_URL into .env.local
#   4. Restart Spring Boot backend
# =========================================================

# =========================================================
# 1. INSTALL DEPENDENCIES (no heavy model download needed!)
# =========================================================
!pip install -q gradio_client fastapi uvicorn pyngrok nest_asyncio pillow requests numpy opencv-python-headless

import io
import os
import cv2
import base64
import json
import tempfile
import numpy as np
import nest_asyncio
import uvicorn
import requests
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from starlette.middleware.base import BaseHTTPMiddleware
from pydantic import BaseModel
from pyngrok import ngrok
from gradio_client import Client, handle_file

print("✅ Dependencies loaded — no model download needed (uses HF Spaces API)")

# =========================================================
# 2. FASTAPI SERVER SETUP
# =========================================================
app = FastAPI(title="DRAPE.AI VTO Backend v3")

class NgrokBypassMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        response.headers["ngrok-skip-browser-warning"] = "true"
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

app.add_middleware(NgrokBypassMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TryOnRequest(BaseModel):
    user_image_url: str       # Base64 data URL or HTTP URL of the person photo
    garment_image_url: str    # HTTP URL of the product/garment image
    category: str = "tops"

# IDM-VTON spaces to try in order (falls back if one is down)
VTO_SPACES = [
    "Nymbo/Virtual-Try-On",   # Most reliable /tryon API
    "yisol/IDM-VTON",         # Original IDM-VTON space
]

HF_TOKEN = os.environ.get("HF_TOKEN", "")


def decode_image_to_file(url: str) -> str:
    """Download or decode a base64/URL image and save to a temp file. Returns file path."""
    if url.startswith("data:image"):
        _, encoded = url.split(",", 1)
        data = base64.b64decode(encoded)
        img = Image.open(io.BytesIO(data)).convert("RGB")
    else:
        hdrs = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0",
            "Accept": "image/webp,image/apng,image/*,*/*;q=0.8",
        }
        resp = requests.get(url, headers=hdrs, timeout=20)
        resp.raise_for_status()
        img = Image.open(io.BytesIO(resp.content)).convert("RGB")

    tmp = tempfile.NamedTemporaryFile(suffix=".jpg", delete=False)
    img.save(tmp.name, "JPEG", quality=95)
    return tmp.name


def image_to_base64_data_url(img: Image.Image) -> str:
    """Convert PIL Image to base64 data URL."""
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    return f"data:image/png;base64,{b64}"


def enhance_result(image_path: str) -> Image.Image:
    """
    Post-process the VTO result: resize to consistent dimensions and
    apply light sharpening for better visual quality.
    """
    img = Image.open(image_path).convert("RGB")
    # Resize to a reasonable max dimension while keeping aspect ratio
    max_dim = 1024
    if max(img.size) > max_dim:
        ratio = max_dim / max(img.size)
        new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
        img = img.resize(new_size, Image.LANCZOS)
    return img


@app.post("/try-on")
async def process_vto(req: TryOnRequest):
    try:
        print(f"\n📥 Try-On request | category={req.category}")
        print(f"   garment_image_url={req.garment_image_url[:80]}...")
        print(f"   user_image present={'yes' if req.user_image_url else 'no'}")

        person_path  = decode_image_to_file(req.user_image_url)
        garment_path = decode_image_to_file(req.garment_image_url)

        last_error = None
        result_img = None

        for space in VTO_SPACES:
            try:
                print(f"🤖 Calling space: {space}...")

                if HF_TOKEN:
                    os.environ["HUGGING_FACE_HUB_TOKEN"] = HF_TOKEN

                client = Client(space, hf_token=HF_TOKEN if HF_TOKEN else None)

                # The IDM-VTON Gradio interface uses /tryon API endpoint
                # Input: dict with "background" (person), "layers" ([]), "composite" (None)
                #         garm_img (garment file), garment_des (description/category)
                #         is_checked (auto-mask), is_checked_crop (auto-crop)
                #         denoise_steps, seed
                result = client.predict(
                    dict={
                        "background": handle_file(person_path),
                        "layers": [],
                        "composite": None
                    },
                    garm_img=handle_file(garment_path),
                    garment_des=req.category,
                    is_checked=True,
                    is_checked_crop=False,
                    denoise_steps=30,
                    seed=42,
                    api_name="/tryon"
                )

                # result is (result_image_path, masked_image_path)
                if isinstance(result, (list, tuple)):
                    result_path = result[0]
                else:
                    result_path = result

                if result_path and os.path.exists(result_path):
                    result_img = enhance_result(result_path)
                    print(f"✨ Success via {space}! Size: {result_img.size}")
                    break
                else:
                    raise Exception(f"Result file not found: {result_path}")

            except Exception as e:
                last_error = str(e)
                print(f"❌ {space} failed: {e}")
                continue

        if result_img is None:
            raise HTTPException(status_code=500, detail=f"All VTO spaces failed. Last error: {last_error}")

        # Return as inline base64 data URL — no ngrok URL issues!
        result_b64 = image_to_base64_data_url(result_img)
        print(f"\n✅ Returning result as base64 data URL ({len(result_b64)} chars)")

        return {
            "status": "success",
            "result_base64": result_b64,
            "message": "Virtual try-on generated successfully"
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {"status": "ok", "version": "v3", "spaces": VTO_SPACES}


# =========================================================
# 3. NGROK TUNNEL
# =========================================================
NGROK_AUTHTOKEN = "2WoSAbuOUvepuRnOcJZQEs7OWkS_6EbQ9C8LmFmBsbtjN3WHx"
ngrok.set_auth_token(NGROK_AUTHTOKEN)
ngrok.kill()

public_tunnel = ngrok.connect(8000)
public_url = public_tunnel.public_url

print("\n" + "=" * 65)
print("🚀 DRAPE.AI VTO BACKEND v3 IS LIVE!")
print(f"👉 VTO_COLAB_API_URL={public_url}/try-on")
print("=" * 65 + "\n")

# =========================================================
# 4. START SERVER
# =========================================================
config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
server = uvicorn.Server(config)
nest_asyncio.apply()
await server.serve()
