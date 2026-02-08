import { GoogleGenAI } from "@google/genai";
import { scanForThreats } from "../services/mrx/core";

export const config = {
    runtime: 'edge',
};

// CORS headers for cross-origin requests
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

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

        // --- MR. X SECURITY LAYER (Layer 3) ---
        const scanResult = scanForThreats(body);
        if (scanResult.isThreat) {
            return new Response(JSON.stringify({
                error: 'Security threat detected',
                threats: scanResult.threats
            }), {
                status: 403,
                headers: corsHeaders
            });
        }

        const { imageContext } = body;

        // --- ROBUST VALIDATION (Server-Side) ---
        if (!imageContext || typeof imageContext !== 'string') {
            return new Response(JSON.stringify({ error: 'Invalid or missing imageContext' }), {
                status: 400,
                headers: corsHeaders
            });
        }

        if (imageContext.length > 1000) {
            return new Response(JSON.stringify({ error: 'imageContext too long. Max 1000 characters.' }), {
                status: 400,
                headers: corsHeaders
            });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("Server Error: Missing GEMINI_API_KEY environment variable");
            return new Response(JSON.stringify({ error: 'Server configuration error. Please contact support.' }), {
                status: 500,
                headers: corsHeaders
            });
        }

        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-exp',
            contents: [{
                role: 'user',
                parts: [{
                    text: `Analyze this image description and generate 5 short, punchy, trendy, one-word or two-word captions.
                    Image Context: ${imageContext}
                    
                    Rules:
                    1. Return ONLY a JSON array of strings.
                    2. No markdown formatting (no \`\`\`json).
                    3. No extra text or explanations.
                    4. Keep them modern and social-media friendly.`
                }]
            }],
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        const text = part?.text?.trim() || "[]";

        // Basic cleanup just in case
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();

        let captions = [];
        try {
            captions = JSON.parse(jsonStr);
            // Validate it's an array of strings
            if (!Array.isArray(captions)) {
                throw new Error('Invalid response format');
            }
        } catch (e) {
            console.warn("Failed to parse JSON from Gemini:", text);
            captions = ["EPIC", "FRESH", "HUSTLE", "FUTURE", "VIBE"]; // Fallback
        }

        return new Response(JSON.stringify({ captions }), {
            status: 200,
            headers: corsHeaders
        });

    } catch (error) {
        console.error("Gemini Caption Error:", error);
        return new Response(JSON.stringify({ error: 'Failed to generate captions. Please try again.' }), {
            status: 500,
            headers: corsHeaders
        });
    }
}
