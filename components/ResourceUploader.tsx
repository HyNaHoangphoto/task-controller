"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { addResource } from "@/lib/actions";
import { Upload, Loader2 } from "lucide-react";

export default function ResourceUploader({ projectId }: { projectId: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setUploading(true);
    setError("");
    try {
      const path = `${projectId}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabaseBrowser.storage.from("resources").upload(path, file);
      if (upErr) throw upErr;
      const { data } = supabaseBrowser.storage.from("resources").getPublicUrl(path);

      const fd = new FormData();
      fd.set("projectId", projectId);
      fd.set("name", file.name);
      fd.set("url", data.publicUrl);
      await addResource(fd);
    } catch (e: any) {
      setError(e.message || "Upload thất bại. Kiểm tra đã tạo bucket 'resources' (public) trên Supabase chưa.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="card mb-4 border-dashed">
      <label className="flex flex-col items-center justify-center gap-2 py-6 cursor-pointer">
        <input
          type="file"
          className="hidden"
          disabled={uploading}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {uploading ? <Loader2 className="w-6 h-6 text-accent-light animate-spin" /> : <Upload className="w-6 h-6 text-accent-light" />}
        <span className="text-sm text-muted">{uploading ? "Đang upload..." : "Bấm để chọn file, hoặc kéo thả vào đây"}</span>
      </label>
      {error && <p className="text-xs text-danger mt-2">{error}</p>}
    </div>
  );
}
