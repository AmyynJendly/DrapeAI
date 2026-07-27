/**
 * Virtual Try-On service — routes all AI processing through the DrapeAI backend.
 *
 * The backend implements a 3-tier pipeline:
 *   1. Colab/ngrok endpoint (if configured)
 *   2. HF Gradio (Nymbo/Virtual-Try-On)
 *   3. Graceful fallback (garment image)
 *
 * This avoids all CORS issues and keeps the HF token secure on the server.
 */

import { apiClient } from './api';
import { TryOnRequest, TryOnResponse } from '../types';

export interface VtoResponse {
  success: boolean;
  resultUrl: string;
  productName?: string;
  spaceUsed?: string;
}

/**
 * Converts a file or blob URL / base64 data URL to a base64 data URL string.
 * Returns the input unchanged if it's already a data URL.
 */
async function toBase64DataUrl(imageSource: string): Promise<string> {
  // Already a base64 data URL
  if (imageSource.startsWith('data:')) {
    return imageSource;
  }

  // Fetch the image (works for blob:// URLs from webcam and http:// URLs from presets)
  const response = await fetch(imageSource);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Submits a virtual try-on request to the backend API.
 *
 * @param userImageSource - Base64 data URL, blob URL, or Unsplash URL of the person photo
 * @param garmentImageUrl - URL of the product/garment image
 * @param productId       - Product ID to look up from the backend
 * @param category        - Product category ("apparel" | "footwear")
 * @param onProgress      - Optional progress callback for UI updates
 */
export async function processHuggingFaceVTO(
  userImageSource: string,
  garmentImageUrl: string,
  category: string,
  onProgress?: (msg: string) => void,
  productId?: string
): Promise<VtoResponse> {
  onProgress?.('Preparing your photo for AI processing...');

  // Convert user image to base64 (handles preset URLs, blob URLs, and file uploads)
  let userImageBase64: string;
  try {
    userImageBase64 = await toBase64DataUrl(userImageSource);
    onProgress?.('Connecting to DrapeAI AI engine...');
  } catch (err) {
    console.error('Failed to encode user image:', err);
    // If we can't fetch the image (e.g. CORS on unsplash), pass the URL directly
    // The backend will handle it
    userImageBase64 = userImageSource;
    onProgress?.('Connecting to DrapeAI AI engine...');
  }

  const request: TryOnRequest = {
    productId: productId || 'unknown',
    userImage: userImageBase64,
    category: category,
  };

  onProgress?.('AI is fitting the garment to your photo...');

  try {
    const response = await apiClient.post<TryOnResponse>(
      '/try-on/process',
      request,
      {
        timeout: 180_000, // 3 minutes — allow for HF Gradio queue wait
      }
    );

    const data = response.data;

    if (!data || !data.resultImageUrl) {
      throw new Error('Backend returned an empty result.');
    }

    onProgress?.('Rendering final high-resolution result...');

    return {
      success: true,
      resultUrl: data.resultImageUrl,
      productName: data.productName,
      spaceUsed: 'DrapeAI Neural Engine',
    };
  } catch (err: any) {
    console.error('VTO API call failed:', err);

    // Surface a friendly error message
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      'Failed to generate virtual try-on preview.';

    throw new Error(msg);
  }
}
