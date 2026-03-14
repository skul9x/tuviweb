# 💡 BRIEF: Tùy chọn Số Điện Thoại

**Ngày tạo:** 2026-03-14
**Trạng thái:** Brainstorming

---

## 1. VẤN ĐỀ CẦN GIẢI QUYẾT
Hiện tại, người dùng bắt buộc phải nhập số điện thoại mới có thể xem lá số. Điều này có thể khiến một số người dùng cảm thấy e ngại về quyền riêng tư và bỏ qua việc sử dụng ứng dụng.

## 2. GIẢI PHÁP ĐỀ XUẤT
Chuyển trường "Số điện thoại" từ **Bắt buộc** sang **Tùy chọn**. Người dùng có thể nhập để được cá nhân hóa tốt hơn hoặc để trống nếu muốn nhanh chóng xem kết quả.

## 3. ĐỐI TƯỢNG SỬ DỤNG
- Người dùng mới muốn trải nghiệm thử.
- Người dùng coi trọng quyền riêng tư.

## 4. TÍNH NĂNG & THAY ĐỔI

### 🚀 MVP (Bắt buộc có):
- [ ] Thay đổi nhãn thành **Số Điện Thoại (Tùy chọn)**.
- [ ] Bỏ thuộc tính `required` ở input Phone trong `InputForm.ts`.
- [ ] Cập nhật logic validation: Chỉ validate định dạng NẾU người dùng có nhập.
- [ ] Nếu để trống, gửi dữ liệu là `null` lên hệ thống.

### 🎁 Phase 2 (Làm sau):
- [ ] Thêm thông báo nhấn mạnh lợi ích của việc để lại SĐT (nhận bản tin, lưu lại lịch sử dễ dàng hơn).

## 5. ƯỚC TÍNH SƠ BỘ
- **Độ phức tạp:** 🟢 Dễ làm (Chỉ cần sửa vài dòng code frontend).
- **Rủi ro:** Em đã kiểm tra, hệ thống sẽ **KHÔNG bị lỗi** vì biến này đã được xử lý linh hoạt trong code.

## 6. BƯỚC TIẾP THEO
→ Thực hiện chỉnh sửa code.
