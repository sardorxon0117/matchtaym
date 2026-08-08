"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/actions/auth";

export default function RegisterForm() {
  const [error, formAction, pending] = useActionState(registerAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Ism</label>
        <input type="text" name="name" required autoComplete="name" className="input" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
        <input type="email" name="email" required autoComplete="email" className="input" />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Parol</label>
        <input type="password" name="password" required autoComplete="new-password" minLength={6} className="input" />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-pill bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Yaratilmoqda…" : "Ro'yxatdan o'tish"}
      </button>

      <p className="text-center text-sm text-ink-soft">
        Hisobingiz bormi?{" "}
        <Link href="/kirish" className="font-medium text-primary hover:underline">
          Kirish
        </Link>
      </p>
    </form>
  );
}
