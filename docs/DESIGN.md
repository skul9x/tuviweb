# 🎨 DESIGN: Tùy chọn Số Điện Thoại

**Ngày tạo:** 2026-03-14
**Dựa trên:** [BRIEF.md](file:///home/skul9x/Desktop/Test_code/tuviweb-main/docs/BRIEF.md) & [Implementation Plan](file:///home/skul9x/.gemini/antigravity/brain/d7d8c380-6e66-4f0d-b7d8-51290a14b0bf/implementation_plan.md)

---

## 1. Cách Lưu Thông Tin (Database)

Dữ liệu sẽ được gửi tới bảng `laso_sync` trong Supabase.

| Trường | Kiểu dữ liệu | Mô tả |
|---|---|---|
| `phone_number` | text (nullable) | Số điện thoại người dùng hoặc `null` nếu không nhập |
| `laso_data` | jsonb | Chứa toàn bộ object `UserInfoResult` |

**Luồng dữ liệu:**
1. `InputForm` thu thập dữ liệu (phone có thể là chuỗi rỗng `""`).
2. `InputForm` chuyển `""` thành `null` trước khi đóng gói vào `UserInfo`.
3. `SupabaseService` nhận `UserInfo` và chèn vào database.

---

## 2. Thiết Kế Màn Hình (UI)

### Màn hình: Form Nhập Liệu
- **Trường Số Điện Thoại:**
    - Label: `Số Điện Thoại (Tùy chọn)`
    - Placeholder: `Nhập số điện thoại...`
    - Logic: Xóa thuộc tính `required`.

---

## 3. Luồng Hoạt Động (User Journey)

### Hành trình: Xem lá số nhanh (Không nhập SĐT)
1. Người dùng mở web.
2. Nhập Tên, Ngày/Tháng/Năm sinh.
3. **Bỏ qua** ô Số điện thoại.
4. Nhấn "An Sao & Luận Giải".
5. Hệ thống bỏ qua bước validation SĐT.
6. Kết quả lá số hiển thị ngay lập tức.

---

## 4. Checklist Kiểm Tra & Test Cases

### 🧪 Test Cases

#### TC-01: Luồng chuẩn (Có nhập SĐT)
- **Given:** Form nhập liệu đang mở.
- **When:** Nhập SĐT đúng (VD: 0912345678) và submit.
- **Then:** ✓ Lưu thành công, hiển thị lá số.

#### TC-02: Luồng bỏ trống (Không nhập SĐT)
- **Given:** Form nhập liệu đang mở.
- **When:** Để trống SĐT và click "An Sao".
- **Then:** ✓ Không báo lỗi "Required", lưu thành công với giá trị `null`, hiển thị lá số.

#### TC-03: Validation định dạng (Nhập sai)
- **Given:** Form nhập liệu đang mở.
- **When:** Nhập "123456" vào ô SĐT và submit.
- **Then:** ✓ Hiện thông báo lỗi định dạng (vì nếu đã nhập thì phải nhập đúng).

#### TC-04: Xử lý khoảng trắng
- **Given:** Người dùng nhập vài dấu cách vào ô SĐT.
- **When:** Submit.
- **Then:** ✓ Hệ thống tự trim và coi như là `null`.

---
*Tạo bởi AWF 4.0 - Design Phase*
