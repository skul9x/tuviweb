# 🏗️ Cấu Trúc Thư Mục TuViWeb

Dưới đây là sơ đồ và giải thích cấu trúc mã nguồn của dự án.

## 📁 Tổng Quan

```text
tuvi-web/
├── public/                 # Tài nguyên tĩnh (Logo, Icons)
├── src/
│   ├── components/         # Các thành phần giao diện chính (UI)
│   ├── core/               # Engine tính toán an sao (Logic lõi)
│   ├── styles/             # Hệ thống CSS Design System
│   ├── types/              # Định nghĩa TypeScript Interfaces
│   ├── utils/              # Các dịch vụ ngoại vi (AI, Supabase)
│   ├── main.ts             # Điểm khởi đầu của ứng dụng
│   └── test-integration.ts # Script kiểm thử tích hợp
├── index.html              # File HTML chính
├── package.json            # Quản lý thư viện
├── tsconfig.json           # Cấu hình TypeScript
└── vercel.json             # Cấu hình Deploy Vercel
```

## 🧩 Chi Tiết Thành Phần

### 1. `src/core/` (Bàn não)
- `tuvi-logic.ts`: Chứa class `TuViLogic` xử lý toàn bộ quy trình an sao từ ngày tháng năm sinh.
- `constants.ts`: Hệ thống dữ liệu tĩnh về 110+ vì sao, cách cục, ngũ hành và bảng tra Tứ Hóa.
- `lunar-converter.ts`: Chuyển đổi lịch Tiết khí và Lịch Âm/Dương.

### 2. `src/components/` (Giao diện)
- `InputForm.ts`: Form nhập liệu thông tin đương số với validation.
- `TuViGrid.ts`: Render bàn cờ 4x4, xử lý mapping 12 cung vào đúng tọa độ.
- `AIInterpretation.ts`: Thành phần nhận stream dữ liệu từ AI và hiển thị markdown.

### 3. `src/utils/` (Kết nối)
- `AIService.ts`: Quản lý kết nối tới Google Gemini, hỗ trợ xoay vòng API Keys.
- `SupabaseService.ts`: Xử lý việc đẩy dữ liệu lên Database trong nền.

### 4. `src/styles/` (Thẩm mỹ)
- `variables.css`: Chứa các biến (tokens) về màu sắc Gold, Glassmorphism, Spacing.
- `global.css`: Reset CSS và các utility classes.
```
