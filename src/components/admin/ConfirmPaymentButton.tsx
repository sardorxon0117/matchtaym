"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { confirmPayment } from "@/actions/ad-contract";

export default function ConfirmPaymentButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();
  const toast = useToast();
  const router = useRouter();

  function handleClick() {
    if (!confirm("To'lovni tasdiqlaysizmi? Bu reklama joyini yakuniy band qiladi.")) return;
    startTransition(async () => {
      try {
        await confirmPayment(id);
        toast.show("To'lov tasdiqlandi ✓");
        router.refresh();
      } catch (err) {
        toast.show(err instanceof Error ? err.message : "Xatolik yuz berdi", "error");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="rounded-pill bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
    >
      {pending ? "…" : "To'lovni tasdiqlash"}
    </button>
  );
}
