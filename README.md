# Task Controller v2 — build lại từ đầu

Freelancer OS — quản lý dự án, hoá đơn, khách hàng & CTV. Next.js 14 (App Router) + Prisma + Postgres (Supabase) + NextAuth (Google).

## 1. Cài đặt

```bash
npm install
```

## 2. Tạo project Supabase (miễn phí)

1. Vào https://supabase.com → New Project.
2. Vào **Project Settings → Database → Connection string → URI**, copy chuỗi kết nối (nhớ thay `[PASSWORD]` bằng mật khẩu bạn đặt lúc tạo project).
3. Dán vào `.env` ở biến `DATABASE_URL`.

## 3. Tạo Google OAuth Client

1. Vào https://console.cloud.google.com/apis/credentials, tạo project mới (hoặc dùng project có sẵn) với account **hoangkhoinhiepanh@gmail.com**.
2. Tạo **OAuth 2.0 Client ID** loại "Web application".
3. Authorized redirect URIs thêm:
   - `http://localhost:3000/api/auth/callback/google` (chạy local)
   - `https://<domain-vercel-cua-ban>/api/auth/callback/google` (sau khi deploy)
4. Copy Client ID / Client Secret vào `.env`.

## 4. Cấu hình .env

```bash
cp .env.example .env
# rồi điền DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET
```

Tạo `NEXTAUTH_SECRET` bằng lệnh:
```bash
openssl rand -base64 32
```

## 5. Khởi tạo database + seed dữ liệu mẫu

**Tuỳ chọn — bật Upload file & Email OTP ký hợp đồng:**
- *Upload file (tab Tài nguyên):* Supabase Dashboard → Storage → New bucket → tên `resources`, tick **Public bucket**. Rồi vào Project Settings → API → copy `Project URL` + `anon public key` vào `.env` (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- *Email OTP ký hợp đồng:* đăng ký https://resend.com (free) lấy API key, điền `RESEND_API_KEY` vào `.env`. Không điền vẫn chạy được, chỉ là không gửi email thật.


```bash
npx prisma generate
npm run db:push     # tạo bảng trên Supabase theo prisma/schema.prisma
npm run db:seed     # nạp lại data mẫu giống ảnh chụp cũ (khách A Quyết, dự án Quay clip...)
```

## 6. Chạy thử local

```bash
npm run dev
```
Mở http://localhost:3000 → đăng nhập Google → vào /dashboard.

## 7. Deploy lên Vercel

```bash
npx vercel
```
Nhớ khai báo đủ 4 biến môi trường ở bước 4 trong Vercel → Project Settings → Environment Variables, và thêm domain Vercel vào redirect URI của Google OAuth Client.

## 8. Build app desktop (.exe) — bản cài trên PC

Web app phải **deploy lên Vercel trước** (bước 7), vì bản .exe chỉ là cửa sổ Electron load thẳng URL Vercel — không cần cài Node/DB trên máy người dùng cuối.

1. Mở `electron/main.js`, sửa dòng `APP_URL` thành domain Vercel thật của bạn:
   ```js
   const APP_URL = process.env.TC_APP_URL || "https://ten-app-cua-ban.vercel.app";
   ```
2. Thêm redirect URI này vào Google OAuth Client (vì app desktop cũng đăng nhập qua domain Vercel):
   ```
   https://ten-app-cua-ban.vercel.app/api/auth/callback/google
   ```
3. Chạy build:
   ```bash
   npm install
   npm run dist
   ```
4. File cài đặt `.exe` nằm trong thư mục `dist/` — ví dụ `Task Controller Setup 2.0.0.exe`.

**Test nhanh không cần build .exe** (chạy Electron trực tiếp):
```bash
set TC_APP_URL=http://localhost:3000
npm run electron
```

---

## Những gì đã build lại

- ✅ Auth Google OAuth (NextAuth + Prisma Adapter, tự link tài khoản theo email)
- ✅ Dashboard: thống kê, biểu đồ doanh thu, khách hàng top, deadline sắp tới
- ✅ Dự án: danh sách + chi tiết đủ 6 tab (Tổng quan, Báo giá, Hợp đồng, Tài nguyên, Timeline, Hợp tác phí)
- ✅ Form tạo mới: Dự án, Hoá đơn, Khách hàng, CTV, Task, Báo giá, Hợp đồng
- ✅ Hoá đơn: danh sách, trạng thái thanh toán, **xuất PDF**
- ✅ Khách hàng, Đội ngũ (CTV), Lịch dự án
- ✅ **Upload file thật** lên Supabase Storage (tab Tài nguyên)
- ✅ **Ký hợp đồng qua OTP email** (link public `/sign/[id]`, gửi mã qua Resend)
- ✅ **Đồng bộ deadline lên Google Calendar** (dùng token đã cấp quyền lúc đăng nhập)
- ✅ App desktop .exe (Electron wrapper)
- ✅ Data mẫu khớp ảnh cũ

## Giới hạn cần biết

- Ký OTP: bản đơn giản, chưa có chữ ký hình ảnh/pháp lý, chỉ xác nhận qua email — đủ dùng nội bộ, không thay thế chữ ký số pháp lý.
- Đồng bộ Calendar: 1 chiều (app → Google), chưa đồng bộ ngược lại khi sửa trên Google Calendar.
- Nếu không điền `RESEND_API_KEY`/Supabase Storage, 2 tính năng đó tự tắt êm, không lỗi app.

