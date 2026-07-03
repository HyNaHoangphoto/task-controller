import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createTeamMember } from "@/lib/actions";
import Sidebar from "@/components/Sidebar";
import { X } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function NewTeamMemberPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 flex items-center justify-center min-h-screen px-10">
        <form action={createTeamMember} className="card w-full max-w-lg relative">
          <Link href="/team" className="absolute top-5 right-5 text-muted hover:text-white"><X className="w-5 h-5" /></Link>
          <h2 className="text-xl font-bold mb-6">Thêm cộng tác viên</h2>

          <label className="label">Tên CTV</label>
          <input name="name" required className="input mb-4" placeholder="VD: Trần Văn B" />

          <label className="label">Vai trò</label>
          <input name="role" className="input mb-4" placeholder="VD: Quay phim, Dựng phim..." />

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="label">Điện thoại</label>
              <input name="phone" className="input" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" className="input" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Link href="/team" className="btn-ghost">Huỷ</Link>
            <button type="submit" className="btn-accent">Thêm CTV</button>
          </div>
        </form>
      </main>
    </div>
  );
}
