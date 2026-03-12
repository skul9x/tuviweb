import { marked } from 'marked';
import { AIService } from '../utils/AIService';
import { Toast } from '../utils/Toast';
import type { LasoData } from '../types';import { buildPromptJson } from '../core/prompt-builder';

export class AIInterpretation {
    private container: HTMLElement;
    private aiService: AIService;

    constructor(containerId: string) {
        const element = document.getElementById(containerId);
        if (!element) throw new Error(`Container with id ${containerId} not found`);
        this.container = element;
        this.aiService = new AIService();
    }

    public async readLaso(data: LasoData) {
        this.container.innerHTML = `
            <div class="glass-card" style="margin-top: var(--space-xl); min-height: 200px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md);">
                    <h2 style="display: flex; align-items: center; gap: 10px; margin: 0;">
                        <span style="font-size: 1.5rem;">🤖</span> Luận Giải AI
                    </h2>
                    <button id="btn-copy-prompt" class="btn-icon-gold" title="Sao chép Prompt gửi AI">
                        <span style="font-size: 1.1rem;">📋</span>
                    </button>
                </div>
                <div id="ai-content" class="markdown-body" style="color: var(--text-primary); line-height: 1.8;">
                    <p style="color: var(--text-muted); font-style: italic;">
                        Đang kết nối với trí tuệ nhân tạo để phân tích tinh hệ...
                    </p>
                </div>
            </div>
        `;

        const copyBtn = document.getElementById('btn-copy-prompt');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const prompt = buildPromptJson(data);
                navigator.clipboard.writeText(prompt).then(() => {
                    Toast.show('Đã sao chép Prompt luận giải!');
                }).catch(err => {
                    console.error('Copy failed:', err);
                    Toast.show('Lỗi khi sao chép!');
                });
            });
        }

        const contentDiv = document.getElementById('ai-content')!;
        let fullText = '';

        try {
            const stream = this.aiService.generateReadingStream(data);
            
            for await (const chunk of stream) {
                fullText += chunk;
                contentDiv.innerHTML = marked.parse(fullText) as string;
                
                // Optional: Auto-scroll
                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }
        } catch (error: any) {
            console.error('AI Error:', error);
            contentDiv.innerHTML = `
                <div style="color: var(--star-ham); padding: var(--space-md); border: 1px dashed var(--star-ham); border-radius: var(--radius-md);">
                    ⚠️ **Lỗi Luận Giải:** ${error.message}<br>
                    <small>Vui lòng kiểm tra lại kết nối mạng hoặc API Key.</small>
                </div>
            `;
        }
    }
}
