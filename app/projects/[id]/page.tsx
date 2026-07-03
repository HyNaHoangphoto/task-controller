import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { CheckCircle2, Pencil, Share2, MoreVertical } from "lucide-react";
import ProjectTabs from "@/components/ProjectTabs";
import { createTask, createQuote, createContract, addResource } from "@/lib/actions";
import TaskCheckbox from "@/components/TaskCheckbox";
import ResourceUploader from "@/components/ResourceUploader";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = { RUNNING: "Đang chạy", PAUSED: "Tạm dừng", DONE: "Hoàn thành" };

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const project = await prisma.project.findFirst({
    where: { id: params.id, ownerId: userId },
    include: {
      client: true,
      phases: { include: { tasks: true }, orderBy: { order: "asc" } },
      tasks: true,
      invoices: true,
      quotes: true,
      contracts: true,
      resources: true,
      costs: true,
      assignees: { include: { teamMember: true } },
    },
  });
  if (!project) notFound();

  const tab = searchParams.tab || "overview";
  const paidPct = project.contractValue
    ? Math.round((project.invoices.reduce((s, i) => s + i.paidAmount, 0) / project.contractValue) * 100)
    : 0;
  const depositAmount = Math.round((project.contractValue * project.depositPct) / 100);

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1400px]">
        <div className="flex justify-end gap-2 mb-6">
          <button className="btn-ghost flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Đánh dấu xong</button>
          <button className="btn-ghost flex items-center gap-2"><Pencil className="w-4 h-4" /> Sửa</button>
          <button className="btn-accent flex items-center gap-2"><Share2 className="w-4 h-4" /> Chia sẻ</button>
          <button className="btn-ghost !px-2.5"><MoreVertical className="w-4 h-4" /></button>
        </div>

        <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent-light">{STATUS_LABEL[project.status]}</span>
        <h1 className="text-3xl font-bold mt-2 mb-1">{project.name}</h1>
        <p className="text-muted mb-6">{project.client.name}</p>

        <ProjectTabs projectId={project.id} active={tab} counts={{
          quotes: project.quotes.length,
          contracts: project.contracts.length,
          resources: project.resources.length,
          timeline: project.phases.length,
        }} />

        {tab === "overview" && (
          <>
            <div className="grid grid-cols-4 gap-4 my-6">
              <MiniStat label="GIÁ TRỊ" value={`${project.contractValue.toLocaleString("vi-VN")} đ`} color="text-accent-light" />
              <MiniStat label="ĐẶT CỌC" value={`${project.depositPct}% · ${depositAmount.toLocaleString("vi-VN")} đ`} />
              <MiniStat label="HẠN CHÓT" value={project.deadline ? new Date(project.deadline).toLocaleDateString("vi-VN") : "—"} />
              <MiniStat label="TIẾN ĐỘ" value={`${paidPct}%`} color="text-warn" />
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold">Công việc · {project.tasks.length}</div>
            </div>

            <form action={createTask} className="flex gap-2 mb-4">
              <input type="hidden" name="projectId" value={project.id} />
              <input name="title" required placeholder="Tên task mới..." className="input flex-1" />
              <select name="priority" className="input w-36" defaultValue="MEDIUM">
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
              </select>
              <input name="dueDate" type="date" className="input w-44" />
              <button type="submit" className="btn-accent shrink-0">+ Thêm</button>
            </form>

            <div className="flex flex-col gap-2">
              {project.tasks.map((t) => (
                <div key={t.id} className="card !py-3 flex items-center gap-3">
                  <TaskCheckbox taskId={t.id} projectId={project.id} done={t.done} />
                  <div className="flex-1">
                    <div className="text-sm">{t.title}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    t.priority === "HIGH" ? "bg-warn/15 text-warn" : t.priority === "MEDIUM" ? "bg-blue-500/15 text-blue-400" : "bg-panel text-muted"
                  }`}>
                    {t.priority === "HIGH" ? "Cao" : t.priority === "MEDIUM" ? "Trung bình" : "Thấp"}
                  </span>
                  <span className="text-xs text-muted">{t.dueDate ? new Date(t.dueDate).toLocaleDateString("vi-VN") : ""}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "timeline" && (
          <div className="mt-6 flex flex-col gap-6">
            <div className="font-semibold">Timeline · SOW <span className="text-muted font-normal">— {project.phases.length} giai đoạn · {project.tasks.length} task</span></div>
            {project.phases.map((phase, idx) => (
              <div key={phase.id} className="card">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-panel text-muted">GIAI ĐOẠN {idx + 1} · Chưa tới</span>
                  <span className="text-xs text-muted">0%</span>
                </div>
                <div className="font-semibold text-lg mb-0.5">{phase.name}</div>
                <div className="text-xs text-muted mb-4">
                  {phase.startDate && new Date(phase.startDate).toLocaleDateString("vi-VN")} → {phase.endDate && new Date(phase.endDate).toLocaleDateString("vi-VN")} · {phase.tasks.length} task
                </div>
                <div className="flex flex-col gap-2">
                  {phase.tasks.map((t) => (
                    <div key={t.id} className="bg-panel rounded-lg px-4 py-3 flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border border-muted" />
                      <div className="flex-1 text-sm">{t.title}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-warn/15 text-warn">
                        {t.priority === "HIGH" ? "Cao" : "Trung bình"}
                      </span>
                      <span className="text-xs text-muted">{t.dueDate && new Date(t.dueDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "revenue" && (
          <div className="mt-6">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <MiniStat label="GIÁ TRỊ DỰ ÁN" value={`${project.contractValue.toLocaleString("vi-VN")} đ`} />
              <MiniStat label="TỔNG CHI PHÍ" value={`${project.costs.reduce((s, c) => s + c.amount, 0).toLocaleString("vi-VN")} đ`} color="text-warn" />
              <MiniStat label="TỔNG TIỀN CTV" value={`${project.assignees.reduce((s, a) => s + a.payoutAmount, 0).toLocaleString("vi-VN")} đ`} color="text-blue-400" />
              <MiniStat
                label="LỢI NHUẬN"
                value={`${(project.contractValue - project.costs.reduce((s, c) => s + c.amount, 0) - project.assignees.reduce((s, a) => s + a.payoutAmount, 0)).toLocaleString("vi-VN")} đ`}
                color="text-accent-light"
              />
            </div>
            <div className="font-semibold mb-2">Trả cộng tác viên</div>
            {project.assignees.length === 0 ? (
              <p className="text-sm text-muted mb-6">Chưa gán CTV nào cho dự án này.</p>
            ) : (
              project.assignees.map((a) => (
                <div key={a.id} className="card !py-3 mb-2 flex justify-between text-sm">
                  <span>{a.teamMember.name}</span>
                  <span>{a.payoutAmount.toLocaleString("vi-VN")} đ</span>
                </div>
              ))
            )}
            <div className="font-semibold mb-2">Chi phí dự án</div>
            {project.costs.length === 0 ? <p className="text-sm text-muted">Chưa có chi phí nào.</p> : project.costs.map((c) => (
              <div key={c.id} className="card !py-3 mb-2 flex justify-between text-sm">
                <span>{c.label}</span><span>{c.amount.toLocaleString("vi-VN")} đ</span>
              </div>
            ))}
          </div>
        )}

        {tab === "quotes" && (
          <div className="mt-6">
            <form action={createQuote} className="card mb-6">
              <input type="hidden" name="projectId" value={project.id} />
              <div className="font-semibold mb-4">Tạo báo giá mới</div>
              <label className="label">Nội dung báo giá</label>
              <textarea name="content" rows={4} className="input mb-4" placeholder="Hạng mục công việc, mô tả..." />
              <label className="label">Tổng tiền (VNĐ)</label>
              <input name="totalAmount" type="number" required className="input mb-4" />
              <button type="submit" className="btn-accent">Tạo báo giá</button>
            </form>
            {project.quotes.length === 0 ? (
              <p className="text-center py-8 text-muted">Chưa có báo giá nào.</p>
            ) : (
              project.quotes.map((q) => (
                <div key={q.id} className="card mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{q.code}</span>
                    <span className="text-accent-light">{q.totalAmount.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <p className="text-sm text-muted whitespace-pre-wrap">{q.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "contracts" && (
          <div className="mt-6">
            <form action={createContract} className="card mb-6">
              <input type="hidden" name="projectId" value={project.id} />
              <div className="font-semibold mb-4">Tạo văn bản mới</div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Loại văn bản</label>
                  <select name="docType" className="input">
                    <option value="CONTRACT">Hợp đồng</option>
                    <option value="ACCEPTANCE">Nghiệm thu</option>
                    <option value="PAYMENT_REQUEST">Đề nghị thanh toán</option>
                    <option value="ADDENDUM">Phụ lục</option>
                  </select>
                </div>
                <div>
                  <label className="label">Giá trị trước thuế (đ)</label>
                  <input name="valueBefore" type="number" defaultValue={project.contractValue} className="input" />
                </div>
              </div>
              <label className="label">Nội dung & điều khoản</label>
              <textarea name="content" rows={5} className="input mb-4" placeholder="Nội dung công việc & điều khoản..." />
              <button type="submit" className="btn-accent">Tạo văn bản</button>
              <p className="text-xs text-muted mt-3">💡 Sau khi tạo, bấm "Mở link cho khách ký" bên dưới mỗi văn bản để gửi cho khách ký qua email OTP.</p>
            </form>
            {project.contracts.length === 0 ? (
              <p className="text-center py-8 text-muted">Chưa có văn bản nào.</p>
            ) : (
              project.contracts.map((c) => (
                <div key={c.id} className="card mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold">{c.code}</span>
                    <span className="text-accent-light">{c.valueBefore.toLocaleString("vi-VN")} đ</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-panel text-muted">{c.docType}</span>
                  {c.signedByClient && <span className="text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent-light ml-2">Đã ký</span>}
                  <p className="text-sm text-muted whitespace-pre-wrap mt-2">{c.content}</p>
                  <a href={`/sign/${c.id}`} target="_blank" className="text-xs text-accent-light underline mt-2 inline-block">
                    Mở link cho khách ký →
                  </a>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "resources" && (
          <div className="mt-6">
            <ResourceUploader projectId={project.id} />
            <form action={addResource} className="card mb-6 flex gap-2 items-end">
              <input type="hidden" name="projectId" value={project.id} />
              <div className="flex-1">
                <label className="label">Tên tài nguyên</label>
                <input name="name" required className="input" placeholder="VD: Brief khách hàng" />
              </div>
              <div className="flex-[2]">
                <label className="label">Link (Drive/Dropbox...)</label>
                <input name="url" type="url" required className="input" placeholder="https://drive.google.com/..." />
              </div>
              <button type="submit" className="btn-accent shrink-0">+ Thêm</button>
            </form>
            {project.resources.length === 0 ? (
              <p className="text-center py-8 text-muted">Chưa có tài nguyên nào.</p>
            ) : (
              project.resources.map((r) => (
                <a key={r.id} href={r.url} target="_blank" className="card !py-3 mb-2 flex justify-between text-sm hover:border-accent/50">
                  <span>{r.name}</span>
                  <span className="text-muted truncate max-w-xs">{r.url}</span>
                </a>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function MiniStat({ label, value, color = "text-text" }: { label: string; value: string; color?: string }) {
  return (
    <div className="card">
      <div className="text-xs text-muted mb-1">{label}</div>
      <div className={`text-xl font-bold ${color}`}>{value}</div>
    </div>
  );
}
