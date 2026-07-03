"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { prisma } from "./prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requireUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  return (session.user as any).id as string;
}

// ── Client ──────────────────────────────────────────────────────
export async function createClient(formData: FormData) {
  const userId = await requireUserId();
  const client = await prisma.client.create({
    data: {
      ownerId: userId,
      name: String(formData.get("name")),
      company: String(formData.get("company") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      address: String(formData.get("address") || ""),
      taxCode: String(formData.get("taxCode") || ""),
    },
  });
  revalidatePath("/clients");
  redirect("/clients");
}

// ── Project (tự tạo phase mặc định + hoá đơn cọc nếu có %) ─────
export async function createProject(formData: FormData) {
  const userId = await requireUserId();
  const contractValue = Number(formData.get("contractValue") || 0);
  const depositPct = Number(formData.get("depositPct") || 0);

  const project = await prisma.project.create({
    data: {
      ownerId: userId,
      name: String(formData.get("name")),
      clientId: String(formData.get("clientId")),
      contractValue,
      depositPct,
      startDate: formData.get("startDate") ? new Date(String(formData.get("startDate"))) : undefined,
      deadline: formData.get("deadline") ? new Date(String(formData.get("deadline"))) : undefined,
      status: "RUNNING",
      paymentStatus: "UNPAID",
    },
  });

  // Tự tạo hoá đơn đặt cọc nếu có %
  if (depositPct > 0 && contractValue > 0) {
    const depositAmount = Math.round((contractValue * depositPct) / 100);
    await prisma.invoice.create({
      data: {
        ownerId: userId,
        projectId: project.id,
        code: `#INV${Date.now().toString().slice(-6)}`,
        title: `${project.name} (đặt cọc ${depositPct}%)`,
        totalAmount: contractValue,
        paidAmount: 0,
        status: "UNPAID",
        method: "Chuyển khoản",
      },
    });
  }

  revalidatePath("/projects");
  redirect(`/projects/${project.id}`);
}

// ── Task ────────────────────────────────────────────────────────
export async function createTask(formData: FormData) {
  await requireUserId();
  const projectId = String(formData.get("projectId"));
  await prisma.task.create({
    data: {
      projectId,
      title: String(formData.get("title")),
      priority: (String(formData.get("priority")) as any) || "MEDIUM",
      dueDate: formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : undefined,
    },
  });
  revalidatePath(`/projects/${projectId}`);
}

export async function toggleTask(taskId: string, projectId: string, done: boolean) {
  await requireUserId();
  await prisma.task.update({ where: { id: taskId }, data: { done } });
  revalidatePath(`/projects/${projectId}`);
}

// ── Invoice ─────────────────────────────────────────────────────
export async function createInvoice(formData: FormData) {
  const userId = await requireUserId();
  const totalAmount = Number(formData.get("totalAmount") || 0);
  const paidAmount = Number(formData.get("paidAmount") || 0);
  const status = paidAmount === 0 ? "UNPAID" : paidAmount >= totalAmount ? "PAID" : "PARTIAL";

  await prisma.invoice.create({
    data: {
      ownerId: userId,
      projectId: String(formData.get("projectId")),
      code: `#INV${Date.now().toString().slice(-6)}`,
      title: String(formData.get("title") || ""),
      totalAmount,
      paidAmount,
      status,
      issueDate: formData.get("issueDate") ? new Date(String(formData.get("issueDate"))) : new Date(),
      dueDate: formData.get("dueDate") ? new Date(String(formData.get("dueDate"))) : undefined,
      method: String(formData.get("method") || ""),
      note: String(formData.get("note") || ""),
    },
  });
  revalidatePath("/invoices");
  redirect("/invoices");
}

// ── Team member (CTV) ──────────────────────────────────────────
export async function createTeamMember(formData: FormData) {
  const userId = await requireUserId();
  await prisma.teamMember.create({
    data: {
      ownerId: userId,
      name: String(formData.get("name")),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      role: String(formData.get("role") || ""),
    },
  });
  revalidatePath("/team");
  redirect("/team");
}

// ── Quote / Contract ────────────────────────────────────────────
export async function createQuote(formData: FormData) {
  await requireUserId();
  const projectId = String(formData.get("projectId"));
  await prisma.quote.create({
    data: {
      projectId,
      code: `BG-${Date.now().toString().slice(-6)}`,
      content: String(formData.get("content") || ""),
      totalAmount: Number(formData.get("totalAmount") || 0),
    },
  });
  revalidatePath(`/projects/${projectId}`);
}

export async function createContract(formData: FormData) {
  await requireUserId();
  const projectId = String(formData.get("projectId"));
  await prisma.contract.create({
    data: {
      projectId,
      docType: (String(formData.get("docType")) as any) || "CONTRACT",
      code: `HD-${Date.now().toString().slice(-6)}`,
      place: String(formData.get("place") || "TP. Hồ Chí Minh"),
      signDate: new Date(),
      content: String(formData.get("content") || ""),
      valueBefore: Number(formData.get("valueBefore") || 0),
      depositPct: Number(formData.get("depositPct") || 0),
    },
  });
  revalidatePath(`/projects/${projectId}`);
}

// ── Ký hợp đồng qua OTP ─────────────────────────────────────────
export async function sendContractOtp(formData: FormData) {
  const contractId = String(formData.get("contractId"));
  const clientEmail = String(formData.get("clientEmail"));
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const contract = await prisma.contract.update({
    where: { id: contractId },
    data: { otpCode: code, otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    include: { project: true },
  });

  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Task Controller <onboarding@resend.dev>",
      to: clientEmail,
      subject: `Mã xác nhận ký văn bản ${contract.code}`,
      html: `<p>Mã OTP của bạn để ký văn bản <b>${contract.code}</b> (dự án ${contract.project.name}) là:</p><h2>${code}</h2><p>Mã có hiệu lực trong 10 phút.</p>`,
    });
  }

  return { ok: true };
}

