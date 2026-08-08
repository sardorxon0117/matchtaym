"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/actions/auth";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(adminLoginAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-cream/80">Email</label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-primary"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-cream/80">Parol</label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-cream outline-none focus:border-primary"
        />
      </div>

      {error && <p className="text-sm text-accent">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-pill bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
      >
        {pending ? "Kirilmoqda…" : "Kirish"}
      </button>
    </form>
  );
}
