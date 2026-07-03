"use client";

import { useState } from "react";

type Defaults = {
  notifyInvoiceCreated: boolean;
  notifyInvoicePaid: boolean;
  notifyProjectStatusChange: boolean;
  notifyDeadlineChange: boolean;
  notifyDeadlineReminder7d: boolean;
};

const ITEMS: { key: keyof Defaults; title: string; desc: string }[] = [
  { key: "notifyInvoiceCreated", title: "Hoá đơn mới được tạo", desc: "Khi bạn tạo hoá đơn mới cho khách" },
  { key: "notifyInvoicePaid", title: "Hoá đơn đã thanh toán", desc: "Khi khách hoặc bạn đánh dấu thanh toán" },
  { key: "notifyProjectStatusChange", title: "Trạng thái dự án đổi", desc: "Active → Completed, Paused,..." },
  { key: "notifyDeadlineChange", title: "Đổi hạn cuối dự án", desc: "Hữu ích khi bạn dời hạn để báo bản thân" },
  { key: "notifyDeadlineReminder7d", title: "Nhắc deadline 7 ngày", desc: "Email tổng hợp khi có dự án sắp đến hạn" },
];

export default function SettingsNotifyToggle({
  defaultEnabled,
  defaultEmail,
  defaults,
}: {
  defaultEnabled: boolean;
  defaultEmail: string;
  defaults: Defaults;
}) {
  const [enabled, setEnabled] = useState(defaultEnabled);
  const [values, setValues] = useState(defaults);

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={() => setEnabled((v) => !v)}
          className={`w-10 h-6 rounded-full relative transition ${enabled ? "bg-accent" : "bg-panel border border-border"}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${enabled ? "left-4.5 translate-x-[18px]" : "left-0.5"}`} />
        </button>
        <input type="hidden" name="notifyEnabled" value={enabled ? "on" : ""} />
        <span className="text-sm">🔔 Bật thông báo email</span>
        <input name="notifyEmail" defaultValue={defaultEmail} className="input flex-1 max-w-xs" />
      </div>

      <div className="flex flex-col divide-y divide-border border-t border-border">
        {ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm">{item.title}</div>
              <div className="text-xs text-muted">{item.desc}</div>
            </div>
            <button
              type="button"
              onClick={() => setValues((v) => ({ ...v, [item.key]: !v[item.key] }))}
              className={`w-10 h-6 rounded-full relative transition ${values[item.key] ? "bg-accent" : "bg-panel border border-border"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition ${values[item.key] ? "translate-x-[18px]" : "left-0.5"}`} />
            </button>
            <input type="hidden" name={item.key} value={values[item.key] ? "on" : ""} />
          </div>
        ))}
      </div>
    </div>
  );
}
