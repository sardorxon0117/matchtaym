"use client";

import { useState } from "react";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const telegramHref = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={telegramHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary"
      >
        Telegram
      </a>
      <a
        href="https://instagram.com/matchtaym"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary"
      >
        Instagram
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1.5 rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary"
      >
        {copied ? "Nusxalandi ✓" : "Havolani nusxalash"}
      </button>
    </div>
  );
}
