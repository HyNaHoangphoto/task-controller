"use client";

import { useLanguage } from "@/lib/i18n";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === "vi" ? "en" : "vi")}
      className="btn-ghost flex items-center gap-1.5"
      title="Đổi ngôn ngữ giao diện (đang áp dụng cho menu chính)"
    >
      <Globe className="w-4 h-4" /> {lang === "vi" ? "VI" : "EN"}
    </button>
  );
}
