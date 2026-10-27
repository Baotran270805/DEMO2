# JournalDesk — Demo quản lý nộp bài tạp chí

Website tiếng Việt mô phỏng một cổng tác giả: thống kê bản thảo, nộp bài mới, tìm kiếm, lọc trạng thái, xem chi tiết, thay đổi trạng thái và xuất CSV.

> **LƯU Ý:** Đây chỉ là website tĩnh phục vụ học tập. Không có tài khoản thật, máy chủ tiếp nhận bài, email thông báo hay database. Dữ liệu được lưu vào `localStorage` trên trình duyệt. Tệp chỉ lưu **tên**, không lưu nội dung hoặc tải lên mạng. Không nhập thông tin cá nhân hoặc bản thảo nghiên cứu cần bảo mật.

## 1. Cấu trúc thư mục

```text
journal-submission-demo/
├── public/
│   ├── index.html          # Giao diện
│   ├── styles.css          # Thiết kế responsive
│   ├── app.js              # Tương tác & lưu dữ liệu localStorage
│   └── assets/
│       └── favicon.svg
├── server.mjs              # Máy chủ xem thử local, không cần cho Vercel
├── vercel.json             # Chỉ định thư mục xuất bản là public
├── .gitignore
└── README.md
```

Không cần chạy `npm install`, không cần Next.js, Backend, NestJS, API, Prisma hoặc MySQL.

## 2. Chạy local trên Windows

Máy đã cài Node.js:

```powershell
cd D:\LTW_2026\journal-submission-demo
node server.mjs
```

Mở: http://localhost:5500

Dừng máy chủ: `Ctrl + C`.

Hoặc mở thư mục `public` bằng tiện ích Live Server của VS Code.

## 3. Triển khai GitHub -> Vercel

1. Vào https://github.com/new và tạo repository **journal-submission-demo**; để trống các tùy chọn khởi tạo README, `.gitignore`, license.
2. Chạy tại thư mục dự án (không phải thư mục `public`):

```powershell
cd D:\LTW_2026\journal-submission-demo
git init
git add .
git commit -m "Initial static journal submission demo"
git branch -M main
git remote add origin https://github.com/<TEN_GITHUB>/journal-submission-demo.git
git push -u origin main
```

Thay `<TEN_GITHUB>` bằng tên GitHub của bạn. Nếu thư mục đã được khởi tạo Git trước đó, không cần lặp `git init`, và kiểm tra `git remote -v` trước khi thêm origin.

3. Vào https://vercel.com/new, đăng nhập GitHub, chọn **Import** repository mới.
4. Ở màn hình Configure Project:
   - **Framework Preset:** `Other`
   - **Root Directory:** `./`
   - **Build Command:** để trống / tắt Override nếu mặc định không có build
   - **Output Directory:** `public` (đã được khai báo trong `vercel.json`)
   - **Environment Variables:** không cần
5. Nhấn **Deploy**. Vercel cấp URL `.vercel.app`.

Cách triển khai chuẩn này được Vercel mô tả tại https://vercel.com/docs/git và https://vercel.com/docs/builds/configure-a-build.

## 4. Cập nhật website sau khi deploy

Ví dụ, sửa dòng `JournalDesk` trong `public/index.html`, lưu file, sau đó:

```powershell
git add .
git commit -m "Update demo website"
git push origin main
```

Vercel sẽ tự tạo một deployment mới từ nhánh `main`.

## 5. Ghi chú về khả năng hoạt động

- Lần đầu mở: website có sẵn 6 hồ sơ **giả lập**; nút “Khôi phục dữ liệu mẫu” sẽ xóa thay đổi và đưa về 6 hồ sơ này.
- Nộp bài mới: lưu các trường văn bản và **tên tệp** trong `localStorage` của trình duyệt.
- Lọc/tìm kiếm và thay đổi trạng thái: xử lý trong JavaScript ngay trên máy người dùng.
- Xuất CSV: tải danh sách bản thảo đang hiển thị. **Không kèm nội dung tệp bản thảo.**
- Đổi trình duyệt, máy tính hoặc xóa dữ liệu website có thể làm mất dữ liệu demo.
- Không có gửi bài thật, không có email tự động, không đăng nhập, không đồng bộ nhiều người dùng.

Khi cần chức năng nộp bài thật (người dùng khác truy cập dữ liệu chung, lưu PDF, quy trình editor/reviewer), dự án cần thêm Backend, hệ thống xác thực và kho lưu trữ an toàn.
