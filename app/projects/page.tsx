import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Link from "next/link";
import { Plus } from "lucide-react";
export const dynamic = "force-dynamic";
const STATUS_LABEL: Record<string, string> = { RUNNING: "Đang chạy", PAUSED: "Tạm dừng", DONE: "Hoàn thành" };

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const projects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: { client: true, tasks: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1400px]">
        <TopBar
          title="Dự án"
          subtitle="Tất cả dự án và task được nhóm chung"
          action={
            <Link href="/projects/new" className="btn-accent flex items-center gap-2">
              <Plus className="w-4 h-4" /> Dự án mới
            </Link>
          }
        />

        <div className="grid grid-cols-3 gap-4">
          {projects.map((p) => {
            const done = p.tasks.filter((t) => t.done).length;
            const pct = p.tasks.length ? Math.round((done / p.tasks.length) * 100) : 0;
            return (
              <Link key={p.id} href={`/projects/${p.id}`} className="card hover:border-accent/50 transition">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{p.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent-light">{STATUS_LABEL[p.status]}</span>
                </div>
                <div className="text-xs text-muted mb-3">{p.client.name}</div>
                <div className="flex justify-between text-xs text-muted mb-1">
                  <span>{p.tasks.length} tasks</span>
                  <span className="text-warn">{p.deadline ? new Date(p.deadline).toLocaleDateString("vi-VN") : "—"}</span>
                </div>
                <div className="h-1.5 rounded-full bg-panel overflow-hidden">
                  <div className="h-full bg-accent-gradient" style={{ width: `${pct}%` }} />
                </div>
              </Link>
            );
          })}
          {projects.length === 0 && <div className="text-muted">Chưa có dự án nào.</div>}
        </div>
      </main>
    </div>
  );
}
