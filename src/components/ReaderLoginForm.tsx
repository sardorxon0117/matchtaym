"use client";

import { useActionState } from "react";
import Link from "next/link";
import { readerLoginAction } from "@/actions/auth";

export default function ReaderLoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [error, formAction, pending] = useActionState(readerLoginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? "/"} />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
        <input type="email" name="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Parol</label>
        <input type="password" name="password" required autoComplete="current-password" className="input" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-pill bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Kirilmoqda…" : "Kirish"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Hisobingiz yo&apos;qmi?{" "}
        <Link href="/royxatdan-otish" className="font-medium text-primary hover:underline">
          Ro&apos;yxatdan o&apos;tish
        </Link>
      </p>
    </form>
  );
}
