import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createProject } from "@/lib/actions";
import Sidebar from "@/components/Sidebar";
import { X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;
  const clients = await prisma.client.findMany({ where: { ownerId: userId } });

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 flex items-center justify-center min-h-screen px-10">
        <form action={createProject} className="card w-full max-w-lg relative">
          <Link href="/projects" className="absolute top-5 right-5 text-muted hover:text-white"><X className="w-5 h-5" /></Link>
          <h2 className="text-xl font-bold mb-1">Tạo dự án mới</h2>
          <p className="text-sm text-muted mb-6">Hoá đơn cọc và task khởi điểm sẽ được tự động tạo</p>

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

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="label">Ngày bắt đầu</label>
              <input name="startDate" type="date" className="input" />
            </div>
            <div>
              <label className="label">Hạn chót</label>
              <input name="deadline" type="date" className="input" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link href="/projects" className="btn-ghost">Huỷ</Link>
            <button type="submit" className="btn-accent" disabled={clients.length === 0}>Tạo dự án</button>
          </div>
        </form>
      </main>
    </div>
  );
}
