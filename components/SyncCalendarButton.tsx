"use client";

import { useState, useTransition } from "react";
import { syncGoogleCalendar } from "@/lib/actions";
import { RefreshCw } from "lucide-react";

export default function SyncCalendarButton() {
  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState("");

  function handleClick() {
    setMsg("");
    startTransition(async () => {
      const res = await syncGoogleCalendar();
      setMsg(res.ok ? `Đã đồng bộ ${res.synced} deadline lên Google Calendar.` : res.message || "Có lỗi xảy ra.");
    });
  }

  return (
    <div className="relative">
      <button onClick={handleClick} disabled={isPending} className="btn-accent flex items-center gap-2">
        <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} /> Đồng bộ deadline
      </button>
      {msg && <div className="absolute top-full right-0 mt-2 text-xs bg-card border border-border rounded-lg px-3 py-2 whitespace-nowrap z-10">{msg}</div>}
    </div>
  );
}
