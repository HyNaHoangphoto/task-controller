import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { Link2 } from "lucide-react";
import SyncCalendarButton from "@/components/SyncCalendarButton";

export const dynamic = "force-dynamic";

export default async function CalendarPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const events = await prisma.calendarEvent.findMany({
    where: { project: { ownerId: userId } },
    include: { project: { include: { client: true } } },
    orderBy: { date: "asc" },
  });

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startDay = new Date(firstOfMonth);
  startDay.setDate(startDay.getDate() - startDay.getDay());
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date(startDay);
    d.setDate(d.getDate() + i);
    return d;
  });

  const upcoming = events.filter((e) => e.date >= now).slice(0, 5);

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1400px]">
        <TopBar
          title="Lịch dự án"
          subtitle="Đồng bộ deadline lên Google Calendar — quản lý ở một chỗ duy nhất"
          action={
            <div className="flex gap-2">
              <button className="btn-ghost flex items-center gap-2"><Link2 className="w-4 h-4" /> Kết nối Google Calendar</button>
              <SyncCalendarButton />
            </div>
          }
        />

        <div className="card mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link2 className="w-4 h-4" /> Kết nối Google Calendar để tạo sự kiện, Google Meet và đồng bộ deadline. Phần còn lại của app vẫn dùng bình thường mà không cần kết nối.
          </div>
          <button className="btn-ghost flex items-center gap-2 shrink-0"><Link2 className="w-4 h-4" /> Kết nối Google Calendar</button>
        </div>

        <div className="grid grid-cols-[1fr_320px] gap-4">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <button className="btn-ghost text-xs">Hôm nay</button>
              <div className="font-semibold">Tháng {now.getMonth() + 1} Năm {now.getFullYear()}</div>
              <div className="w-16" />
            </div>
            <div className="grid grid-cols-7 text-xs text-muted mb-2">
              {["CN","T2","T3","T4","T5","T6","T7"].map((d) => <div key={d} className="text-center py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d, i) => {
                const isToday = d.toDateString() === now.toDateString();
                const dayEvents = events.filter((e) => new Date(e.date).toDateString() === d.toDateString());
                return (
                  <div key={i} className="min-h-[70px] rounded-lg p-1.5 bg-panel/50">
                    <div className={`text-xs mb-1 w-5 h-5 flex items-center justify-center rounded-full ${isToday ? "bg-accent text-white" : "text-muted"}`}>
                      {d.getDate()}
                    </div>
                    {dayEvents.slice(0, 2).map((e) => (
                      <div key={e.id} className="text-[10px] bg-accent/70 text-white rounded px-1 py-0.5 mb-0.5 truncate">{e.title}</div>
                    ))}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-muted mt-3">💡 Click vào ô trống trên lịch để tạo sự kiện ngay tại ngày đó. Click vào sự kiện đã tạo để sửa hoặc xoá.</p>
          </div>

          <div className="card">
            <div className="font-semibold mb-1">Sắp đến hạn</div>
            <div className="text-xs text-muted mb-4">7 ngày tới</div>
            <div className="flex flex-col gap-3">
              {upcoming.map((e) => {
                const days = Math.ceil((new Date(e.date).getTime() - now.getTime()) / 86400000);
                return (
                  <div key={e.id} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm">{e.title}</div>
                      <div className="text-xs text-muted">{e.project?.client.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs bg-panel px-2 py-0.5 rounded-full">{days}d</div>
                      <div className="text-xs text-muted mt-0.5">{new Date(e.date).toLocaleDateString("vi-VN")}</div>
                    </div>
                  </div>
                );
              })}
              {upcoming.length === 0 && <p className="text-sm text-muted">Không có deadline sắp tới.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
