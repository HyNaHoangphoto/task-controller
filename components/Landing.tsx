"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { Hash, CheckCircle2, Briefcase, FileSpreadsheet, Users, CalendarDays, Sparkles } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center">
            <Hash className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Task Controller</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">Đăng nhập</Link>
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-accent">
            Dùng thử miễn phí
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-20 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-1.5 text-xs bg-panel border border-border rounded-full px-3 py-1 mb-6 text-muted">
          <Sparkles className="w-3.5 h-3.5 text-accent-light" /> v2.0 vừa ra mắt
        </div>
        <h1 className="text-5xl font-bold leading-tight mb-4">
          Quản lý công việc,<br />
          <span className="text-accent-light">gọn nhẹ &amp; dễ dùng.</span>
        </h1>
        <p className="text-muted text-lg max-w-xl mx-auto mb-8">
          Task Controller giúp nhà sáng tạo Việt theo dõi dự án, hoá đơn, khách hàng và đội ngũ CTV — tất cả trong một workspace nhẹ và nhanh.
        </p>
        <div className="flex items-center justify-center gap-3 mb-4">
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-accent !px-6 !py-3 text-base">
            Tiếp tục với Google
          </button>
          <Link href="/login" className="btn-ghost !px-6 !py-3 text-base">Đăng nhập</Link>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-muted mt-6 flex-wrap">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent-light" /> Không cần thẻ tín dụng</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent-light" /> Hỗ trợ tiếng Việt 100%</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent-light" /> Đồng bộ Google Calendar</span>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="card !p-8">
          <div className="text-lg font-semibold mb-6">Mọi con số, một màn hình</div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-panel rounded-xl p-4">
              <div className="text-xs text-muted mb-2">DOANH THU THÁNG</div>
              <div className="text-2xl font-bold text-accent-light">23.400.000 đ</div>
              <div className="text-xs text-accent-light mt-1">▲ 12%</div>
            </div>
            <div className="bg-panel rounded-xl p-4">
              <div className="text-xs text-muted mb-2">DỰ ÁN ĐANG CHẠY</div>
              <div className="text-2xl font-bold">2</div>
              <div className="text-xs text-muted mt-1">3 tháng nay</div>
            </div>
            <div className="bg-panel rounded-xl p-4">
              <div className="text-xs text-muted mb-2">TASK HOÀN THÀNH</div>
              <div className="text-2xl font-bold">11</div>
              <div className="text-xs text-muted mt-1">tháng này</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid grid-cols-4 gap-4">
        <Feature icon={<Briefcase className="w-5 h-5" />} title="Dự án theo timeline" desc="Chia giai đoạn, giao task cho CTV, theo dõi tiến độ." />
        <Feature icon={<FileSpreadsheet className="w-5 h-5" />} title="Hoá đơn & hợp đồng" desc="Xuất PDF, ký OTP qua email, theo dõi công nợ." />
        <Feature icon={<Users className="w-5 h-5" />} title="Khách hàng & CTV" desc="Lưu lịch sử hợp tác, chia hợp tác phí rõ ràng." />
        <Feature icon={<CalendarDays className="w-5 h-5" />} title="Lịch đồng bộ" desc="Đẩy deadline thẳng lên Google Calendar của bạn." />
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        © 2026 Task Controller — hoangkhoinhiepanh@gmail.com
      </footer>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card">
      <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent-light flex items-center justify-center mb-3">{icon}</div>
      <div className="font-medium mb-1 text-sm">{title}</div>
      <div className="text-xs text-muted">{desc}</div>
    </div>
  );
}
