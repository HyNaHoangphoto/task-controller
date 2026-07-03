import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import { Briefcase, FileSpreadsheet, UserCog, CalendarDays } from "lucide-react";
import RevenueChart from "@/components/RevenueChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const [projects, invoices, topClient] = await Promise.all([
    prisma.project.findMany({ where: { ownerId: userId }, include: { client: true } }),
    prisma.invoice.findMany({ where: { ownerId: userId } }),
    prisma.client.findFirst({
      where: { ownerId: userId },
      include: { projects: { include: { invoices: true } } },
    }),
  ]);

  const totalAmount = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const paidAmount = invoices.reduce((s, i) => s + i.paidAmount, 0);
  const unpaidAmount = totalAmount - paidAmount;
  const runningProjects = projects.filter((p) => p.status === "RUNNING").length;

  const firstName = session.user.name?.split(" ").pop() || "bạn";

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1400px]">
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1" />
        </div>

        <h1 className="text-4xl font-bold text-accent-light mb-1">Chào buổi sáng, {firstName}</h1>
        <p className="text-muted mb-8">Hôm nay bạn có gì để làm?</p>

        <div className="grid grid-cols-4 gap-4 mb-4">
          <QuickCard icon={<Briefcase className="w-5 h-5" />} title="Tạo dự án mới" desc="Tự tạo hoá đơn cọc và task khởi điểm" />
          <QuickCard icon={<FileSpreadsheet className="w-5 h-5" />} title="Hoá đơn chưa thu" desc="Theo dõi công nợ và đánh dấu đã thanh toán" />
          <QuickCard icon={<UserCog className="w-5 h-5" />} title="Phân task cho CTV" desc="Giao việc và xem workload của từng người" />
          <QuickCard icon={<CalendarDays className="w-5 h-5" />} title="Lịch dự án" desc="Xem lịch 12 tháng và deadline" />
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="TỔNG TIỀN" value={totalAmount} color="text-accent-light" />
          <StatCard label="DOANH THU" value={paidAmount} color="text-white" />
          <StatCard label="CÔNG NỢ" value={unpaidAmount} color="text-warn" />
          <StatCard label="DỰ ÁN ĐANG CHẠY" value={runningProjects} isCount />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold">Doanh thu theo tháng</div>
                <div className="text-xs text-muted">{new Date().getFullYear()}</div>
              </div>
            </div>
            <RevenueChart invoices={invoices.map(i => ({ amount: i.paidAmount, date: i.paidDate || i.issueDate }))} />
          </div>

          <div className="card">
            <div className="font-semibold mb-1">Khách hàng top</div>
            <div className="text-xs text-muted mb-4">Năm nay</div>
            {topClient ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-semibold">
                  {topClient.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm">
                    <span>{topClient.name}</span>
                    <span className="text-accent-light">
                      {topClient.projects.flatMap(p => p.invoices).reduce((s, i) => s + i.paidAmount, 0).toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="text-xs text-muted">{topClient.projects.length} số dự án · {topClient.company}</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted">Chưa có khách hàng nào.</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card hover:border-accent/50 transition cursor-pointer">
      <div className="w-9 h-9 rounded-lg bg-accent/15 text-accent-light flex items-center justify-center mb-3">{icon}</div>
      <div className="font-medium mb-1">{title}</div>
      <div className="text-xs text-muted">{desc}</div>
    </div>
  );
}

function StatCard({ label, value, color = "text-white", isCount = false }: { label: string; value: number; color?: string; isCount?: boolean }) {
  return (
    <div className="card">
      <div className="text-xs text-muted tracking-wide mb-2">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>
        {isCount ? value : `${value.toLocaleString("vi-VN")} đ`}
      </div>
    </div>
  );
}
