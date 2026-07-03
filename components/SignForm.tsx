"use client";

import { useState, useTransition } from "react";
import { sendContractOtp, verifyContractOtp } from "@/lib/actions";

export default function SignForm({ contractId, defaultEmail }: { contractId: string; defaultEmail: string }) {
  const [step, setStep] = useState<"email" | "otp" | "done">("email");
  const [email, setEmail] = useState(defaultEmail);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    setMessage("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("contractId", contractId);
      fd.set("clientEmail", email);
      await sendContractOtp(fd);
      setStep("otp");
      setMessage(`Đã gửi mã xác nhận tới ${email}. Kiểm tra hộp thư (kể cả spam).`);
    });
  }

  function handleVerify() {
    setMessage("");
    startTransition(async () => {
      const res = await verifyContractOtp(contractId, code);
      if (res.ok) setStep("done");
      else setMessage(res.message || "Có lỗi xảy ra.");
    });
  }

  if (step === "done") {
    return <p className="text-accent-light">✅ Ký thành công! Cảm ơn bạn.</p>;
  }

  return (
    <div>
      {step === "email" && (
        <>
          <label className="label">Email nhận mã xác nhận</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input mb-4" placeholder="email@vidu.com" />
          <button onClick={handleSend} disabled={isPending || !email} className="btn-accent w-full">
            {isPending ? "Đang gửi..." : "Gửi mã xác nhận"}
          </button>
        </>
      )}
      {step === "otp" && (
        <>
          <label className="label">Nhập mã 6 số đã gửi tới email</label>
          <input value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} className="input mb-4 text-center text-lg tracking-widest" placeholder="------" />
          <button onClick={handleVerify} disabled={isPending || code.length !== 6} className="btn-accent w-full mb-2">
            {isPending ? "Đang xác nhận..." : "Xác nhận & Ký"}
          </button>
          <button onClick={() => setStep("email")} className="btn-ghost w-full text-xs">Gửi lại mã</button>
        </>
      )}
      {message && <p className="text-xs text-muted mt-3">{message}</p>}
    </div>
  );
}
