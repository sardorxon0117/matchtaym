"use client";

import { useEffect, useRef, useState } from "react";
import type { Banner } from "@/generated/prisma/client";
import TwitchPlayer from "./TwitchPlayer";
import LiveAdBanner from "./LiveAdBanner";

type Stage = "live" | "offline" | "counting" | "started" | "ending";

const POLL_MS = 10 * 1000;

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Owns the whole "video slot": polls whether the admin's toggle changed,
 * and plays a short countdown/ended sequence around the actual switch
 * instead of just silently swapping content, so viewers already on the
 * page notice the transition. No page reload involved — this is entirely
 * client-side state, unlike the earlier LiveStatusWatcher approach.
 */
export default function LiveStage({
  initialLive,
  twitchChannel,
  banners,
  offlineNote,
}: {
  initialLive: boolean;
  twitchChannel: string | null;
  banners: Banner[];
  offlineNote: string;
}) {
  const [stage, setStage] = useState<Stage>(initialLive ? "live" : "offline");
  const [count, setCount] = useState(5);
  const knownLive = useRef(initialLive);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/live-status", { cache: "no-store" });
        if (!res.ok) return;
        const data: { isLive: boolean } = await res.json();
        if (data.isLive === knownLive.current) return;
        knownLive.current = data.isLive;

        if (data.isLive) {
          setStage("counting");
          for (let n = 5; n >= 1; n--) {
            if (!mounted.current) return;
            setCount(n);
            await sleep(1000);
          }
          if (!mounted.current) return;
          setStage("started");
          await sleep(1800);
          if (!mounted.current) return;
          setStage("live");
        } else {
          setStage("ending");
          await sleep(2600);
          if (!mounted.current) return;
          setStage("offline");
        }
      } catch {
        // A missed poll just tries again next tick.
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, []);

  if (stage === "live" && twitchChannel) {
    return (
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
          </span>
          <span className="text-sm font-semibold text-red-600">Jonli efirdamiz</span>
        </div>
        <TwitchPlayer channel={twitchChannel} />
      </div>
    );
  }

  if (stage === "counting" || stage === "started" || stage === "ending") {
    return (
      <div className="mb-8 flex aspect-video w-full flex-col items-center justify-center rounded-card bg-ink text-center">
        {stage === "counting" && (
          <>
            <p className="mb-3 text-sm font-medium uppercase tracking-wide text-cream/60">
              Jonli efir boshlanmoqda
            </p>
            <p key={count} className="count-pop font-heading text-7xl font-bold text-primary">
              {count}
            </p>
          </>
        )}
        {stage === "started" && (
          <p className="count-pop font-heading text-2xl font-bold text-primary sm:text-3xl">
            🔴 Jonli efir boshlandi
          </p>
        )}
        {stage === "ending" && (
          <>
            <p className="font-heading text-xl font-bold text-cream sm:text-2xl">Jonli efir yakunlandi</p>
            <p className="mt-2 text-sm text-cream/70">E&apos;tiboringiz uchun rahmat!</p>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex items-center gap-3 rounded-card border border-ink/10 bg-white px-5 py-4">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-ink/20" />
        <div>
          <p className="font-heading text-sm font-semibold text-ink">Hozircha jonli efir yo&apos;q</p>
          <p className="text-sm text-ink-soft">{offlineNote}</p>
        </div>
      </div>
      <LiveAdBanner banners={banners} />
    </>
  );
}
