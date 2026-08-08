"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { logoutAction } from "@/actions/auth";

export type HeaderUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
};

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);

export default function UserMenu({
  user,
  onNavigate,
}: {
  user: HeaderUser | null;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!user) {
    return (
      <Link
        href="/kirish"
        onClick={onNavigate}
        className="rounded-pill bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
      >
        Kirish
      </Link>
    );
  }

  const initial = user.name?.[0]?.toUpperCase() ?? "?";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-ink/10 py-1 pl-1 pr-3 hover:border-primary"
      >
        {user.image ? (
          <Image src={user.image} alt="" width={28} height={28} className="rounded-full" />
        ) : (
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
            {initial}
          </span>
        )}
        <span className="max-w-[8rem] truncate text-sm font-medium text-ink">{user.name}</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-ink/10 bg-white py-1 shadow-lg">
          {STAFF_ROLES.has(user.role) && (
            <Link
              href="/admin"
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-4 py-2 text-sm text-ink-soft hover:bg-cream hover:text-primary"
            >
              Admin panel
            </Link>
          )}
          <form
            action={async () => {
              setOpen(false);
              onNavigate?.();
              await logoutAction();
            }}
          >
            <button type="submit" className="block w-full px-4 py-2 text-left text-sm text-ink-soft hover:bg-cream hover:text-primary">
              Chiqish
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
