
// Client-side service that calls our secure internal API
// This prevents exposing the GEMINI_API_KEY in the browser bundle
import { authService } from './authService';

export const enhanceImage = async (base64Image: string, type: 'CRISP' | 'FACE_SWAP' | 'CREATIVE' | 'MASK', promptModifier?: string): Promise<string> => {
  try {
    const token = await authService.getAccessToken();
    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ base64Image, type, promptModifier }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    return data.image;
  } catch (error) {
    console.error("Enhance Service Error:", error);
    throw error;
  }
};

export const suggestCaption = async (imageContext: string): Promise<string[]> => {
  try {
    const token = await authService.getAccessToken();
    const response = await fetch('/api/caption', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ imageContext }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.captions || ["EPIC", "FRESH", "HUSTLE", "FUTURE", "VIBE"];
  } catch (e) {
    console.warn("Caption Service Error:", e);
    return ["EPIC", "FRESH", "HUSTLE", "FUTURE", "VIBE"]; // Safe fallback
  }
};



