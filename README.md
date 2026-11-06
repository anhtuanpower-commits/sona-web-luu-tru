# Web SoNa (khung)
Web tĩnh, chạy được trên GitHub Pages, Cloudflare Pages hoặc bất kỳ chỗ nào miễn phí.
- `site.json`: tên web, khẩu hiệu, Zalo, email, mạng xã hội, chữ các trang. **Không có thông tin thanh toán** (đã gỡ 06/11, bản cũ lưu trong kho `sona-ceo`); kiểm tra dữ liệu chặn nếu thêm lại mục `thanh_toan`. Không bao giờ ghi mật khẩu/OTP.
- `products.json`: mỗi sản phẩm là 1 mục, thêm và sửa trong trang quản trị. Các trường: `ten, loai, nhan, phu_de, diem_nhan[], van_de[], loi_ich[], anh_bia, anh_minh_hoa[], cho_ai, cach_nhan, cam_ket, noi_dung, cau_hoi[], nut, ma_zalo, an`.
- `index.html`: menu App `#app` · Dịch vụ `#dich-vu` (trang con `#dich-vu/<slug>`) · Tài liệu & Ebook `#tai-lieu` · Học miễn phí `#hoc` (bài `/bai/<slug>/`) · Đối tác `#doi-tac` · Liên hệ `#lien-he`; thêm Giới thiệu `#gioi-thieu`. App và dịch vụ dùng một khung chi tiết `#sp/<slug>`. Đường dẫn cũ `#san-pham`, `#thong-tin` vẫn chạy. Giao diện chỉnh qua các biến `--mau-*`, `--chu-*`, `--bo-goc-*`, `--khoang-*` ở đầu khối `<style>`.
- **Không đăng giá (D-045):** web không có giá, không có mã QR thanh toán. Mua hàng chỉ qua nút Liên hệ (Zalo). Luật chặn giá ở `admin/khong-gia.js`, dùng chung cho Admin, kiểm tra dữ liệu, trang SEO và kiểm thử.
Mọi kênh (Facebook, TikTok, Zalo) sẽ dẫn link về `.../#sp/<slug>`.

## Trang quản trị

Vào `…/admin/` để sửa trang chủ, sản phẩm, bài viết, trang riêng, ảnh, liên hệ và SEO mà không cần sửa code.
- Hướng dẫn dùng: `ADMIN_USER_GUIDE.md`
- Kiến trúc và phạm vi: `ADMIN_IMPLEMENTATION_PLAN.md`
- Triển khai, tên miền: `DEPLOYMENT_GUIDE.md`
- Tình trạng: `PROJECT_STATUS.md`

## App đã giao khách

`app/lds-1f8436bb/` là app Lịch Đăng Spa đã giao cho khách và đang dùng. **Giữ nguyên, không sửa, không xóa.** Web không có link nào trỏ tới thư mục này; Admin chỉ đọc mã app để biết ảnh nào app đang dùng (chặn xóa nhầm).
