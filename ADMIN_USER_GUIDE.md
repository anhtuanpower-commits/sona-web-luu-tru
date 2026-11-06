# Hướng dẫn sử dụng Admin SONA

Trang quản trị giúp anh chị tự sửa web SONA mà không cần đụng vào code: trang chủ, sản phẩm, bài viết, trang riêng, ảnh, thông tin liên hệ và SEO.

## 1. Đường dẫn vào Admin

| Khi nào | Địa chỉ |
|---|---|
| Hiện tại | https://anhtuanpower-commits.github.io/sona-web/admin/ |
| Sau khi gắn tên miền riêng | https://tenmien-cua-anh/admin/ |

Admin là một thư mục `admin/` nằm cùng web, nên đổi tên miền thì Admin đổi theo, không phải làm gì thêm.

## 2. Tạo tài khoản Admin đầu tiên (làm một lần)

Tài khoản Admin chính là **tài khoản GitHub đang giữ kho web** (`anhtuanpower-commits`). Không có mật khẩu mặc định nào nằm trong code. Để đăng nhập, anh chị tạo một **mã truy cập** (giống chìa khóa riêng cho Admin):

1. Đăng nhập GitHub, mở https://github.com/settings/personal-access-tokens/new
2. **Token name**: `Quản trị SONA`. **Expiration**: 90 ngày (hết hạn thì tạo mã mới, mã cũ tự mất tác dụng).
3. **Repository access**: chọn **Only select repositories**, chọn kho **sona-web**.
4. **Repository permissions**:
   - **Contents**: **Read and write** (bắt buộc, để lưu thay đổi).
   - **Actions**: **Read-only** và **Pages**: **Read-only** (nên có, để Tổng quan hiện tình trạng đăng web).
5. Bấm **Generate token**, chép mã bắt đầu bằng `github_pat_`.

Giữ mã này như chìa khóa nhà: không gửi qua Zalo, không dán vào chỗ khác. Lỡ lộ mã: vào GitHub → Settings → Developer settings → Personal access tokens → **Delete** mã đó, rồi tạo mã mới.

## 3. Đăng nhập và đăng xuất

1. Mở đường dẫn Admin, dán mã vào ô **Mã truy cập GitHub**, bấm **Đăng nhập**.
2. **Ghi nhớ trên máy này 30 ngày**: chỉ bật trên máy riêng. Để tắt thì đóng trình duyệt là phải đăng nhập lại.
3. Đăng xuất: bấm vào tên mình ở góc trên bên phải → **Đăng xuất**. Mã được xóa khỏi máy.

Muốn xem thử mà không sửa gì: bấm **Dùng thử với dữ liệu thật, không lưu lên web**.

## 4. Màn hình chính

- **Menu bên trái** (trên điện thoại bấm nút ☰): Tổng quan, Trang chủ, Trang, Sản phẩm, Bài viết, Thư viện ảnh, Cấu hình web, SEO, Hướng dẫn.
- **Ô tìm kiếm** trên cùng: gõ tên sản phẩm, bài viết, trang để mở nhanh.
- **Tổng quan**: số sản phẩm, bài viết, trang, ảnh; các lỗi hoặc cảnh báo cần xử lý (bấm vào để sửa); lịch sử cập nhật gần đây; tình trạng đăng web.

Lưu xong, web thật cập nhật sau khoảng **1–2 phút**. Mở web và kéo xuống để tải lại là thấy.

## 5. Sửa trang chủ

Menu **Trang chủ**:

- **Khẩu hiệu** (một câu duy nhất cho cả web, hiện là "Công nghệ cho mọi người") và **Mô tả dưới tiêu đề**.
- **Ảnh banner**: bấm **Chọn ảnh**, chọn ảnh có sẵn hoặc **Tải ảnh mới**.
- **Nút chính**: điền chữ trên nút và nơi nút dẫn tới (ví dụ `#san-pham`, `#hoc`, `#gioi-thieu`, `#lien-he`, `#sp/duong-dan-san-pham` hoặc link `https://…`).
- **Cam kết của SONA**: các ô dưới phần đầu trang, mỗi dòng `Tiêu đề: mô tả`.
- **Ô tìm kiếm** và **Bộ lọc loại sản phẩm** (ở trang Sản phẩm): bật hoặc tắt.
- **Tiêu đề khối sản phẩm** ở trang chủ (mặc định "Sản phẩm của SONA"; trang chủ hiện 3 sản phẩm đầu theo thứ tự trong mục Sản phẩm).

