import { GoogleGenerativeAI } from '@google/generative-ai';
import type { LasoData } from '../types';

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

    private constructPrompt(data: LasoData): string {
        // Porting the structured prompt from the Android version
        const info = data.info;
        const palaces = data.cung;

        return `
Bạn là một AI chuyên luận TỬ VI ĐẨU SỐ theo hệ thống tinh hệ cổ điển.
Xưng hô: 'Tôi' hoặc 'Tại hạ', gọi người xem là 'Đương số'.
Phong cách: ${info.readingStyle}.

THÔNG TIN LÁ SỐ:
- Đương số: ${info.name} (${info.gender})
- Ngày sinh Âm lịch: ${info.lunarDate} (${info.canChi})
- Mệnh: ${info.menhNguHanh} - Cục: ${info.cuc}
- Cung Mệnh tại: ${info.menhTai} - Cung Thân tại: ${info.thanTai}
- Quan hệ Mệnh-Cục: ${info.cucMenhRelation}

DỮ LIỆU 12 CUNG:
${palaces.map(c => `
- Cung ${c.name} (${c.chucNang}) [Cung ${c.canChi}]:
+ Chính tinh: ${c.chinhTinh.join(', ') || 'Vô chính diệu'}
+ Phụ tinh: ${c.phuTinh.join(', ')}
`).join('\n')}

QUY TRÌNH PHÂN TÍCH:
1. Tóm tắt cấu trúc lá số, thế đứng của các chính tinh.
2. Đánh giá Mệnh-Thân-Cục và sự tương quan ngũ hành.
3. Luận giải chi tiết 12 cung (Mệnh, Phu Thê, Quan Lộc, Tài Bạch là trọng điểm).
4. Phân tích vận hạn năm ${info.viewingYear}.
5. Kết luận tổng thể.

YÊU CẦU:
- Mọi nhận định PHẢI có căn cứ từ sao và cung.
- Sử dụng ngôn ngữ chuyên môn nhưng dễ hiểu.
- Phân tích tương quan tam hợp, xung chiếu.
- Nếu cung Vô chính diệu, phải mượn sao cung đối để luận.

Bắt đầu luận giải:
`;
    }
}
