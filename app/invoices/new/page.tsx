import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createInvoice } from "@/lib/actions";
import Sidebar from "@/components/Sidebar";
import { X } from "lucide-react";
import Link from "next/link";

export default async function NewInvoicePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;
  const projects = await prisma.project.findMany({ where: { ownerId: userId }, include: { client: true } });

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 flex items-center justify-center min-h-screen px-10">
        <form action={createInvoice} className="card w-full max-w-lg relative">
          <Link href="/invoices" className="absolute top-5 right-5 text-muted hover:text-white"><X className="w-5 h-5" /></Link>
          <h2 className="text-xl font-bold mb-1">Hoá đơn mới</h2>
          <p className="text-sm text-muted mb-6">Hoá đơn được gắn với 1 dự án</p>

          <label className="label">Dự án</label>
          {projects.length === 0 ? (
            <p className="text-sm text-warn mb-4">Bạn chưa có dự án nào. <Link href="/projects/new" className="underline">Tạo dự án trước</Link>.</p>
          ) : (
            <select name="projectId" required className="input mb-4">
              <option value="">Chọn dự án</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.client.name}</option>)}
            </select>
          )}

          <label className="label">Tên hoá đơn</label>
          <input name="title" className="input mb-4" placeholder="VD: Đặt cọc 30%" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Tổng tiền (VNĐ)</label>
              <input name="totalAmount" type="number" required className="input" />
            </div>
            <div>
              <label className="label">Đã thanh toán (VNĐ)</label>
              <input name="paidAmount" type="number" defaultValue={0} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Ngày phát hành</label>
              <input name="issueDate" type="date" className="input" />
            </div>
            <div>
              <label className="label">Hạn thanh toán</label>
              <input name="dueDate" type="date" className="input" />
            </div>
          </div>

          <label className="label">Phương thức</label>
          <select name="method" className="input mb-4" defaultValue="Chuyển khoản">
            <option>Chuyển khoản</option>
            <option>Tiền mặt</option>
            <option>Khác</option>
          </select>

          <label className="label">Ghi chú</label>
          <textarea name="note" className="input mb-6" rows={2} />

          <div className="flex justify-end gap-2">
            <Link href="/invoices" className="btn-ghost">Huỷ</Link>
            <button type="submit" className="btn-accent" disabled={projects.length === 0}>Tạo hoá đơn</button>
          </div>
        </form>
      </main>
    </div>
  );
}
