"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitDonationInquiry } from "@/actions/donate";
import { useToast } from "@/components/Toast";

export default function DonateInterestForm() {
  const [error, formAction, pending] = useActionState(submitDonationInquiry, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);
  const toast = useToast();

  useEffect(() => {
    if (wasPending.current && !pending) {
      if (error) {
        toast.show(error, "error");
      } else {
        formRef.current?.reset();
        toast.show("Rahmat! Shartnoma yakunlangach, siz bilan bog'lanamiz ✓");
      }
    }
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, error]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input type="text" name="name" required placeholder="Ismingiz" className="input" />
        <input type="email" name="email" required placeholder="Email" className="input" />
      </div>
      <textarea
        name="message"
        rows={2}
        maxLength={2000}
        placeholder="Qo'shimcha izoh (ixtiyoriy)"
        className="input resize-none"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Yuborilmoqda…" : "Xabardor qilishimizni istayman"}
      </button>
    </form>
  );
}
