import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Plus, Phone, Mail } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const clients = await prisma.client.findMany({
    where: { ownerId: userId },
    include: { projects: { include: { invoices: true } } },
  });

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1400px]">
        <TopBar
          title="Khách hàng"
          subtitle="Thông tin & lịch sử hợp tác"
          action={
            <Link href="/clients/new" className="btn-accent flex items-center gap-2">
              <Plus className="w-4 h-4" /> Khách hàng mới
            </Link>
          }
        />

        <div className="grid grid-cols-3 gap-4">
          {clients.map((c) => {
            const revenue = c.projects.flatMap((p) => p.invoices).reduce((s, i) => s + i.paidAmount, 0);
            return (
              <div key={c.id} className="card">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold mb-3">
                  {c.name[0]}
                </div>
                <div className="font-semibold mb-0.5">{c.name}</div>
                <div className="text-xs text-muted mb-3">{c.company}</div>
                <div className="text-sm text-muted flex items-center gap-2 mb-1">
                  <Phone className="w-3.5 h-3.5" /> {c.phone}
                </div>
                <div className="text-sm text-muted flex items-center gap-2 mb-4">
                  <Mail className="w-3.5 h-3.5" /> {c.email}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-border text-sm">
                  <div>
                    <div className="text-xs text-muted">TỔNG DOANH THU</div>
                    <div className="text-accent-light font-semibold">{revenue.toLocaleString("vi-VN")} đ</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted">SỐ DỰ ÁN</div>
                    <div className="font-semibold">{c.projects.length}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {clients.length === 0 && <div className="text-muted">Chưa có khách hàng nào.</div>}
        </div>
      </main>
    </div>
  );
}
