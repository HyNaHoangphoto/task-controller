"use client";

import { useState } from "react";

export default function SettingsProfileTypeToggle({ defaultValue }: { defaultValue: string }) {
  const [type, setType] = useState(defaultValue);
  return (
    <div className="flex bg-panel rounded-full p-1 text-xs shrink-0">
      <input type="hidden" name="type" value={type} />
      <button type="button" onClick={() => setType("individual")} className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${type === "individual" ? "bg-accent-gradient text-white" : "text-muted"}`}>
        Cá nhân
      </button>
      <button type="button" onClick={() => setType("company")} className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition ${type === "company" ? "bg-accent-gradient text-white" : "text-muted"}`}>
        Doanh nghiệp
      </button>
    </div>
  );
}
