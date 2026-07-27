# 🚀 DrapeAI Colab GPU Backend

This folder contains the Google Colab backend that powers the **real AI virtual try-on** feature in DrapeAI.

## How It Works

```
User Photo + Garment → Spring Boot Backend → This Colab Script → Stable Diffusion → Result Image
```

The Colab notebook runs on a **free GPU** and uses:
- **Stable Diffusion Inpainting** (`runwayml/stable-diffusion-inpainting`) to inpaint the garment onto the person
- **IP-Adapter** (`h94/IP-Adapter`) to guide generation using the actual garment image as visual reference
- **ngrok** to expose the FastAPI server publicly so the Spring Boot backend can reach it

---

## Setup Instructions

### Step 1: Open in Google Colab
1. Go to [colab.research.google.com](https://colab.research.google.com)
2. File → Upload notebook → select `drapeai_vto_backend.py` **OR** just copy-paste the entire file contents into a new Colab code cell
3. Go to **Runtime → Change runtime type → T4 GPU** (free tier)

### Step 2: Install dependencies
At the top of the cell, uncomment the pip install line:
```python
!pip install -q diffusers transformers accelerate ftfy fastapi uvicorn pyngrok nest_asyncio pillow requests
```

### Step 3: Run the cell
Click **Run** (or Ctrl+Enter). It will:
- Download and load the SD Inpainting model (~1.5GB, takes ~30-60s)
- Load IP-Adapter weights
- Start the FastAPI server
- Print a public ngrok URL

### Step 4: Copy the URL into your `.env.local`
The cell will print something like:
```
VTO_COLAB_API_URL=https://xxxx-xx-xx-xxx-xx.ngrok-free.app/try-on
```

Add this line to `DrapeAI/.env.local` (replace the old value if present).

### Step 5: Restart the Spring Boot backend
The backend reads the env var at startup:
```bash
# In drapeai-backend/
mvn spring-boot:run
```

---

## API Contract

**POST** `/try-on`

```json
{
  "user_image_url": "data:image/jpeg;base64,...",   // base64 or HTTP URL
  "garment_image_url": "https://...",               // product image URL
  "category": "tops"                                // "tops" | "bottoms" | "shoes"
}
```

**Response:**
```json
{
  "status": "success",
  "result_url": "https://xxxx.ngrok-free.app/result.png"
}
```

---

## Category Mapping

The Spring Boot backend automatically maps DrapeAI categories to Colab categories:

| DrapeAI Category | Colab Category | Mask Region |
|---|---|---|
| `apparel` | `tops` | Torso (120–450px) |
| `footwear` | `shoes` | Feet (340–512px) |
| `bottoms` | `bottoms` | Lower body (280–512px) |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `CUDA out of memory` | Runtime → Disconnect and delete runtime, then reconnect |
| `ngrok session expired` | Re-run the cell to get a new URL; update `.env.local` |
| `Could not load image` | Check the product image URL is publicly accessible |
| Spring Boot logs `Colab VTO failed` | Check Colab is still running; ngrok sessions expire after ~2h |
