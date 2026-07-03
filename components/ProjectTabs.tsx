"use client";

import Link from "next/link";

const TABS = [
  { key: "overview", label: "Tổng quan" },
  { key: "quotes", label: "Báo giá" },
  { key: "contracts", label: "Hợp đồng" },
  { key: "resources", label: "Tài nguyên" },
  { key: "timeline", label: "Timeline" },
  { key: "revenue", label: "Hợp tác phí" },
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
    <div className="flex items-center gap-1 border-b border-border">
      {TABS.map((t) => {
        const count = t.key === "quotes" ? counts.quotes : t.key === "contracts" ? counts.contracts : t.key === "resources" ? counts.resources : t.key === "timeline" ? counts.timeline : undefined;
        const isActive = active === t.key;
        return (
          <Link
            key={t.key}
            href={`/projects/${projectId}?tab=${t.key}`}
            className={`px-4 py-2.5 text-sm flex items-center gap-1.5 border-b-2 -mb-px ${
              isActive ? "border-accent text-accent-light" : "border-transparent text-muted hover:text-white"
            }`}
          >
            {t.label}
            {count !== undefined && <span className="text-xs bg-panel px-1.5 rounded-full">{count}</span>}
          </Link>
        );
      })}
    </div>
  );
}
