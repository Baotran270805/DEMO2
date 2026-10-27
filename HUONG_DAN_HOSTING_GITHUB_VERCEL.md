# HƯỚNG DẪN: Đưa JournalDesk từ máy Windows lên Vercel qua GitHub

**Mục tiêu:** `Máy Windows -> Repository GitHub mới -> Vercel -> Website công khai`.

Website dùng HTML, CSS và JavaScript thuần. Không cần Azure, Backend, MySQL, Node package, `npm install` hoặc `npm run build`. Node.js chỉ dùng để mở trang trên máy local trong bước kiểm tra.

## Bước 1. Giải nén thành thư mục dự án mới

- Tải `journal-submission-demo.zip`.
- Trong File Explorer, giải nén ZIP vào thư mục `D:\LTW_2026`.
- Đường dẫn cuối cùng: `D:\LTW_2026\journal-submission-demo`.
- Mở thư mục dự án bằng Visual Studio Code (**File -> Open Folder**).
- Kiểm tra phải nhìn thấy `public`, `server.mjs`, `vercel.json` và `README.md` ngay trong thư mục dự án.

> Nếu có đường dẫn `...\journal-submission-demo\journal-submission-demo`, bạn đã lồng thừa một cấp thư mục. Hãy đi vào thư mục có file `server.mjs` rồi làm việc ở đó.

## Bước 2. Chạy trên máy trước

Trong VS Code, chọn **Terminal -> New Terminal** (PowerShell):

```powershell
cd D:\LTW_2026\journal-submission-demo
node server.mjs
```

Nếu Node.js đã cài, Terminal hiển thị:

```text
JournalDesk local: http://localhost:5500
```

Mở `http://localhost:5500` trên Edge/Chrome. Thử:

- Trang Tổng quan: có 6 hồ sơ minh họa.
- Chọn **Nộp bài mới**, điền thông tin và lưu. Hồ sơ mới hiện ở **Bài đã gửi**.
- Tìm kiếm, lọc trạng thái và xem chi tiết.
- Thử tải lại trang: dữ liệu mới vẫn còn trong cùng trình duyệt.

Dừng máy chủ bằng `Ctrl + C`.

Nếu máy không có Node.js, có thể mở `public/index.html` bằng VS Code Live Server. Cách mở trực tiếp file HTML bằng `file://` có thể khiến `localStorage` hoạt động khác nhau giữa các trình duyệt, nên nên dùng máy chủ local.

## Bước 3. Tạo repository GitHub hoàn toàn mới

1. Đăng nhập GitHub.
2. Mở `https://github.com/new`.
3. Ở **Repository name**, nhập `journal-submission-demo`.
4. Chọn `Public` (dễ xem bài thực hành), hoặc `Private` nếu không muốn công khai mã nguồn.
5. **KHÔNG** đánh dấu Add a README, Add .gitignore hoặc Choose a license vì thư mục đã có các file này.
6. Nhấn **Create repository**.

Repository mới hoàn toàn độc lập với `QLTC` cũ.

## Bước 4. Đẩy thư mục local lên GitHub

Mở PowerShell **tại thư mục gốc dự án**, không chạy trong `public`:

```powershell
cd D:\LTW_2026\journal-submission-demo

git init
git add .
git commit -m "Initial JournalDesk static website"
git branch -M main
```

Nếu `git commit` yêu cầu nhận diện, chỉ cần cấu hình tên/email Git trên máy (dùng email của tài khoản GitHub):

```powershell
git config --global user.name "Ten cua ban"
git config --global user.email "email@github-cua-ban"
```

Sau đó chạy lại `git commit`.

Nếu bạn sử dụng cùng tài khoản GitHub như dự án trước, thêm địa chỉ repository:

```powershell
git remote add origin https://github.com/Baotran270805/journal-submission-demo.git
git push -u origin main
```

Nếu dùng tài khoản GitHub khác, thay `Baotran270805` bằng username tương ứng. Git có thể yêu cầu đăng nhập qua trình duyệt/Git Credential Manager. **Không dán token hoặc mật khẩu GitHub vào mã nguồn.**