export async function verifyContractOtp(contractId: string, code: string) {
  const contract = await prisma.contract.findUnique({ where: { id: contractId } });
  if (!contract || !contract.otpCode || !contract.otpExpiresAt) return { ok: false, message: "Chưa gửi mã OTP." };
  if (contract.otpExpiresAt < new Date()) return { ok: false, message: "Mã đã hết hạn, vui lòng gửi lại." };
  if (contract.otpCode !== code) return { ok: false, message: "Mã không đúng." };

  await prisma.contract.update({
    where: { id: contractId },
    data: { signedByClient: true, otpCode: null, otpExpiresAt: null },
  });
  revalidatePath(`/sign/${contractId}`);
  return { ok: true };
}

// ── Đồng bộ Google Calendar ─────────────────────────────────────
export async function syncGoogleCalendar() {
  const userId = await requireUserId();
  const { getGoogleCalendarClient } = await import("./googleCalendar");
  const calendar = await getGoogleCalendarClient(userId);
  if (!calendar) return { ok: false, message: "Chưa kết nối Google Calendar (đăng nhập lại để cấp quyền)." };

  const events = await prisma.calendarEvent.findMany({
    where: { project: { ownerId: userId } },
    include: { project: { include: { client: true } } },
  });

  let synced = 0;
  for (const ev of events) {
    if (ev.googleEventId) continue; // đã đồng bộ rồi
    try {
      const date = new Date(ev.date).toISOString().slice(0, 10);
      const created = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: `${ev.title}${ev.project ? " — " + ev.project.client.name : ""}`,
          start: { date },
          end: { date },
        },
      });
      await prisma.calendarEvent.update({ where: { id: ev.id }, data: { googleEventId: created.data.id } });
      synced++;
    } catch (e) {
      // bỏ qua event lỗi, tiếp tục cái khác
    }
  }

  revalidatePath("/calendar");
  return { ok: true, synced };
}

// ── Resource (link) ─────────────────────────────────────────────
export async function addResource(formData: FormData) {
  await requireUserId();
  const projectId = String(formData.get("projectId"));
  await prisma.resource.create({
    data: {
      projectId,
      name: String(formData.get("name") || "Tài nguyên"),
      url: String(formData.get("url")),
    },
  });
  revalidatePath(`/projects/${projectId}`);
}

// ── Project cost / assignee payout ─────────────────────────────
export async function addProjectCost(formData: FormData) {
  await requireUserId();
  const projectId = String(formData.get("projectId"));
  await prisma.projectCost.create({
    data: {
      projectId,
      label: String(formData.get("label")),
      amount: Number(formData.get("amount") || 0),
    },
  });
  revalidatePath(`/projects/${projectId}`);
}
