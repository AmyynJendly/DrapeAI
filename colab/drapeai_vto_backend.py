# =========================================================
# DRAPE.AI — Colab GPU Virtual Try-On Backend
# =========================================================
# HOW TO USE:
#   1. Open this script in Google Colab (Runtime → GPU)
#   2. Run the full cell
#   3. Copy the printed VTO_COLAB_API_URL into your .env.local
#   4. Restart your Spring Boot backend so it picks up the env var
# =========================================================

# =========================================================
# 1. INSTALL DEPENDENCIES
# =========================================================
# !pip install -q diffusers transformers accelerate ftfy fastapi uvicorn pyngrok nest_asyncio pillow requests

import io
import asyncio
import nest_asyncio
import uvicorn
import torch
import requests
import base64
from PIL import Image, ImageDraw
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pyngrok import ngrok
from diffusers import AutoPipelineForInpainting

print("⚡ Loading Diffusion Model onto Colab GPU... (Takes ~30 seconds)")

# Load Stable Diffusion Inpainting pipeline directly onto Colab GPU memory
pipe = AutoPipelineForInpainting.from_pretrained(
    "runwayml/stable-diffusion-inpainting",
    torch_dtype=torch.float16
).to("cuda")

# Load IP-Adapter so the garment image guides the fabric generation
pipe.load_ip_adapter("h94/IP-Adapter", subfolder="models", weight_name="ip-adapter_sd15.bin")
pipe.set_ip_adapter_scale(0.8)

print("✅ Model successfully loaded on Colab GPU!")

# =========================================================
# 2. FASTAPI SERVER SETUP
# =========================================================
app = FastAPI(title="DRAPE.AI - Local Colab GPU Try-On")

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
    category: str = "tops"   # "tops", "bottoms", "shoes", etc.


# Helper function to download images or decode Base64 photos
def download_image(url: str) -> Image.Image:
    try:
        # Support Base64 photo uploads from local computer
        if url.startswith("data:image"):
            header, encoded = url.split(",", 1)
            data = base64.b64decode(encoded)
            return Image.open(io.BytesIO(data)).convert("RGB")

        # Support HTTP / HTTPS URLs with custom User-Agent
        headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
        resp = requests.get(url, headers=headers, timeout=15)
        resp.raise_for_status()
        return Image.open(io.BytesIO(resp.content)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Could not load image file: {str(e)}")


# Endpoint to serve generated result images
@app.get("/result.png")
async def get_result():
    return FileResponse("/content/result.png", media_type="image/png")


# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok", "model": "stable-diffusion-inpainting + IP-Adapter"}


# Main Virtual Try-On API Endpoint
# Matches the payload sent by DrapeAI Spring Boot backend (TryOnService.java)
@app.post("/try-on")
async def process_vto(req: TryOnRequest):
    try:
        print("\n📥 Received Try-On Request...")
        print(f"👤 User Image: {req.user_image_url[:60]}...")
        print(f"👕 Garment: {req.garment_image_url[:60]}...")
        print(f"🏷️  Category: {req.category}")

        # Download or decode input images
        user_img = download_image(req.user_image_url).resize((512, 512))
        garment_img = download_image(req.garment_image_url).resize((512, 512))

        # Create garment placement mask
        # Covers torso area for tops; adjust rectangle for other categories
        mask_img = Image.new("L", (512, 512), 0)
        draw = ImageDraw.Draw(mask_img)
        if req.category in ["shoes", "footwear"]:
            draw.rectangle([100, 340, 412, 512], fill=255)  # Lower body / feet
        elif req.category in ["bottoms", "pants", "skirts"]:
            draw.rectangle([100, 280, 412, 512], fill=255)  # Lower body
        else:
            draw.rectangle([100, 120, 412, 450], fill=255)  # Torso (default)

        print("⚡ Generating Try-On render on Colab GPU...")
        generator = torch.Generator("cuda").manual_seed(42)

        output = pipe(
            prompt=f"a high quality photo of a person wearing {req.category}, detailed fabric texture, photorealistic, studio lighting",
            image=user_img,
            mask_image=mask_img,
            ip_adapter_image=garment_img,
            num_inference_steps=25,
            guidance_scale=7.5,
            generator=generator
        ).images[0]

        # Save result image to Colab disk
        output.save("/content/result.png")

        result_url = f"{public_url}/result.png"
        print(f"✨ Generation complete! URL: {result_url}\n")

        # Return result_url field — matches what TryOnService.java looks for
        return {"status": "success", "result_url": result_url}

    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# =========================================================
# 3. NGROK TUNNEL SETUP
# =========================================================
NGROK_AUTHTOKEN = "2WoSAbuOUvepuRnOcJZQEs7OWkS_6EbQ9C8LmFmBsbtjN3WHx"

ngrok.set_auth_token(NGROK_AUTHTOKEN)
ngrok.kill()

public_tunnel = ngrok.connect(8000)
public_url = public_tunnel.public_url

print("\n" + "=" * 65)
print("🚀 DRAPE.AI COLAB GPU VTO BACKEND IS LIVE!")
print(f"👉 Add this to your .env.local:")
print(f"   VTO_COLAB_API_URL={public_url}/try-on")
print("=" * 65 + "\n")

# =========================================================
# 4. START SERVER
# =========================================================
config = uvicorn.Config(app, host="0.0.0.0", port=8000, log_level="info")
server = uvicorn.Server(config)

nest_asyncio.apply()
await server.serve()
