import type { LasoData } from '../types';

export class AIService {
    constructor() {}

    public async *generateReadingStream(data: LasoData): AsyncGenerator<string> {
        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Lỗi kết nối Server: ${response.status}`);
            }

            if (!response.body) {
                throw new Error('Không nhận được dữ liệu stream từ server');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.replace('data: ', '').trim();
                        if (dataStr === '[DONE]') {
                            return;
                        }
                        
                        let parsed: any = null;
                        try {
                            parsed = JSON.parse(dataStr);
                            if (parsed.error) {
                                throw new Error(parsed.error);
                            }
                            if (parsed.text) {
                                yield parsed.text;
                            }
                        } catch (e: any) {
                            // Ignored parse error on incomplete chunks if any
                            if (e.message !== parsed?.error) {
                                console.warn("Parse stream error:", e);
                            } else {
                                throw e; // throw custom actual error
                            }
                        }
                    }
                }
            }
        } catch (error: any) {
             throw new Error(`Lỗi hệ thống AI: ${error?.message || 'Không rõ nguyên nhân'}`);
        }
    }
}
