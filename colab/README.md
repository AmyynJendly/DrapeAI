# 🚀 DrapeAI Colab GPU Backend

This folder contains the Google Colab backend that powers the **real AI virtual try-on** feature in DrapeAI.

## How It Works

```
User Photo + Garment → Spring Boot Backend → This Colab Script → Hugging Face IDM-VTON Space → Result Image
```

The Colab notebook runs on a **free T4 GPU** and uses:
- **gradio_client** to call the real **IDM-VTON** model hosted on Hugging Face Spaces
- **ngrok** to expose the FastAPI server publicly so the Spring Boot backend can reach it
- **Pillow** post-processing for image enhancement and consistent sizing

### Key Improvement in v3

The Colab backend now **returns the result as an inline base64 data URL** (`result_base64`) rather than an ngrok image URL. This eliminates the need for the ngrok-skip-browser-warning header when loading the result in a browser `<img>` tag.

---

## Setup Instructions

### Step 1: Open in Google Colab
1. Go to [colab.research.google.com](https://colab.research.google.com)
2. File → Upload notebook → select `drapeai_vto_backend.py`
3. Go to **Runtime → Change runtime type → T4 GPU** (free tier)

### Step 2: Run the cell
Click **Run** (or Ctrl+Enter). It will:
- Install dependencies
- Connect to the IDM-VTON model via Gradio client
- Start the FastAPI server
- Print a public ngrok URL

### Step 3: Copy the URL into your `.env.local`
The cell will print something like:
```
VTO_COLAB_API_URL=https://xxxx-xx-xx-xxx-xx.ngrok-free.app/try-on
```

Add this line to `DrapeAI/.env.local` (replace the old value if present):
```env
VTO_COLAB_API_URL=https://xxxx-xx-xx-xxx-xx.ngrok-free.app/try-on
HF_TOKEN=hf_your_token_here
```

### Step 4: Restart the Spring Boot backend
```bash
# In drapeai-backend/
mvn spring-boot:run
```

---

## API Contract

**POST** `/try-on`

```json
{
  "user_image_url": "data:image/jpeg;base64,...",
  "garment_image_url": "https://...",
  "category": "tops"
}
```

**Response:**
```json
{
  "status": "success",
  "result_base64": "data:image/png;base64,...",
  "message": "Virtual try-on generated successfully"
}
```

The Spring Boot backend now expects `result_base64` in the response (v3 format). If present, it is returned directly to the frontend as a data URL — no server-side download needed.

---

## VTO Spaces Used

| Space | Status | Notes |
|---|---|---|
| `Nymbo/Virtual-Try-On` | ✅ Primary | Most reliable `/tryon` API |
| `yisol/IDM-VTON` | ✅ Fallback | Original IDM-VTON space |

The script tries each space in order. If the first fails, it falls back to the second.

---

## Category Mapping

| DrapeAI Category | Colab Category |
|---|---|
| `apparel` | `tops` |
| `footwear` | `shoes` |
| `bottoms` | `bottoms` |

---

## Product Images: Critical

⚠️ **The AI try-on model works best with garment-only images** (flat lay, hanger, or mannequin-only photos). Do NOT use model photos as product images — the AI gets confused when it sees a person already wearing the garment.

The DrapeAI product catalog has been updated to use garment-only Unsplash photos.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `CUDA out of memory` | Runtime → Disconnect and delete runtime, then reconnect |
| `ngrok session expired` | Re-run the cell to get a new URL; update `.env.local` |
| `All VTO spaces failed` | Check your HF_TOKEN is valid; HF may be overloaded |
| Spring Boot logs `Colab VTO failed` | Check Colab is still running; ngrok sessions expire after ~2h |
| AI result looks wrong | Try a different user photo (full body, good lighting) |
