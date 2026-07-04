"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Trash2 } from "lucide-react";
import { deleteProject } from "@/lib/actions";

export default function ProjectMoreMenu({ projectId, projectName }: { projectId: string; projectName: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Xoá dự án "${projectName}"? Toàn bộ task, hoá đơn, hợp đồng liên quan sẽ bị xoá theo. Không thể hoàn tác.`)) return;
    startTransition(() => deleteProject(projectId));
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="btn-ghost !px-2.5"><MoreVertical className="w-4 h-4" /></button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-panel border border-border rounded-lg overflow-hidden z-10">
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-card transition"
          >
            <Trash2 className="w-4 h-4" /> {isPending ? "Đang xoá..." : "Xoá dự án"}
          </button>
        </div>
      )}
    </div>
  );
}
