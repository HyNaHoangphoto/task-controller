import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Plus, Download } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  PAID: { label: "Đã thanh toán", cls: "bg-accent/15 text-accent-light" },
  PARTIAL: { label: "Thanh toán 1 phần", cls: "bg-warn/15 text-warn" },
  UNPAID: { label: "Chưa thanh toán", cls: "bg-danger/15 text-danger" },
};

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const invoices = await prisma.invoice.findMany({
    where: { ownerId: userId },
    include: { project: { include: { client: true } } },
    orderBy: { createdAt: "desc" },
  });

  const total = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const paid = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const unpaid = total - paid;

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1400px]">
        <TopBar
          title="Hoá đơn"
          subtitle="Theo dõi thanh toán & công nợ"
          action={
            <Link href="/invoices/new" className="btn-accent flex items-center gap-2">
              <Plus className="w-4 h-4" /> Hoá đơn mới
            </Link>
          }
        />

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card">
            <div className="text-xs text-muted mb-2">TỔNG TIỀN</div>
            <div className="text-2xl font-bold text-accent-light">{total.toLocaleString("vi-VN")} đ</div>
          </div>
          <div className="card">
            <div className="text-xs text-muted mb-2">ĐÃ THANH TOÁN</div>
            <div className="text-2xl font-bold">{paid.toLocaleString("vi-VN")} đ</div>
            <div className="text-xs text-muted mt-1">{total ? Math.round((paid / total) * 100) : 0}%</div>
          </div>
          <div className="card">
            <div className="text-xs text-muted mb-2">CHƯA THANH TOÁN</div>
            <div className="text-2xl font-bold text-warn">{unpaid.toLocaleString("vi-VN")} đ</div>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border">
              <th className="py-3 font-medium">MÃ HĐ</th>
              <th className="font-medium">DỰ ÁN</th>
              <th className="font-medium">TÊN</th>
              <th className="font-medium">TRẠNG THÁI</th>
              <th className="font-medium">TỔNG TIỀN</th>
              <th className="font-medium">ĐÃ THANH TOÁN</th>
              <th className="font-medium">CHƯA THANH TOÁN</th>
              <th className="font-medium">HẠN CUỐI</th>
              <th className="font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => {
              const s = STATUS_LABEL[inv.status];
              return (
                <tr key={inv.id} className="border-b border-border/50">
                  <td className="py-3">{inv.code}</td>
                  <td>{inv.project.name}</td>
                  <td>{inv.title}</td>
                  <td><span className={`px-2 py-1 rounded-full text-xs ${s.cls}`}>{s.label}</span></td>
                  <td>{inv.totalAmount.toLocaleString("vi-VN")} đ</td>
                  <td className="text-accent-light">{inv.paidAmount.toLocaleString("vi-VN")} đ</td>
                  <td className="text-warn">{(inv.totalAmount - inv.paidAmount).toLocaleString("vi-VN")} đ</td>
                  <td>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString("vi-VN") : "—"}</td>
                  <td>
                    <a href={`/api/invoices/${inv.id}/pdf`} className="btn-ghost !py-1.5 !px-2.5 inline-flex items-center gap-1 text-xs">
                      <Download className="w-3.5 h-3.5" /> PDF
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
}
