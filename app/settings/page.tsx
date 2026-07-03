import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const [projectCount, clientCount, invoiceCount, memberCount] = await Promise.all([
    prisma.project.count({ where: { ownerId: userId } }),
    prisma.client.count({ where: { ownerId: userId } }),
    prisma.invoice.count({ where: { ownerId: userId } }),
    prisma.teamMember.count({ where: { ownerId: userId } }),
  ]);

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[900px]">
        <TopBar title="Cài đặt" subtitle="Thông tin tài khoản & workspace" />

        <div className="card mb-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-accent-gradient flex items-center justify-center text-xl font-semibold">
            {(session.user.name || "K")[0]}
          </div>
          <div>
            <div className="font-semibold text-lg">{session.user.name}</div>
            <div className="text-muted text-sm">{session.user.email}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <SettingStat label="Dự án" value={projectCount} />
          <SettingStat label="Khách hàng" value={clientCount} />
          <SettingStat label="Hoá đơn" value={invoiceCount} />
          <SettingStat label="CTV" value={memberCount} />
        </div>

        <div className="card">
          <div className="font-semibold mb-3">Về Task Controller</div>
          <p className="text-sm text-muted leading-relaxed">
            Phiên bản 2.0.0 — build lại từ đầu bằng Next.js 14, Prisma, Supabase Postgres & NextAuth Google OAuth.
            App desktop (.exe) đóng gói bằng Electron, wrapper trực tiếp lên web app đã deploy.
          </p>
        </div>
      </main>
    </div>
  );
}

function SettingStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className="text-2xl font-bold text-accent-light">{value}</div>
    </div>
  );
}
