import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// We fetch the API keys from the server environment, NOT the client.
// They will be set in Vercel Dashboard -> Settings -> Environment Variables.
const getApiKeys = () => {
    const keysString = process.env.GEMINI_API_KEYS;
    if (!keysString) return [];
    // Split by comma OR newline, then trim whitespace and filter out empty strings
    return keysString.split(/[,\n]+/).map(k => k.trim()).filter(k => k.length > 5);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const API_KEYS = getApiKeys();
    
    if (API_KEYS.length === 0) {
        return res.status(500).json({ error: 'Server configuration error: No API keys found.' });
    }

    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt in request body' });
        }

        
        const models = [
            "gemini-3-flash-preview",
            "gemini-2.5-flash", 
            "gemini-2.5-flash-lite", 
            "gemini-flash-latest", 
            "gemini-flash-lite-latest"
        ];

        let success = false;
        let lastError: any = null;

        // Note: For a stateless serverless function, rotating keys sequentially across requests 
        // stringently requires a database. Here we just try them in order until one works.
        // Or we could shuffle the array for load balancing.
        const shuffledKeys = [...API_KEYS].sort(() => 0.5 - Math.random());

        // We set up Server-Sent Events (SSE) for streaming back to the client
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        for (const apiKey of shuffledKeys) {
            const genAI = new GoogleGenerativeAI(apiKey);

            for (const modelName of models) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContentStream(prompt);

                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
                        }
                    }

                    success = true;
                    // Send final completion event
                    res.write('data: [DONE]\n\n');
                    res.end();
                    return; // Exit completely on success
                } catch (e: any) {
                    lastError = e;
                    console.warn(`[Backend] Failed with ${modelName} using a key:`, e.message);
                    // Try next model or next key
                }
            }
        }

        if (!success) {
            // If everything failed, we still have to close the stream with an error
            res.write(`data: ${JSON.stringify({ error: `Tất cả API Keys đều thất bại. Lỗi cuối: ${lastError?.message}` })}\n\n`);
            res.end();
        }

    } catch (error: any) {
        console.error("[Vercel API] Global Error:", error);
        // Ensure we send a valid JSON error response
        if (!res.writableEnded) {
            if (res.getHeader('Content-Type') === 'text/event-stream') {
                res.write(`data: ${JSON.stringify({ error: error.message || 'Internal Server Error' })}\n\n`);
                res.end();
            } else {
                res.status(500).json({ error: error.message || 'Internal Server Error' });
            }
        }
    }
}
