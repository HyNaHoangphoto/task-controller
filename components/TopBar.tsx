"use client";

import { Search, Globe } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LanguageToggle from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n";

export default function TopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  const { t } = useLanguage();
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="flex-1 relative max-w-xl">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input className="input pl-9" placeholder={t("search")} />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted border border-border rounded px-1.5 py-0.5">⌘ K</span>
        </div>
        <LanguageToggle />
        <ThemeToggle />
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
