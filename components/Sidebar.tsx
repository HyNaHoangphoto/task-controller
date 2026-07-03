"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Briefcase,
  FileSpreadsheet,
  Users,
  UserCog,
  CalendarDays,
  Settings,
  Plus,
  Zap,
  Hash,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutGrid },
  { href: "/projects", label: "Dự án", icon: Briefcase },
  { href: "/invoices", label: "Hoá đơn", icon: FileSpreadsheet },
  { href: "/clients", label: "Khách hàng", icon: Users },
  { href: "/team", label: "Đội ngũ", icon: UserCog },
  { href: "/calendar", label: "Lịch dự án", icon: CalendarDays },
];

export default function Sidebar({
  userName,
  userEmail,
}: {
  userName?: string | null;
  userEmail?: string | null;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] shrink-0 h-screen sticky top-0 flex flex-col justify-between px-5 py-6 border-r border-border">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center">
            <Hash className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold leading-tight">Task Controller</div>
            <div className="text-xs text-muted flex items-center gap-1">
              {"</>"} IT / Phần mềm
            </div>
          </div>
        </div>

        <Link href="/projects/new" className="btn-accent w-full flex items-center justify-center gap-2 mb-6">
          <Plus className="w-4 h-4" /> Dự án mới
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname?.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active ? "bg-accent/15 text-accent-light" : "text-muted hover:bg-panel"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="card flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-accent-gradient flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm">
            <div className="font-medium">Nâng cấp Pro</div>
            <div className="text-xs text-muted">149k/tháng · Không giới hạn</div>
          </div>
        </div>

        <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted hover:bg-panel mb-3">
          <Settings className="w-4 h-4" /> Cài đặt
        </Link>

        <div className="flex items-center gap-3 px-3">
          <div className="w-8 h-8 rounded-full bg-accent-gradient flex items-center justify-center text-xs font-semibold">
            {(userName || "K")[0]}
          </div>
          <div className="text-xs">
            <div className="font-medium">{userName || "Khôi Hoàng"}</div>
            <div className="text-muted">{userEmail || "hoangkhoinhiepanh@gmail.com"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