Bấm **Xem trước** để xem trên khung điện thoại hoặc máy tính, rồi bấm **Lưu thay đổi**. Ô nào để trống thì web giữ chữ mặc định như hiện nay.

## 6. Thêm hoặc sửa sản phẩm

Menu **Sản phẩm** → **Thêm sản phẩm** (hoặc bấm vào sản phẩm có sẵn):

Mỗi sản phẩm dùng chung một khung trang (D-051, PV-015). **Dịch vụ** cũng thêm ở đây, chọn Loại "Dịch vụ": dịch vụ tự vào menu con Dịch vụ, trang `#dich-vu` và trang chủ; trang chi tiết ở `#dich-vu/<đường-dẫn>`. Sản phẩm Loại "Tài liệu" đang hiện tự vào trang Tài liệu & Ebook. Mục nào để trống thì web tự ẩn mục đó.

1. **Thông tin chính**: Tên, Loại (App, Tài liệu, Dịch vụ), Nhãn nhỏ, Mô tả ngắn, Điểm nhấn (mỗi dòng một ý ngắn).
2. **Vấn đề giải quyết**: mỗi dòng một vấn đề khách đang gặp.
3. **Tính năng chính**: mỗi dòng một tính năng, viết `Tên: mô tả` để có tiêu đề riêng.
4. **Hình ảnh**: Ảnh bìa (ngang 16:9) và Ảnh màn hình. **Chỉ dùng ảnh chụp với dữ liệu mẫu**, không dùng dữ liệu khách thật.
5. **Dành cho ai**: mỗi dòng một kiểu khách phù hợp.
6. **Nội dung chi tiết** (không bắt buộc), **Câu hỏi thường gặp**, **Cách bắt đầu** (mỗi dòng một bước), **Cam kết** (chỉ ghi điều đã được duyệt).
7. **Nút Liên hệ**: chữ trên nút và mã tin nhắn Zalo (ví dụ `SPAPRO`).

**Web không đăng giá (D-045).** Không có ô giá; nếu gõ số tiền (ví dụ số kèm "đ", "k", "triệu") vào bất kỳ ô nào, Admin báo lỗi và không cho lưu. Khách hỏi giá qua nút Liên hệ.

8. Bên phải (trên điện thoại ở thanh dưới cùng): bật **Hiện trên web**, bấm **Xem trước**, rồi **Lưu sản phẩm**.

Sản phẩm mới mặc định **đang ẩn**, để anh chị xem trước cho chắc rồi mới bật. Đổi thứ tự trên web: ở danh sách sản phẩm, bấm mũi tên lên, xuống.

## 7. Đăng bài viết

Menu **Bài viết** → **Viết bài mới**:

1. **Tiêu đề**, **Thư mục** (Bắt đầu, Viết nội dung, Chăm khách…), **Ngày đăng**.
2. **Tóm tắt**, **Làm ngay 1 việc**, **Nội dung**. Thanh nút trên ô nội dung giúp in đậm, thêm tiêu đề nhỏ, danh sách, câu mẫu có nút Chép, link, ảnh.
3. **Ảnh đại diện**, **Gợi ý sản phẩm cuối bài** nếu muốn.
4. Bấm **Lưu nháp** để viết tiếp sau (khách chưa thấy), hoặc **Xuất bản**.

Bài đã xuất bản muốn gỡ xuống: **Chuyển về nháp**. Bài học tự động hằng ngày cũng hiện trong danh sách này và sửa được như bài thường.

## 8. Trang riêng

