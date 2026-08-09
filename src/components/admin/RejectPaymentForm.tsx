"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { rejectPayment } from "@/actions/ad-contract";
import { useToast } from "@/components/Toast";

export default function RejectPaymentForm({ id }: { id: string }) {
  const action = rejectPayment.bind(null, id);
  const [error, formAction, pending] = useActionState(action, undefined);
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (error) {
        toast.show(error, "error");
      } else {
        toast.show("Rad etildi");
        // No need to reset `open` — once the parent re-fetches, this
        // component's whole PAYMENT_SUBMITTED branch stops rendering.
        router.refresh();
      }
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, error]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-pill border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
      >
        Rad etish
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-1 flex-wrap items-center gap-2">
      <input name="reason" required placeholder="Rad etish sababi" className="input flex-1" />
      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "…" : "Tasdiqlash"}
      </button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
