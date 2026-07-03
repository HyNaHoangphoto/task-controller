"use client";

import { toggleTask } from "@/lib/actions";
import { useTransition } from "react";

export default function TaskCheckbox({ taskId, projectId, done }: { taskId: string; projectId: string; done: boolean }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => toggleTask(taskId, projectId, !done))}
      className={`w-4 h-4 rounded-full border shrink-0 ${done ? "bg-accent border-accent" : "border-muted"}`}
    />
  );
}
