"use client";

import { Search, Globe, Sun } from "lucide-react";

export default function TopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 relative max-w-xl">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder="Tìm kiếm tasks, dự án, khách hàng..." />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted border border-border rounded px-1.5 py-0.5">⌘ K</span>
        </div>
        <button className="btn-ghost flex items-center gap-1.5"><Globe className="w-4 h-4" /> VI</button>
        <button className="btn-ghost !px-2.5"><Sun className="w-4 h-4" /></button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent-light">{title}</h1>
          {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}
