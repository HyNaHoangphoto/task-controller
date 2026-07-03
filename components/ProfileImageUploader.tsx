"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { updateProfileFileUrl } from "@/lib/actions";
import { ImageIcon, PenLine, QrCode, Loader2 } from "lucide-react";

const ICONS = { bankQrUrl: QrCode, logoUrl: ImageIcon, signatureUrl: PenLine };

export default function ProfileImageUploader({
  field,
  label,
  hint,
  currentUrl,
}: {
  field: "bankQrUrl" | "logoUrl" | "signatureUrl";
  label: string;
  hint: string;
  currentUrl?: string | null;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const Icon = ICONS[field];

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const path = `profile/${field}-${Date.now()}-${file.name}`;
      const { error } = await supabaseBrowser.storage.from("resources").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabaseBrowser.storage.from("resources").getPublicUrl(path);
      setPreview(data.publicUrl);
      await updateProfileFileUrl(field, data.publicUrl);
    } catch (e) {
      alert("Upload lỗi. Kiểm tra đã tạo bucket 'resources' (Public) trên Supabase Storage chưa.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="label">{label}</label>
      <label className="border border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 py-6 cursor-pointer hover:border-accent/50 transition">
        <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {preview ? (
          <img src={preview} alt={label} className="h-14 object-contain" />
        ) : uploading ? (
          <Loader2 className="w-6 h-6 text-accent-light animate-spin" />
        ) : (
          <Icon className="w-6 h-6 text-accent-light" />
        )}
        <span className="text-sm font-medium">{uploading ? "Đang upload..." : preview ? "Đổi ảnh khác" : `Tải lên ${label.toLowerCase()}`}</span>
        <span className="text-xs text-muted text-center px-4">{hint}</span>
      </label>
    </div>
  );
}
