"use client";

import { useState, useTransition } from "react";
import { toggleLiveStatus } from "@/actions/live";
import { useToast } from "@/components/Toast";

export default function LiveToggle({ initialLive }: { initialLive: boolean }) {
  const [live, setLive] = useState(initialLive);
  const [pending, startTransition] = useTransition();
  const toast = useToast();

  function handleToggle() {
    const next = !live;
    setLive(next);
    startTransition(async () => {
      try {
        await toggleLiveStatus(next);
        toast.show(next ? "Efir jonli deb belgilandi ✓" : "Efir to'xtatildi");
      } catch (err) {
        setLive(!next);
        toast.show(err instanceof Error ? err.message : "Xatolik yuz berdi", "error");
      }
    });
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={pending}
        aria-pressed={live}
        aria-label={live ? "Efirni to'xtatish" : "Efirni jonli deb belgilash"}
        className={`inline-flex h-6 w-11 shrink-0 items-center rounded-pill p-0.5 transition-colors disabled:opacity-60 ${
          live ? "bg-red-600" : "bg-ink/15"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
            live ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
      <span className="text-sm font-medium text-ink">{live ? "🔴 Hozir jonli efir ketmoqda" : "Efir jonli emas"}</span>
    </div>
  );
}
