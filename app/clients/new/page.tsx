import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/actions";
import Sidebar from "@/components/Sidebar";
import { X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewClientPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 flex items-center justify-center min-h-screen px-10">
        <form action={createClient} className="card w-full max-w-lg relative">
          <Link href="/clients" className="absolute top-5 right-5 text-muted hover:text-white"><X className="w-5 h-5" /></Link>
          <h2 className="text-xl font-bold mb-6">Khách hàng mới</h2>

          <label className="label">Tên khách hàng</label>
          <input name="name" required className="input mb-4" placeholder="VD: Nguyễn Văn A" />

          <label className="label">Công ty / Đơn vị</label>
          <input name="company" className="input mb-4" placeholder="VD: ABC Studio" />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Điện thoại</label>
              <input name="phone" className="input" placeholder="09xxxxxxxx" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" className="input" placeholder="email@vidu.com" />
            </div>
          </div>

          <label className="label">Địa chỉ</label>
          <input name="address" className="input mb-4" placeholder="Địa chỉ liên hệ" />

          <label className="label">Mã số thuế</label>
          <input name="taxCode" className="input mb-6" placeholder="Nếu có" />

          <div className="flex justify-end gap-2">
            <Link href="/clients" className="btn-ghost">Huỷ</Link>
            <button type="submit" className="btn-accent">Tạo khách hàng</button>
          </div>
        </form>
      </main>
    </div>
  );
}
