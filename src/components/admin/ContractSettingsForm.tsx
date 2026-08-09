"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateAdContractSettings } from "@/actions/ad-contract";
import { useToast } from "@/components/Toast";

export default function ContractSettingsForm({
  initial,
}: {
  initial?: { cardNumber?: string | null; cardHolderName?: string | null };
}) {
  const [error, formAction, pending] = useActionState(updateAdContractSettings, undefined);
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
      <p className="text-sm text-ink-soft">
        Reklama beruvchilar shartnomani imzolagandan keyin to&apos;lov uchun shu karta ma&apos;lumotlarini ko&apos;radi.
      </p>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Karta raqami</span>
        <input
          name="cardNumber"
          required
          defaultValue={initial?.cardNumber ?? ""}
          placeholder="8600 XXXX XXXX XXXX"
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink">Karta egasining ismi</span>
        <input name="cardHolderName" required defaultValue={initial?.cardHolderName ?? ""} className="input" />
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
