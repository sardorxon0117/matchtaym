"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { CATEGORY_SEED } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Bosh sahifa" },
  { href: "/transferlar", label: "Transferlar" },
  ...CATEGORY_SEED.slice(1).map((c) => ({
    href: `/kategoriya/${c.slug}`,
    label: c.name,
  })),
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/qidiruv"
            aria-label="Qidiruv"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:border-primary hover:text-primary"
          >
            <SearchIcon />
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menyu"
          aria-expanded={open}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-black/5 bg-cream md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-white hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/qidiruv"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-white hover:text-primary"
            >
              Qidiruv
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="6" y1="18" x2="18" y2="6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
