"use client";

import { useState } from "react";

export default function CopyLinkButton({ text, label = "Nusxalash" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard permission denied — nothing sensible to do here
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="shrink-0 rounded-pill border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink-soft hover:border-primary hover:text-primary"
    >
      {copied ? "Nusxalandi ✓" : label}
    </button>
  );
}