Menu **Trang** → **Tạo trang mới**: dùng cho Chính sách đổi trả, Hướng dẫn… Bật **Hiện link ở chân trang web** để khách thấy link dưới cuối mọi trang. Trang **Các trang hệ thống** sửa chữ cho Giới thiệu, Dịch vụ, Tài liệu & Ebook, Học miễn phí, Đối tác SONA (kể cả link Google Form đăng ký, để trống thì ẩn nút) và Liên hệ. Không ghi giá ở bất kỳ trang nào (D-045).

## 9. Thay ảnh

Menu **Thư viện ảnh**:

- **Tải ảnh lên**: nhận JPG, PNG, WEBP. Ảnh to quá 1600 điểm ảnh hoặc nặng quá 1,5 MB sẽ tự thu nhỏ. File không phải ảnh bị từ chối.
- Bấm vào một ảnh để xem dung lượng, kích thước, **đang dùng ở đâu**.
- **Thay ảnh**: đổi ảnh mới mà mọi chỗ đang dùng tự đổi theo.
- **Xóa ảnh**: chỉ xóa được ảnh chưa nội dung nào dùng.

## 10. Cập nhật thông tin liên hệ

Menu **Cấu hình web**: tên web, logo, favicon, Zalo, hotline, email, địa chỉ, Facebook, TikTok, YouTube, dòng chữ chân trang và **tài khoản nhận tiền** (mã QR). Chỉ ghi thông tin **nhận** tiền công khai, **không bao giờ** ghi mật khẩu hay mã OTP; Admin sẽ chặn nếu thấy.

## 11. SEO

Menu **SEO**: tiêu đề và mô tả hiện trên Google, ảnh khi chia sẻ link lên Facebook, Zalo, và **địa chỉ web chính thức** (đổi khi gắn tên miền). Mục **Kiểm tra SEO toàn web** liệt kê nội dung còn thiếu mô tả hoặc trùng tiêu đề. Mỗi sản phẩm, bài viết, trang cũng có ô SEO riêng.

Link chia sẻ đẹp: sản phẩm `…/sp/duong-dan/`, bài viết `…/bai/duong-dan/`, trang `…/trang/duong-dan/`. GitHub tự tạo các trang này sau mỗi lần lưu.

## 12. Thêm người quản trị

1. Người đó tạo tài khoản GitHub.
2. Chủ kho mở https://github.com/anhtuanpower-commits/sona-web/settings/access → **Add people**, chọn quyền **Write** (được sửa) hoặc **Read** (chỉ xem).
3. Người đó tự tạo mã truy cập của mình (mục 2) và đăng nhập.

Gỡ quyền: bấm **Remove** ở cùng trang, người đó mất quyền sửa ngay. Admin chỉ có hai mức thực sự được GitHub kiểm soát: **sửa được** hoặc **chỉ xem**.

## 13. Lỡ sửa sai

Mọi lần lưu đều nằm trong lịch sử GitHub: https://github.com/anhtuanpower-commits/sona-web/commits/main. Xem được ai sửa gì, lúc nào, và khôi phục bản cũ (nhờ người dựng web nếu chưa quen).

Nếu hai người sửa cùng một bài, trang hoặc sản phẩm, Admin sẽ chặn bản lưu cũ để không ghi đè bản mới. Chép phần đang sửa sang chỗ tạm, tải lại trang để lấy bản mới nhất, rồi bổ sung nội dung và lưu lại.

## 14. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| "Phiên đăng nhập đã hết hạn hoặc mã truy cập không đúng" | Mã hết hạn hoặc bị xóa. Tạo mã mới (mục 2). |
| "Tài khoản hoặc mã truy cập này chưa có quyền" | Mã thiếu quyền **Contents: Read and write**, hoặc tài khoản chỉ có quyền Read. |
| "Dữ liệu đang được sửa liên tục ở nơi khác" | Đợi một chút rồi bấm Lưu lại. |
| Lưu rồi mà web chưa đổi | Đợi 1–2 phút, tải lại trang. Xem **Tình trạng xuất bản** ở Tổng quan. |
| Chữ đỏ dưới ô nhập | Sửa đúng ô đó rồi lưu lại; Admin không lưu dữ liệu sai lên web. |
