import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateProject } from "@/lib/actions";
import Sidebar from "@/components/Sidebar";
import { X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const [project, clients] = await Promise.all([
    prisma.project.findFirst({ where: { id: params.id, ownerId: userId } }),
    prisma.client.findMany({ where: { ownerId: userId } }),
  ]);
  if (!project) notFound();

  const fmt = (d: Date | null) => (d ? new Date(d).toISOString().slice(0, 10) : "");

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 flex items-center justify-center min-h-screen px-10 py-10">
        <form action={updateProject} className="card w-full max-w-lg relative">
          <input type="hidden" name="projectId" value={project.id} />
          <Link href={`/projects/${project.id}`} className="absolute top-5 right-5 text-muted hover:text-text"><X className="w-5 h-5" /></Link>
          <h2 className="text-xl font-bold mb-6">Sửa dự án</h2>

          <label className="label">Tên dự án</label>
          <input name="name" required defaultValue={project.name} className="input mb-4" />

          <label className="label">Khách hàng</label>
          <select name="clientId" required defaultValue={project.clientId} className="input mb-4">
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.company}</option>)}
          </select>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Giá trị hợp đồng</label>
              <input name="contractValue" type="number" defaultValue={project.contractValue} required className="input" />
            </div>
            <div>
              <label className="label">Đặt cọc (%)</label>
              <input name="depositPct" type="number" defaultValue={project.depositPct} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Ngày bắt đầu</label>
              <input name="startDate" type="date" defaultValue={fmt(project.startDate)} className="input" />
            </div>
            <div>
              <label className="label">Hạn chót</label>
              <input name="deadline" type="date" defaultValue={fmt(project.deadline)} className="input" />
            </div>
          </div>

          <label className="label">Trạng thái</label>
          <select name="status" defaultValue={project.status} className="input mb-6">
            <option value="RUNNING">Đang chạy</option>
            <option value="PAUSED">Tạm dừng</option>
            <option value="DONE">Hoàn thành</option>
          </select>

          <div className="flex justify-end gap-2">
            <Link href={`/projects/${project.id}`} className="btn-ghost">Huỷ</Link>
            <button type="submit" className="btn-accent">Lưu thay đổi</button>
          </div>
        </form>
      </main>
    </div>
  );
}
