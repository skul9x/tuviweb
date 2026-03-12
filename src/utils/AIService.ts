import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LasoData } from '../types';
import { buildPromptJson } from '../core/prompt-builder';

export class AIService {
    private static API_KEYS = [
        "AIzaSyDrMZ0e1iMlAAesOGeSZyXRTX1gFjpEE0s",
        "AIzaSyC_KVRCwPmOjDNFC89YXLo7Ql3i_cg6loA",
        "AIzaSyAfyY-Mb4VjucikOIV6L--spFUzwbXg9AY",
        "AIzaSyDJvfFl-oEdaY8xZjLOXr0F0tfgmjFLcVs",
        "AIzaSyDZKUHwv4YOqwXinmdAFphYL4jdmggRioE"
    ];

    private currentKeyIndex = 0;

    constructor() {}

    public async *generateReadingStream(data: LasoData): AsyncGenerator<string> {
        const prompt = this.constructPrompt(data);
        const models = [
            "gemini-3-flash-preview",
            "gemini-2.5-flash", 
            "gemini-2.5-flash-lite", 
            "gemini-flash-latest", 
            "gemini-flash-lite-latest"
        ];
        
        let success = false;
        let lastError: any = null;

        for (let i = 0; i < AIService.API_KEYS.length; i++) {
            const apiKey = AIService.API_KEYS[this.currentKeyIndex];
            const genAI = new GoogleGenerativeAI(apiKey);

            for (const modelName of models) {
                try {
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContentStream(prompt);

                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) yield chunkText;
                    }

                    success = true;
                    return; // Exit completely on success
                } catch (e: any) {
                    lastError = e;
                    console.warn(`Failed with ${modelName} using key ${this.currentKeyIndex}:`, e.message);
                    // Try next model or next key
                }
            }
            
            // Rotate to next key
            this.currentKeyIndex = (this.currentKeyIndex + 1) % AIService.API_KEYS.length;
        }

        if (!success) {
            throw new Error(`Tất cả API Keys đều thất bại. Lỗi cuối: ${lastError?.message}`);
        }
    }

    public constructPrompt(data: LasoData): string {
        return buildPromptJson(data);
    }
}
