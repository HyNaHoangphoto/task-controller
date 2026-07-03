"use client";

import { signIn } from "next-auth/react";
import { Hash } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="card w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-xl bg-accent-gradient flex items-center justify-center mx-auto mb-4">
          <Hash className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-xl font-bold mb-1">Task Controller</h1>
        <p className="text-muted text-sm mb-6">Quản lý cho nhà sáng tạo</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="btn-accent w-full"
        >
          Đăng nhập với Google
        </button>
      </div>
    </div>
  );
}
