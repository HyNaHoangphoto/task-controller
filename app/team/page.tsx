import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Plus, UserCog2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const members = await prisma.teamMember.findMany({ where: { ownerId: userId }, include: { tasks: true } });

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1400px]">
        <TopBar
          title="Đội ngũ"
          subtitle="Phân công task và quản lý nhân sự"
          action={
            <div className="flex gap-2">
              <button className="btn-ghost flex items-center gap-2"><Plus className="w-4 h-4" /> Task</button>
              <Link href="/team/new" className="btn-accent flex items-center gap-2"><Plus className="w-4 h-4" /> Thêm CTV</Link>
            </div>
          }
        />

        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-14 h-14 rounded-xl bg-accent-gradient flex items-center justify-center mb-4">
              <UserCog2 className="w-6 h-6 text-white" />
            </div>
            <div className="font-semibold text-lg mb-1">Chưa có CTV nào</div>
            <div className="text-muted text-sm mb-5">Thêm cộng tác viên để phân công task trong dự án.</div>
            <Link href="/team/new" className="btn-accent flex items-center gap-2"><Plus className="w-4 h-4" /> Thêm CTV đầu tiên</Link>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {members.map((m) => (
              <div key={m.id} className="card">
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-muted mb-2">{m.role}</div>
                <div className="text-sm text-muted">{m.tasks.length} task đang xử lý</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
