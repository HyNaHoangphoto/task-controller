"use client";

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const MONTHS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

export default function RevenueChart({ invoices }: { invoices: { amount: number; date: Date }[] }) {
  const data = MONTHS.map((m, idx) => ({
    month: m,
    value: invoices
      .filter((i) => new Date(i.date).getMonth() === idx)
      .reduce((s, i) => s + i.amount, 0),
  }));

  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2b2c" vertical={false} />
          <XAxis dataKey="month" stroke="#abadb0" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#abadb0" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v / 1_000_000}Tr`} />
          <Tooltip
            contentStyle={{ background: "#1f2020", border: "1px solid #2a2b2c", borderRadius: 8 }}
            formatter={(v: number) => v.toLocaleString("vi-VN") + " đ"}
          />
          <Bar dataKey="value" fill="#34a853" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
