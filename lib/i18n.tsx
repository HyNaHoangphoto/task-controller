"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "vi" | "en";

const DICT: Record<Lang, Record<string, string>> = {
  vi: {
    overview: "Tổng quan",
    projects: "Dự án",
    invoices: "Hoá đơn",
    clients: "Khách hàng",
    team: "Đội ngũ",
    calendar: "Lịch dự án",
    settings: "Cài đặt",
    newProject: "Dự án mới",
    search: "Tìm kiếm tasks, dự án, khách hàng...",
    upgrade: "Nâng cấp Pro",
    unlimited: "Không giới hạn",
  },
  en: {
    overview: "Overview",
    projects: "Projects",
    invoices: "Invoices",
    clients: "Clients",
    team: "Team",
    calendar: "Calendar",
    settings: "Settings",
    newProject: "New project",
    search: "Search tasks, projects, clients...",
    upgrade: "Upgrade to Pro",
    unlimited: "Unlimited",
  },
};

const LanguageContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string }>({
  lang: "vi",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("vi");

  useEffect(() => {
    const saved = (localStorage.getItem("tc-lang") as Lang) || "vi";
    setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("tc-lang", l);
  }

  const t = (k: string) => DICT[lang][k] || k;

  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
