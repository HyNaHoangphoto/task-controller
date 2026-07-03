import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SignForm from "@/components/SignForm";
import { Hash, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SignContractPage({ params }: { params: { id: string } }) {
  const contract = await prisma.contract.findUnique({
    where: { id: params.id },
    include: { project: { include: { client: true } } },
  });
  if (!contract) notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="card w-full max-w-xl">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center">
            <Hash className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold">Task Controller</span>
        </div>

        <h1 className="text-xl font-bold mb-1">{contract.code} — {contract.project.name}</h1>
        <p className="text-sm text-muted mb-6">Khách hàng: {contract.project.client.name}</p>

        <div className="bg-panel rounded-lg p-4 mb-6 max-h-64 overflow-y-auto text-sm whitespace-pre-wrap">
          {contract.content || "(Chưa có nội dung chi tiết)"}
        </div>

        <div className="flex justify-between text-sm mb-6 pb-6 border-b border-border">
          <span className="text-muted">Giá trị</span>
          <span className="font-semibold text-accent-light">{contract.valueBefore.toLocaleString("vi-VN")} đ</span>
        </div>

        {contract.signedByClient ? (
          <div className="flex items-center gap-2 text-accent-light">
            <CheckCircle2 className="w-5 h-5" /> Văn bản đã được ký xác nhận.
          </div>
        ) : (
          <SignForm contractId={contract.id} defaultEmail={contract.project.client.email || ""} />
        )}
      </div>
    </div>
  );
}
