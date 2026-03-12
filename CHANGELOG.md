# Changelog

## [2026-03-12] - v1.1.0 (Security & UI Polish)
### Added
- **Vercel Serverless Proxy**: Đã chuyển toàn bộ logic gọi Gemini API sang phía server (`api/gemini.ts`) để bảo mật tuyệt đối API Key.
- **Hỗ trợ Environment Variables**: Sử dụng `GEMINI_API_KEYS` trên Vercel, hỗ trợ nhập nhiều key cách nhau bởi dấu phẩy hoặc xuống dòng.
- **Quick Test Script**: Thêm `scripts/quick-test-keys.ts` để kiểm tra logic lọc key.
- **Giao diện Info Banner**: Tách dòng chú thích SĐT ra thành một khung ngang riêng biệt dưới hàng nhập liệu đầu tiên, giúp Layout cân đối và chuyên nghiệp hơn.

### Changed
- Refactor `AIService.ts`: Gỡ bỏ SDK `@google/generative-ai` ở frontend, chuyển sang sử dụng `fetch` stream tới endpoint nội bộ.
- Cập nhật `vercel.json`: Cấu hình rewrites để hỗ trợ cả Single Page App (SPA) và Serverless Functions (`/api/*`).

### Fixed
- **Lỗi Lộ API Key**: Khắc phục triệt để việc lộ key trên GitHub bằng cách gỡ bỏ hardcode và sử dụng `.env` ẩn.
- Lỗi Build TypeScript: Sửa lỗi Import/Export giữa các module khi gọi chung `prompt-builder`.
- Lỗi Vercel 500: Sửa lỗi cấu hình rewrites dẫn đến việc gọi API bị trả về trang HTML.

### Security
- Cập nhật `.gitignore`: Chặn mọi file `.env` và `*.local` bị đẩy lên GitHub.
- Bảo mật API Key: Sử dụng cơ chế Proxy Backend, người dùng cuối không thể nhìn thấy Key qua Network Tab.

## [2026-03-12] - v1.0.0 (Production Ready)
### Added
- **Bắt buộc & Validate SĐT**: Yêu cầu nhập số điện thoại Việt Nam và thông tin giải thích giúp AI luận giải chính xác hơn.
- Dự án TuViWeb chính thức hoàn thiện bản Web (Vite/TS).
- Tích hợp **Gemini AI** cho luận giải lá số (Streaming).
- Tích hợp **Supabase Sync** để đồng bộ dữ liệu.
- Thiết kế UI Premium (Dark mode + Gold + Glassmorphism).
- Hệ thống Tứ Hóa badges trong 12 cung.
- Tài liệu hướng dẫn `README.md` và `STRUCTURE.md`.
- **Tính năng Copy Prompt**: Nút copy đề bài luận giải với hiệu ứng ánh kim và thông báo Toast.
- **Tài liệu Pháp lý**: Thêm `LEGAL.md` (Privacy Policy & TOS).
- **SEO & Social**: Thêm `og-image.png` và cấu hình Open Graph cho share link.

### Fixed
- **Lỗi hiển thị Combobox**: Sửa màu nền trắng cho danh sách chọn ngày/giờ/phong cách giúp dễ nhìn hơn.
- Lỗi Build TypeScript (Strict indexing).
- Lỗi API Fallback cho Gemini (Cập nhật model names 2026).
- Lỗi `&&` trong PowerShell command.
- **Lỗi Mobile Layout**: Chuyển sang Flexbox cho grid trên màn hình nhỏ để tránh tràn màn hình và chồng chéo ô.

### Security
- Cấu hình `.gitignore` loại bỏ files nội bộ.
- Pushed to GitHub Repository (main branch).
- Cập nhật Git history và đồng bộ hóa an toàn với remote repository.

