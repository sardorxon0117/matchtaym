"use client";

import { useState, useTransition } from "react";
import { toggleBannerEnabled } from "@/actions/banner";
import { useToast } from "@/components/Toast";

export default function EnabledToggle({ id, initialEnabled }: { id: string; initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function handleToggle() {
    const next = !enabled;
    setEnabled(next);
    startTransition(async () => {
      try {
        await toggleBannerEnabled(id, next);
        toast.show(next ? "Banner yoqildi ✓" : "Banner nofaol qilindi");
      } catch (err) {
        setEnabled(!next);
        toast.show(err instanceof Error ? err.message : "Xatolik yuz berdi", "error");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      aria-pressed={enabled}
      aria-label={enabled ? "Bannerni o'chirish" : "Bannerni yoqish"}
      className={`relative h-6 w-11 shrink-0 rounded-pill transition-colors disabled:opacity-60 ${
        enabled ? "bg-primary" : "bg-ink/15"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          enabled ? "translate-x-[1.375rem]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
