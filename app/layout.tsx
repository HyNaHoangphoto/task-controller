import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Task Controller — Quản lý cho nhà sáng tạo",
  description: "Freelancer OS — quản lý dự án, hoá đơn, khách hàng & CTV trong một workspace.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
