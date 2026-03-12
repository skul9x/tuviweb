# 🌌 TuViWeb — Hệ Thống An Sao & Luận Giải Tử Vi AI

TuViWeb là một ứng dụng web hiện đại được chuyển thể từ nền tảng Android, chuyên về an sao lá số Tử Vi Đẩu Số theo hệ thống tinh hệ cổ điển. Ứng dụng tích hợp trí tuệ nhân tạo (Gemini AI) để đưa ra các lời bình giải chi tiết và đồng bộ dữ liệu thời gian thực.

![Premium UI](https://raw.githubusercontent.com/skul9x/tuviweb/main/public/preview-mockup.png) *(Preview placeholder)*

## ✨ Tính Năng Nổi Bật

- **An Sao Chính Xác**: Engine tính toán chuẩn xác 14 chính tinh và hơn 100 phụ tinh theo các quy chuẩn của Thiên Lương, Vân Đằng Thái Thứ Lang.
- **Giao Diện Cao Cấp**: Thiết kế Dark Theme kết hợp hiệu ứng Glassmorphism và Gold accents sang trọng.
- **Luận Giải AI**: Tích hợp Google Gemini AI để phân tích tinh hệ, cách cục và vận hạn dựa trên 6 phong cách luận giải khác nhau.
- **Tứ Hóa Badges**: Hiển thị trực quan trạng thái Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ ngay trên từng cung.
- **Background Sync**: Tự động đồng bộ dữ liệu lá số và thông tin thiết bị lên Supabase cho mục đích lưu trữ và phân tích.
- **Responsive**: Trải nghiệm mượt mà trên cả máy tính (Grid 4x4) và điện thoại (Vertical Stack).

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: Vite + TypeScript + Vanilla CSS.
- **Logic**: Core engine chuyển thể từ Kotlin sang TypeScript.
- **AI**: Google Generative AI (@google/generative-ai).
- **Backend/DB**: Supabase JS SDK.
- **Markdown**: Marked.js để render lời bình từ AI.

## 🚀 Cài Đặt & Phát Triển

1.  **Clone dự án**:
    ```bash
    git clone https://github.com/skul9x/tuviweb.git
    cd tuviweb
    ```

2.  **Cài đặt dependencies**:
    ```bash
    npm install
    ```

3.  **Chạy môi trường Dev**:
    ```bash
    npm run dev
    ```

4.  **Build Production**:
    ```bash
    npm run build
    ```

## 📂 Cấu Trúc Thư Mục

Chi tiết xem tại [STRUCTURE.md](./STRUCTURE.md).

## 📄 Giấy Phép

Dự án này được phát triển bởi **skul9x**. Vui lòng liên hệ tác giả trước khi sử dụng cho mục đích thương mại.
