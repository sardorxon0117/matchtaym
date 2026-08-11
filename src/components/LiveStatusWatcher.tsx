"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const POLL_MS = 10 * 1000;

/**
 * Renders nothing — just polls whether isLive changed since this page was
 * rendered, and refreshes the page the moment it has, so someone already
 * watching sees the Twitch player appear/disappear within seconds of the
 * admin toggling it, without needing to manually reload.
 */
export default function LiveStatusWatcher({ initialLive }: { initialLive: boolean }) {
  const router = useRouter();

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/live-status", { cache: "no-store" });
        if (!res.ok) return;
        const data: { isLive: boolean } = await res.json();
        if (data.isLive !== initialLive) router.refresh();
      } catch {
        // A missed poll just tries again next tick — not worth surfacing.
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, [initialLive, router]);

  return null;
}
