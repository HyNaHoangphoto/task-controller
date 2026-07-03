"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import {
  Hash, CheckCircle2, Briefcase, FileSpreadsheet, Users, CalendarDays,
  Sparkles, Video, Code2, Palette, GraduationCap, LayoutGrid,
  FolderKanban, Receipt, BarChart3, X, Check, Circle, Download,
} from "lucide-react";

const AUDIENCES = [
  { icon: Video, title: "Video / Motion", desc: "Tiền kỳ → quay → hậu kỳ" },
  { icon: Code2, title: "Lập trình / IT", desc: "Kế hoạch → dev → QA → deploy" },
  { icon: Palette, title: "Thiết kế", desc: "Brief → concept → bàn giao" },
  { icon: GraduationCap, title: "Dạy thêm", desc: "Lớp học · học viên · lộ trình" },
  { icon: LayoutGrid, title: "Lĩnh vực khác", desc: "Tuỳ biến theo quy trình bạn" },
];

const CORE_FEATURES = [
  { icon: FolderKanban, title: "Theo dõi dự án", desc: "Chia giai đoạn, task list, lưu link tài nguyên ngay trong dự án." },
  { icon: Receipt, title: "Hoá đơn tự động", desc: "Gắn liền dự án ↔ hoá đơn — đổi trạng thái dự án là hoá đơn tự cập nhật." },
  { icon: Users, title: "Khách hàng & CTV", desc: "Doanh thu theo khách. Giao task cho CTV, chia hợp tác phí rõ ràng." },
  { icon: BarChart3, title: "Báo cáo nhanh", desc: "Dashboard doanh thu, công nợ, lợi nhuận theo tháng — nhìn phát hiểu ngay." },
];

const COMPARE_ROWS = [
  { label: "Hoá đơn tự sinh khi tạo dự án", tc: true, manual: false },
  { label: "Timeline theo giai đoạn (phases)", tc: true, manual: "partial" },
  { label: "Ký hợp đồng qua OTP email", tc: true, manual: false },
  { label: "Đồng bộ deadline lên Google Calendar", tc: true, manual: "partial" },
  { label: "Chia hợp tác phí cho CTV rõ ràng", tc: true, manual: false },
  { label: "Xuất PDF hoá đơn/hợp đồng có thương hiệu riêng", tc: true, manual: false },
  { label: "Giao diện tiếng Việt 100%", tc: true, manual: "partial" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto sticky top-0 bg-bg/80 backdrop-blur z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center">
            <Hash className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Task Controller</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#features" className="hover:text-white transition">Tính năng</a>
          <a href="#compare" className="hover:text-white transition">So sánh</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost">Đăng nhập</Link>
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-accent">
            Dùng thử miễn phí
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-16 max-w-4xl mx-auto">
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
        <div className="flex items-center justify-center gap-3 mb-6">
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-accent !px-6 !py-3 text-base">
            Tiếp tục với Google
          </button>
          <Link href="/login" className="btn-ghost !px-6 !py-3 text-base">Đăng nhập</Link>
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-muted mt-4 flex-wrap">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent-light" /> Không cần thẻ tín dụng</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent-light" /> Hỗ trợ tiếng Việt 100%</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-accent-light" /> Đồng bộ Google Calendar</span>
        </div>
      </section>

      {/* Preview mockup */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
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

      {/* Đối tượng dùng */}
      <section className="max-w-5xl mx-auto px-6 mb-20">
        <div className="text-center mb-8">
          <div className="text-xs text-accent-light font-semibold tracking-wide mb-2">DÀNH CHO AI</div>
          <h2 className="text-3xl font-bold">Dù bạn làm nghề gì, vẫn hợp</h2>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="card !p-4 text-center">
              <a.icon className="w-6 h-6 text-accent-light mx-auto mb-2" />
              <div className="text-sm font-semibold mb-1">{a.title}</div>
              <div className="text-xs text-muted">{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tính năng cốt lõi */}
      <section id="features" className="max-w-5xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-accent-light font-semibold tracking-wide mb-2">TÍNH NĂNG CỐT LÕI</div>
        <h2 className="text-4xl font-bold mb-3">
          Mọi thứ nhà sáng tạo cần,<br />
          <span className="text-accent-light">trong một workspace</span>
        </h2>
        <p className="text-muted max-w-xl mx-auto mb-10">
          Không cần rải rác nhiều file hay app khác nhau. Một chỗ duy nhất, làm đúng việc.
        </p>
        <div className="grid grid-cols-2 gap-4 text-left">
          {CORE_FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="w-10 h-10 rounded-lg bg-accent/15 text-accent-light flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5" />
              </div>
              <div className="font-semibold mb-1">{f.title}</div>
              <div className="text-sm text-muted">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* So sánh */}
      <section id="compare" className="max-w-4xl mx-auto px-6 mb-24 text-center">
        <div className="text-xs text-accent-light font-semibold tracking-wide mb-2">SO SÁNH</div>
        <h2 className="text-4xl font-bold mb-3">
          Vì sao chọn <span className="text-accent-light">Task Controller?</span>
        </h2>
        <p className="text-muted max-w-xl mx-auto mb-10">
          Quản lý bằng bảng tính thì được, nhưng tốn công thiết lập và dễ sai sót. Task Controller làm sẵn cho bạn.
        </p>
        <div className="card !p-0 overflow-hidden text-left">
          <div className="grid grid-cols-[1fr_140px_140px] text-xs text-muted uppercase px-5 py-3 border-b border-border">
            <span>Tính năng</span>
            <span className="text-center text-accent-light">Task Controller</span>
            <span className="text-center">Thủ công</span>
          </div>
          {COMPARE_ROWS.map((row) => (
            <div key={row.label} className="grid grid-cols-[1fr_140px_140px] items-center px-5 py-3 border-b border-border/50 text-sm last:border-0">
              <span>{row.label}</span>
              <span className="flex justify-center">{row.tc ? <Check className="w-4 h-4 text-accent-light" /> : <X className="w-4 h-4 text-muted" />}</span>
              <span className="flex justify-center">
                {row.manual === true ? <Check className="w-4 h-4 text-accent-light" /> : row.manual === "partial" ? <Circle className="w-2.5 h-2.5 fill-warn text-warn" /> : <X className="w-4 h-4 text-muted" />}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA cuối */}
      <section className="max-w-2xl mx-auto px-6 mb-24 text-center">
        <h2 className="text-3xl font-bold mb-3">Sẵn sàng thử chưa?</h2>
        <p className="text-muted mb-6">Đăng nhập bằng Google, vào việc trong 30 giây.</p>
        <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="btn-accent !px-6 !py-3 text-base inline-flex items-center gap-2">
          <Download className="w-4 h-4" /> Dùng thử miễn phí
        </button>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted">
        © 2026 Task Controller — hoangkhoinhiepanh@gmail.com
      </footer>
    </div>
  );
}

