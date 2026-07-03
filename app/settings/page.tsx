import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { saveBusinessProfile } from "@/lib/actions";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import { Zap, LogOut, Hash } from "lucide-react";
import SettingsProfileTypeToggle from "@/components/SettingsProfileTypeToggle";
import SettingsNotifyToggle from "@/components/SettingsNotifyToggle";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  const userId = (session.user as any).id as string;

  const [projectCount, profile] = await Promise.all([
    prisma.project.count({ where: { ownerId: userId } }),
    prisma.businessProfile.findUnique({ where: { userId } }),
  ]);

  return (
    <div className="flex">
      <Sidebar userName={session.user.name} userEmail={session.user.email} />
      <main className="flex-1 px-10 py-8 max-w-[1000px]">
        <TopBar title="Cài đặt" subtitle="Tuỳ chỉnh app theo cách bạn làm việc" />

        <div className="card mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-panel flex items-center justify-center">
              <Zap className="w-5 h-5 text-muted" />
            </div>
            <div>
              <div className="font-semibold">Free</div>
              <div className="text-xs text-muted">Giới hạn 5 dự án · 20 hoá đơn/tháng · PDF có watermark ({projectCount}/5 dự án đã dùng)</div>
            </div>
          </div>
          <button className="btn-accent flex items-center gap-2"><Zap className="w-4 h-4" /> Nâng cấp Pro</button>
        </div>

        <div className="card mb-4">
          <div className="font-semibold mb-1">Tài khoản Google</div>
          <p className="text-xs text-muted mb-4">Đã đăng nhập — token sẵn sàng cho Calendar &amp; Sheets API</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-sm font-semibold">
                {(session.user.name || "K")[0]}
              </div>
              <div className="text-sm">
                <div className="font-medium">{session.user.name}</div>
                <div className="text-muted text-xs">{session.user.email}</div>
              </div>
            </div>
            <button className="btn-ghost flex items-center gap-2 text-xs"><LogOut className="w-3.5 h-3.5" /> Đăng xuất</button>
          </div>
        </div>

        <form action={saveBusinessProfile} className="card mb-4">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="font-semibold">Hồ sơ doanh nghiệp</div>
              <p className="text-xs text-muted">Thông tin in trên hoá đơn PDF và chữ ký email</p>
            </div>
            <SettingsProfileTypeToggle defaultValue={profile?.type || "company"} />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <div>
              <label className="label">Tên doanh nghiệp</label>
              <input name="companyName" defaultValue={profile?.companyName || ""} className="input" placeholder="VD: Anh em phạm quyết" />
            </div>
            <div>
              <label className="label">Người ký hoá đơn</label>
              <input name="signerName" defaultValue={profile?.signerName || ""} className="input" placeholder="Task Controller" />
            </div>
            <div>
              <label className="label">Mã số thuế (nếu có)</label>
              <input name="taxCode" defaultValue={profile?.taxCode || ""} className="input" />
            </div>
            <div>
              <label className="label">Số điện thoại</label>
              <input name="phone" defaultValue={profile?.phone || ""} className="input" placeholder="+84" />
            </div>
            <div>
              <label className="label">Email</label>
              <input name="email" type="email" defaultValue={profile?.email || ""} className="input" />
            </div>
            <div>
              <label className="label">Website</label>
              <input name="website" defaultValue={profile?.website || ""} className="input" />
            </div>
          </div>

          <label className="label mt-4">Địa chỉ</label>
          <input name="address" defaultValue={profile?.address || ""} className="input" placeholder="Hồ Chí Minh, Việt Nam" />

          <label className="label mt-4">Lĩnh vực</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {["Video / Sáng tạo", "IT / Phần mềm", "Thiết kế", "Dạy thêm / Giáo dục", "Khác"].map((tag) => (
              <label key={tag} className="cursor-pointer">
                <input type="radio" name="industry" value={tag} defaultChecked={profile?.industry === tag} className="peer hidden" />
                <span className="px-3 py-1.5 text-xs rounded-full border border-border text-muted peer-checked:border-accent peer-checked:text-accent-light transition">
                  {tag}
                </span>
              </label>
            ))}
          </div>

          <div className="pt-5 mt-5 border-t border-border">
            <div className="font-semibold text-sm mb-3">🏦 Thông tin chuyển khoản</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Tên ngân hàng + chi nhánh</label>
                <input name="bankName" defaultValue={profile?.bankName || ""} className="input" placeholder="Vietcombank — CN HCM" />
              </div>
              <div>
                <label className="label">Chủ tài khoản</label>
                <input name="bankAccountName" defaultValue={profile?.bankAccountName || ""} className="input" />
              </div>
            </div>
            <label className="label mt-4">Số tài khoản</label>
            <input name="bankAccountNumber" defaultValue={profile?.bankAccountNumber || ""} className="input max-w-xs" />
          </div>

          <div className="grid grid-cols-3 gap-4 pt-5 mt-5 border-t border-border">
            <ProfileImageUploader field="bankQrUrl" label="QR Ngân hàng" hint="PNG/JPG/WebP — tối đa 1MB. Sẽ in trên báo giá & hoá đơn." currentUrl={profile?.bankQrUrl} />
            <ProfileImageUploader field="logoUrl" label="Logo công ty" hint="PNG nền trong suốt, tối đa 1MB." currentUrl={profile?.logoUrl} />
            <ProfileImageUploader field="signatureUrl" label="Chữ ký / mộc" hint="PNG nền trong suốt, tối đa 1MB." currentUrl={profile?.signatureUrl} />
          </div>

          <label className="label mt-5">Lời nhắn cuối hoá đơn</label>
          <textarea name="invoiceFooterMessage" defaultValue={profile?.invoiceFooterMessage || ""} rows={2} className="input" placeholder="Cảm ơn Quý khách đã tin tưởng và hợp tác..." />

          <div className="pt-5 mt-5 border-t border-border">
            <div className="font-semibold text-sm mb-1">Điều khoản mẫu của tôi</div>
            <p className="text-xs text-muted mb-4">Soạn 1 lần — báo giá & hợp đồng mới sẽ tự điền sẵn. Để trống nếu muốn mỗi lần tự nhập.</p>

            <label className="label">Điều khoản báo giá mặc định</label>
            <textarea name="defaultQuoteTerms" defaultValue={profile?.defaultQuoteTerms || ""} rows={3} className="input mb-4" placeholder="VD: Thanh toán 50% khi chốt, 50% sau bàn giao. Tối đa 2 lần chỉnh sửa..." />

            <label className="label">Nội dung / điều khoản hợp đồng mặc định</label>
            <textarea name="defaultContractTerms" defaultValue={profile?.defaultContractTerms || ""} rows={3} className="input mb-4" />

            <label className="label">Mẫu biên bản nghiệm thu</label>
            <textarea name="defaultAcceptanceTemplate" defaultValue={profile?.defaultAcceptanceTemplate || ""} rows={3} className="input mb-4" />

            <label className="label">Mẫu phụ lục hợp đồng</label>
            <textarea name="defaultAddendumTemplate" defaultValue={profile?.defaultAddendumTemplate || ""} rows={3} className="input" />
          </div>

          <div className="flex justify-end mt-5">
            <button type="submit" className="btn-accent">Lưu hồ sơ</button>
          </div>
        </form>

        <div className="card mb-4">
          <div className="font-semibold">Ngôn ngữ / Language</div>
          <p className="text-xs text-muted mb-3">VI ↔ EN</p>
          <div className="flex gap-2">
            <button className="btn-accent !py-2 text-sm">Tiếng Việt</button>
            <button className="btn-ghost !py-2 text-sm">English</button>
          </div>
          <p className="text-xs text-muted mt-2">Bản EN đang phát triển — hiện tại app chỉ chạy tiếng Việt.</p>
        </div>

        <form action={saveBusinessProfile} className="card mb-4">
          <div className="font-semibold">Thông báo qua email</div>
          <p className="text-xs text-muted mb-4">Gửi qua Resend khi có thay đổi trên dự án và hoá đơn</p>

          <SettingsNotifyToggle
            defaultEnabled={profile?.notifyEnabled || false}
            defaultEmail={profile?.notifyEmail || session.user.email || ""}
            defaults={{
              notifyInvoiceCreated: profile?.notifyInvoiceCreated ?? true,
              notifyInvoicePaid: profile?.notifyInvoicePaid ?? true,
              notifyProjectStatusChange: profile?.notifyProjectStatusChange ?? false,
              notifyDeadlineChange: profile?.notifyDeadlineChange ?? true,
              notifyDeadlineReminder7d: profile?.notifyDeadlineReminder7d ?? true,
            }}
          />

          <div className="flex justify-end mt-4">
            <button type="submit" className="btn-accent">Lưu thông báo</button>
          </div>
        </form>

        <div className="card flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-gradient flex items-center justify-center">
            <Hash className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-sm">Task Controller v2.0</span>
        </div>
      </main>
    </div>
  );
}
