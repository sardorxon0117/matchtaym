"use client";

import { useTransition } from "react";
import { useToast } from "@/components/Toast";

export default function DeleteButton({
  action,
  confirmText = "Rostdan ham o'chirmoqchimisiz?",
  children = "O'chirish",
  className = "text-sm font-medium text-red-600 hover:underline",
  successMessage = "O'chirildi",
}: {
  action: () => void | Promise<void>;
  confirmText?: string;
  children?: React.ReactNode;
  className?: string;
  successMessage?: string;
}) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function handleClick() {
    if (!confirm(confirmText)) return;
    startTransition(async () => {
      try {
        await action();
        toast.show(successMessage);
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "Xatolik yuz berdi", "error");
      }
    });
  }

  return (
    <button type="button" onClick={handleClick} disabled={pending} className={className}>
      {pending ? "…" : children}
    </button>
  );
}
