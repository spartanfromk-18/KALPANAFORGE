import { GoogleGenAI, Modality } from "@google/genai";

export const config = {
    runtime: 'edge',
    // Increase max duration for image processing
    maxDuration: 60,
};

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

// Maximum allowed image size (10MB in base64 characters - roughly 7.5MB actual)
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export default async function handler(req: Request) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: corsHeaders
        });
    }

    try {
        const body = await req.json();
        const { base64Image, type, promptModifier } = body;

        // --- ROBUST VALIDATION (Server-Side) ---
        if (!base64Image || typeof base64Image !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid or missing image data' }), {
                status: 400,
                headers: corsHeaders
            });
        }

        if (base64Image.length > MAX_IMAGE_SIZE) {
            return new Response(JSON.stringify({ error: `Image payload too large (${(base64Image.length / 1024 / 1024).toFixed(1)}MB). Max 10MB.` }), {
                status: 400,
                headers: corsHeaders
            });
        }

        const validTypes = ['CRISP', 'MASK', 'FACE_SWAP', 'CREATIVE'];
        if (!type || !validTypes.includes(type)) {
            return new Response(JSON.stringify({ error: 'Missing or invalid enhancement type' }), {
                status: 400,
                headers: corsHeaders
            });
        }

        if (promptModifier && (typeof promptModifier !== 'string' || promptModifier.length > 500)) {
            return new Response(JSON.stringify({ error: 'Invalid prompt modifier (too long or wrong type)' }), {
                status: 400,
                headers: corsHeaders
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        const openaiKey = process.env.OPENAI_API_KEY;
        const aiProvider = process.env.AI_PROVIDER || 'gemini'; // 'gemini' or 'openai'
        const aiModel = process.env.AI_MODEL || 'gemini-2.0-flash-exp';
        const openaiBase = process.env.OPENAI_API_BASE || 'https://api.openai.com/v1';

        // Validate API key based on provider
        if (aiProvider === 'gemini' && !apiKey) {
            console.error("Server Error: Missing GEMINI_API_KEY environment variable");
            return new Response(JSON.stringify({ error: 'Server configuration error. Please contact support.' }), {
                status: 500,
                headers: corsHeaders
            });
        }
        if (aiProvider === 'openai' && !openaiKey) {
            console.error("Server Error: Missing OPENAI_API_KEY environment variable");
            return new Response(JSON.stringify({ error: 'Server configuration error. Please contact support.' }), {
                status: 500,
                headers: corsHeaders
            });
        }

        let prompt = "";
        if (type === 'CRISP') {
            prompt = "Act as a professional high-end photo retoucher. Enhance this image to look like a high-end professional studio photo. 8k resolution, ultra-crisp details, perfect lighting, denoised, sharp textures, professional color grading. Do not change the subject or composition, just maximize technical quality.";
        } else if (type === 'MASK') {
            prompt = "Perform a high-precision foreground extraction. Identify the main subject and create a perfect alpha mask/cutout. The resulting image should have the subject on a transparent background. High precision edges and professional detail retention.";
        } else if (type === 'FACE_SWAP') {
            prompt = `Perform a professional seamless face edit/swap based on this request: "${promptModifier || 'Change the face to look like a high-fashion model'}". Ensure the lighting, skin tone, and perspective match the original image perfectly for a hyper-realistic result.`;
        } else {
            prompt = `Perform a high-quality creative enhancement based on: "${promptModifier || 'Enhance the image aesthetically'}". Maintain the original artist's intent while upscaling, improving lighting, and adding professional depth. High resolution professional render.`;
        }

        const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

        // === PROVIDER SWITCH ===
        if (aiProvider === 'openai') {
            // OpenAI-compatible API (works with gpt-oss, Groq, OpenRouter, etc.)
            const openaiResponse = await fetch(`${openaiBase}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiKey}`
                },
                body: JSON.stringify({
                    model: aiModel,
                    messages: [
                        {
                            role: 'user',
                            content: [
                                { type: 'text', text: prompt },
                                { type: 'image_url', image_url: { url: `data:image/png;base64,${cleanBase64}` } }
                            ]
                        }
                    ],
                    max_tokens: 4096
                })
            });

            if (!openaiResponse.ok) {
                const errText = await openaiResponse.text();
                console.error('OpenAI API Error:', errText);
                return new Response(JSON.stringify({ error: 'AI processing failed. Check your API configuration.' }), {
                    status: 500,
                    headers: corsHeaders
                });
            }

            const openaiData = await openaiResponse.json();
            // Note: OpenAI text models don't generate images directly
            // For image generation, you'd need DALL-E or a different endpoint
            // This returns the text response for now
            const textResponse = openaiData.choices?.[0]?.message?.content || 'No response';

            return new Response(JSON.stringify({
                image: base64Image, // Return original (OpenAI text models can't edit images)
                aiAdvice: textResponse // Include AI analysis
            }), {
                status: 200,
                headers: corsHeaders
            });
        }

        // Default: Gemini
        const ai = new GoogleGenAI({ apiKey: apiKey! });

        const response = await ai.models.generateContent({
            model: aiModel,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: 'image/png',
                            data: cleanBase64
                        }
                    },
                    { text: prompt }
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part && part.inlineData && part.inlineData.data) {
            const resultImage = `data:image/png;base64,${part.inlineData.data}`;
            return new Response(JSON.stringify({ image: resultImage }), {
                status: 200,
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'No image generated. Please try again.' }), {
            status: 500,
            headers: corsHeaders
        });

    } catch (error) {
        console.error("Gemini Enhance Error:", error);

        // Check for specific error types
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('quota') || errorMessage.includes('rate')) {
            return new Response(JSON.stringify({ error: 'API rate limit reached. Please try again later.' }), {
                status: 429,
                headers: corsHeaders
            });
        }

        return new Response(JSON.stringify({ error: 'Failed to process image. Please try again.' }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
