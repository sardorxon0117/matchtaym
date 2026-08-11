"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateLiveSettings } from "@/actions/live";
import { useToast } from "@/components/Toast";

export default function LiveSettingsForm({ initialChannel }: { initialChannel: string }) {
  const [error, formAction, pending] = useActionState(updateLiveSettings, undefined);
  const toast = useToast();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (error) toast.show(error, "error");
      else toast.show("Saqlandi ✓");
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, error]);

  return (
    <form action={formAction} className="max-w-sm space-y-4 rounded-card border border-ink/10 bg-white p-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Twitch kanal nomi</span>
        <input
          name="twitchChannel"
          required
          defaultValue={initialChannel}
          placeholder="masalan: matchtaym"
          className="input"
        />
        <span className="mt-1 block text-xs text-ink-soft/70">
          OBS orqali shu Twitch kanaliga efir yuborasiz — saytdagi katta oyna shu kanalni ko&apos;rsatadi.
        </span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Saqlanmoqda…" : "Saqlash"}
      </button>
    </form>
  );
}
