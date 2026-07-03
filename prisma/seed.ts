import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "hoangkhoinhiepanh@gmail.com" },
    update: {},
    create: {
      email: "hoangkhoinhiepanh@gmail.com",
      name: "Khôi Hoàng",
    },
  });

  const client = await prisma.client.create({
    data: {
      ownerId: user.id,
      name: "A Quyết",
      company: "Quay Film",
      phone: "0915051600",
      email: "phamquyet20061981@gmail.com",
      address: "456 Đường XYZ, Phường Y, Quận 3, TP.HCM",
      taxCode: "0312345678",
    },
  });

  // ── Dự án 1: Quay clip — hạn 17/7/2026 ─────────────────────────
  const project1 = await prisma.project.create({
    data: {
      ownerId: user.id,
      clientId: client.id,
      name: "Quay clip",
      status: "RUNNING",
      contractValue: 18_000_000,
      depositPct: 30,
      startDate: new Date("2026-06-18"),
      deadline: new Date("2026-07-17"),
      paymentStatus: "PARTIAL",
    },
  });

  const phase1a = await prisma.phase.create({
    data: { projectId: project1.id, name: "Tiền kỳ", order: 1, startDate: new Date("2026-06-17"), endDate: new Date("2026-06-24") },
  });
  const phase2a = await prisma.phase.create({
    data: { projectId: project1.id, name: "Sản xuất", order: 2, startDate: new Date("2026-06-24"), endDate: new Date("2026-07-08") },
  });
  const phase3a = await prisma.phase.create({
    data: { projectId: project1.id, name: "Hậu kỳ", order: 3, startDate: new Date("2026-07-08"), endDate: new Date("2026-07-17") },
  });

  const tasksProject1: { title: string; priority: "HIGH" | "MEDIUM"; dueDate: string; phaseId: string }[] = [
    { title: "Nhận brief & họp kickoff", priority: "HIGH", dueDate: "2026-06-18", phaseId: phase1a.id },
    { title: "Lên concept & moodboard", priority: "HIGH", dueDate: "2026-06-20", phaseId: phase1a.id },
    { title: "Script & storyboard", priority: "HIGH", dueDate: "2026-06-22", phaseId: phase1a.id },
    { title: "Duyệt concept với khách", priority: "MEDIUM", dueDate: "2026-06-24", phaseId: phase2a.id },
    { title: "Chuẩn bị props & casting", priority: "MEDIUM", dueDate: "2026-06-27", phaseId: phase2a.id },
    { title: "Ngày quay chính", priority: "HIGH", dueDate: "2026-07-01", phaseId: phase2a.id },
    { title: "Rough cut v1", priority: "HIGH", dueDate: "2026-07-05", phaseId: phase2a.id },
    { title: "Nhận feedback khách", priority: "MEDIUM", dueDate: "2026-07-07", phaseId: phase2a.id },
    { title: "Fine cut + color grade", priority: "HIGH", dueDate: "2026-07-11", phaseId: phase3a.id },
    { title: "Sound design & mix", priority: "MEDIUM", dueDate: "2026-07-13", phaseId: phase3a.id },
    { title: "Export & delivery final", priority: "HIGH", dueDate: "2026-07-16", phaseId: phase3a.id },
  ];
  for (const t of tasksProject1) {
    await prisma.task.create({
      data: { projectId: project1.id, phaseId: t.phaseId, title: t.title, priority: t.priority, dueDate: new Date(t.dueDate) },
    });
  }

  await prisma.invoice.create({
    data: {
      ownerId: user.id, projectId: project1.id,
      code: "#INV260617", title: "Quay clip (đặt cọc 30%)",
      totalAmount: 18_000_000, paidAmount: 5_400_000, status: "PARTIAL",
      issueDate: new Date("2026-06-18"), dueDate: new Date("2026-07-18"), method: "Chuyển khoản",
    },
  });

  await prisma.contract.create({
    data: {
      projectId: project1.id, docType: "CONTRACT", code: "HD-260702",
      place: "TP. Hồ Chí Minh", signDate: new Date("2026-07-02"),
      content: "", valueBefore: 18_000_000, taxOption: "Không thuế", depositPct: 30,
    },
  });

  // ── Dự án 2: Quay clip #2 — hạn 18/7/2026 ──────────────────────
  const project2 = await prisma.project.create({
    data: {
      ownerId: user.id,
      clientId: client.id,
      name: "Quay clip",
      status: "RUNNING",
      contractValue: 18_000_000,
      depositPct: 30,
      startDate: new Date("2026-06-19"),
      deadline: new Date("2026-07-18"),
      paymentStatus: "PAID",
    },
  });

  const phases2 = [
    { name: "Tiền kỳ", order: 1, start: "2026-06-18", end: "2026-06-25" },
    { name: "Sản xuất", order: 2, start: "2026-06-25", end: "2026-07-09" },
    { name: "Hậu kỳ", order: 3, start: "2026-07-09", end: "2026-07-18" },
  ];
  const phaseIds2: string[] = [];
  for (const p of phases2) {
    const ph = await prisma.phase.create({
      data: { projectId: project2.id, name: p.name, order: p.order, startDate: new Date(p.start), endDate: new Date(p.end) },
    });
    phaseIds2.push(ph.id);
  }
  for (const t of tasksProject1) {
    await prisma.task.create({
      data: { projectId: project2.id, title: t.title, priority: t.priority, dueDate: new Date(t.dueDate), done: false },
    });
  }

  await prisma.invoice.create({
    data: {
      ownerId: user.id, projectId: project2.id,
      code: "#INV260617-2", title: "Quay clip",
      totalAmount: 18_000_000, paidAmount: 18_000_000, status: "PAID",
      issueDate: new Date("2026-06-19"), dueDate: new Date("2026-07-17"), paidDate: new Date("2026-07-01"), method: "Chuyển khoản",
    },
  });

  // ── Sự kiện lịch (khớp deadline sắp tới trong ảnh) ─────────────
  await prisma.calendarEvent.create({ data: { projectId: project1.id, title: "Quay clip", date: new Date("2026-07-17") } });
  await prisma.calendarEvent.create({ data: { projectId: project2.id, title: "Quay clip", date: new Date("2026-07-18") } });

  console.log("Seed hoàn tất:", { user: user.email, client: client.name, projects: [project1.id, project2.id] });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