Mở repository trên GitHub. Kiểm tra có đầy đủ `public/`, `server.mjs`, `vercel.json`, `README.md`, `HUONG_DAN_HOSTING_GITHUB_VERCEL.md`.

## Bước 5. Kết nối GitHub với Vercel

1. Truy cập `https://vercel.com/new`.
2. Đăng nhập Vercel bằng **Continue with GitHub**.
3. Chọn **Add New -> Project** nếu chưa ở trang tạo mới.
4. Trong danh sách Git repositories, tìm `journal-submission-demo`.
5. Nhấn **Import**. Nếu không thấy repository, nhấn cấu hình quyền GitHub của Vercel và cấp quyền truy cập repository mới.

Tại **Configure Project**, kiểm tra:

| Trường | Giá trị |
|---|---|
| Project Name | `journal-submission-demo` (hoặc tên bạn thích) |
| Framework Preset | **Other** |
| Root Directory | **`./`** — thư mục gốc repository |
| Build Command | **Để trống**; nếu có Override thì bật Override và xóa nội dung |
| Output Directory | **`public`** (đã khai báo trong `vercel.json`) |
| Environment Variables | **Không cần** |

Nhấn **Deploy**. Trang web sẽ có URL thật dạng `https://<ten-project>.vercel.app`, do Vercel cấp.

> Không chọn Next.js, vì dự án này là HTML/CSS/JS thuần, không có `package.json`.

## Bước 6. Kiểm tra hosting thành công

Trên URL Vercel:

1. Nhìn thấy JournalDesk và các thẻ thống kê.
2. Nhấn **Bài đã gửi** để xem danh sách.
3. Nộp một bài demo, tải lại trang để kiểm tra lưu trong trình duyệt.
4. Mở thử từ điện thoại: giao diện tự thu gọn và có nút mở menu.

**Quan trọng:** dữ liệu demo trên localhost không tự có trên Vercel và ngược lại. Mỗi trình duyệt/tên miền có khu vực lưu `localStorage` riêng. Không có đồng bộ hay tải bản thảo lên máy chủ.

## Bước 7. Cập nhật giao diện và tự động deploy

Ví dụ sửa dòng tiêu đề `JournalDesk` trong `public/index.html` bằng VS Code. Lưu bằng `Ctrl+S`.

Sau đó trong PowerShell:

```powershell
cd D:\LTW_2026\journal-submission-demo
git add .
git commit -m "Update JournalDesk interface"
git push origin main
```

Mở Vercel Dashboard -> Project -> **Deployments** để kiểm tra deployment mới. Mỗi push lên nhánh Production (`main`) sẽ tự tạo bản triển khai mới.

## Xử lý lỗi thường gặp

**404 Not Found sau khi deploy:** Kiểm tra GitHub có `public/index.html`; Root Directory phải là `./`, Output Directory phải là `public`, Framework Preset phải là `Other`.

**Vercel đòi chạy npm hoặc build:** Hãy kiểm tra Framework Preset `Other` và để trống Build Command, vì dự án không có `package.json`.

**Không nhìn thấy repository trong Vercel:** Kiểm tra quyền GitHub integration cho repository mới.

**Git báo `remote origin already exists`:** Chạy `git remote -v` để xem đã liên kết với repository nào. Không chạy lại `git remote add origin` nếu đã có đúng địa chỉ.

**Dữ liệu không hiển thị trên thiết bị khác:** Đây là giới hạn chủ đích của web tĩnh dùng `localStorage`. Muốn đồng bộ nhiều người, cần Backend và database — ngoài phạm vi bản demo này.

## Lưu ý về bảo mật

Không nhập bản thảo thật, thông tin chưa công bố hoặc thông tin cá nhân cần bảo vệ lên bản demo. Dữ liệu văn bản được lưu trong trình duyệt, và trình duyệt tải xuống CSV nếu người dùng nhấn Export; không có cơ chế xác thực, phân quyền, bảo vệ dữ liệu, sao lưu hoặc gửi bài tới tạp chí.

## Nguồn tài liệu

- Vercel Git deployments: https://vercel.com/docs/git
- Vercel Build & Development settings: https://vercel.com/docs/builds/configure-a-build
