"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { signAdContract } from "@/actions/ad-contract";
import { useToast } from "@/components/Toast";
import { formatDateTimeUz } from "@/lib/utils";

export default function ContractSignForm({
  token,
  bookedRanges,
}: {
  token: string;
  bookedRanges: { startAt: string; endAt: string }[];
}) {
  const action = signAdContract.bind(null, token);
  const [error, formAction, pending] = useActionState(action, undefined);
  const toast = useToast();
  const router = useRouter();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (error) {
        toast.show(error, "error");
      } else {
        toast.show("Shartnoma imzolandi ✓");
        router.refresh();
      }
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, error]);

  return (
    <form action={formAction} className="space-y-4 rounded-card border border-ink/10 bg-white p-5 sm:p-6">
      <h2 className="font-heading text-lg font-semibold text-ink">Ma&apos;lumotlaringizni kiriting</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <input name="familiya" required placeholder="Familiya" className="input" />
        <input name="ism" required placeholder="Ism" className="input" />
        <input name="sharif" placeholder="Otasining ismi" className="input" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Reklama boshlanish vaqti</span>
          <input type="datetime-local" name="startAt" required className="input" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Reklama tugash vaqti</span>
          <input type="datetime-local" name="endAt" required className="input" />
        </label>
      </div>

      {bookedRanges.length > 0 && (
        <div className="rounded-card border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          <p className="mb-1 font-semibold">Band vaqtlar — bu oraliqlarni tanlamang:</p>
          <ul className="space-y-0.5">
            {bookedRanges.map((r, i) => (
              <li key={i}>
                {formatDateTimeUz(r.startAt)} — {formatDateTimeUz(r.endAt)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <label className="flex items-start gap-2.5">
        <input type="checkbox" name="roziman" className="mt-0.5 h-4 w-4 accent-primary" />
        <span className="text-sm text-ink">Yuqoridagi shartnoma shartlariga roziman</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Yuborilmoqda…" : "Imzolash"}
      </button>
    </form>
  );
}
