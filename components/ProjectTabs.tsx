"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FileSignature,
  FolderOpen,
  CalendarRange,
  Wallet,
  type LucideIcon,
} from "lucide-react";

type TabDef = {
  key: string;
  label: string;
  icon: LucideIcon;
  countKey?: string;
};

const TABS: TabDef[] = [
  { key: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { key: "quotes", label: "Báo giá", icon: FileText, countKey: "quotes" },
  { key: "contracts", label: "Hợp đồng", icon: FileSignature, countKey: "contracts" },
  { key: "resources", label: "Tài nguyên", icon: FolderOpen, countKey: "resources" },
  { key: "timeline", label: "Timeline", icon: CalendarRange, countKey: "timeline" },
  { key: "revenue", label: "Hợp tác phí", icon: Wallet },
];

export default function ProjectTabs({
  projectId,
  active,
  counts,
}: {
  projectId: string;
  active: string;
  counts: Record<string, number>;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-1 bg-bg/80 backdrop-blur">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-border px-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const count = t.countKey ? counts[t.countKey] : undefined;
          const isActive = active === t.key;

          return (
            <Link
              key={t.key}
              href={`/projects/${projectId}?tab=${t.key}`}
              className={`group relative flex shrink-0 items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? "text-accent-light" : "text-muted hover:text-text"
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive ? "text-accent-light" : "text-muted group-hover:text-text"
                }`}
              />
              {t.label}

              {count !== undefined && (
                <span
                  className={`min-w-[20px] rounded-full px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none transition-colors ${
                    isActive ? "bg-accent/15 text-accent-light" : "bg-panel text-muted"
                  }`}
                >
                  {count}
                </span>
              )}

              {/* Active indicator */}
              <span
                className={`absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-accent-gradient transition-opacity ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                }`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}