"use client";

import { useState } from "react";
import Link from "next/link";
import { X, ChevronDown, Check } from "lucide-react";
import { createProject } from "@/lib/actions";
import { PROJECT_TEMPLATES } from "@/lib/projectTemplates";

const PAYMENT_OPTIONS = [
  { value: "UNPAID", label: "Chưa thanh toán" },
  { value: "PARTIAL", label: "Đã cọc" },
  { value: "PAID", label: "Đã thanh toán" },
];

export default function NewProjectForm({ clients }: { clients: { id: string; name: string; company: string | null }[] }) {
  const [templateOpen, setTemplateOpen] = useState(false);
  const [templateKey, setTemplateKey] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("UNPAID");

  const selectedTemplate = PROJECT_TEMPLATES.find((t) => t.key === templateKey);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={createProject} className="card w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
      <Link href="/projects" className="absolute top-5 right-5 text-muted hover:text-white"><X className="w-5 h-5" /></Link>
      <h2 className="text-xl font-bold mb-1">Tạo dự án mới</h2>
      <p className="text-sm text-muted mb-6">Hoá đơn cọc và task khởi điểm sẽ được tự động tạo</p>

      {/* Mẫu dự án */}
      <label className="label">Mẫu dự án</label>
      <input type="hidden" name="templateKey" value={templateKey} />
      <div className="relative mb-4">
        <button
          type="button"
          onClick={() => setTemplateOpen((v) => !v)}
          className="btn-accent w-full flex items-center justify-between !py-2.5"
        >
          <span>{selectedTemplate ? selectedTemplate.name : "Tự tạo từ đầu"}</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        {templateOpen && (
          <div className="absolute z-10 mt-1 w-full bg-panel border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => { setTemplateKey(""); setTemplateOpen(false); }}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-card transition"
            >
              Tự tạo từ đầu
              {!templateKey && <Check className="w-4 h-4 text-accent-light" />}
            </button>
            {PROJECT_TEMPLATES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => { setTemplateKey(t.key); setTemplateOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-card transition border-t border-border"
              >
                <span className="flex items-center gap-2">
                  {t.name} <span className="text-xs text-muted">{t.tag}</span>
                </span>
                <span className="text-xs text-muted">
                  {t.phases.length} giai đoạn · {t.phases.reduce((s, p) => s + p.tasks.length, 0)} tasks · {t.totalDays} ngày
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <label className="label">Tên dự án</label>
      <input name="name" required className="input mb-4" placeholder="VD: Brand identity Lotus" />

      <label className="label">Khách hàng</label>
      {clients.length === 0 ? (
        <p className="text-sm text-warn mb-4">
          Bạn chưa có khách hàng nào. <Link href="/clients/new" className="underline">Thêm khách hàng trước</Link>.
        </p>
      ) : (
        <select name="clientId" required className="input mb-4">
          <option value="">Chọn khách hàng</option>
          {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
        </select>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Giá trị hợp đồng</label>
          <input name="contractValue" type="number" required className="input" placeholder="VD: 15000000" />
        </div>
        <div>
          <label className="label">Đặt cọc (%)</label>
          <input name="depositPct" type="number" defaultValue={30} className="input" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="label">Ngày bắt đầu</label>
          <input name="startDate" type="date" defaultValue={today} className="input" />
        </div>
        <div>
          <label className="label">Hạn chót {selectedTemplate && <span className="text-accent-light">(tự tính từ mẫu nếu để trống)</span>}</label>
          <input name="deadline" type="date" className="input" />
        </div>
      </div>

      {/* Trạng thái thanh toán */}
      <label className="label">Trạng thái thanh toán</label>
      <input type="hidden" name="paymentStatus" value={paymentStatus} />
      <div className="relative mb-6">
        <button
          type="button"
          onClick={() => setPaymentOpen((v) => !v)}
          className="input w-full flex items-center justify-between text-left"
        >
          <span>{PAYMENT_OPTIONS.find((o) => o.value === paymentStatus)?.label}</span>
          <ChevronDown className="w-4 h-4 text-muted" />
        </button>
        {paymentOpen && (
          <div className="absolute z-10 mt-1 w-full bg-panel border border-border rounded-lg overflow-hidden">
            {PAYMENT_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { setPaymentStatus(o.value); setPaymentOpen(false); }}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-card transition"
              >
                {o.label}
                {paymentStatus === o.value && <Check className="w-4 h-4 text-accent-light" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Link href="/projects" className="btn-ghost">Huỷ</Link>
        <button type="submit" className="btn-accent" disabled={clients.length === 0}>Tạo dự án</button>
      </div>
    </form>
  );
}
