"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Banner } from "@/generated/prisma/client";
import type { FeedMatch } from "@/lib/match-format";
import { useRotatingIndex } from "@/lib/useRotatingIndex";
import MatchRow from "./MatchRow";

const ROTATE_MS = 5 * 60 * 1000;

export default function HeroPromoBox({ matches, banners }: { matches: FeedMatch[]; banners: Banner[] }) {
  const router = useRouter();
  const index = useRotatingIndex(banners.length, ROTATE_MS);
  const activeBanner = banners.length > 0 ? banners[index] : null;

  function handleBoxClick() {
    if (activeBanner) window.open(activeBanner.linkUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div
      onClick={activeBanner ? handleBoxClick : undefined}
      role={activeBanner ? "link" : undefined}
      tabIndex={activeBanner ? 0 : undefined}
      onKeyDown={
        activeBanner
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") handleBoxClick();
            }
          : undefined
      }
      className={`overflow-hidden rounded-card border border-ink/10 bg-white ${activeBanner ? "cursor-pointer" : ""}`}
    >
      {activeBanner && (
        <div key={activeBanner.id} className="ad-fade relative h-56 w-full">
          <Image src={activeBanner.desktopImageUrl} alt="Reklama" fill className="object-cover" sizes="340px" />
          <span className="absolute bottom-2 right-2 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-white">
            Reklama
          </span>
        </div>
      )}

      <div className={`p-5 ${activeBanner ? "border-t border-ink/5" : ""}`}>
        <h3 className="mb-2 font-heading text-lg font-bold text-ink">O&apos;yinlar</h3>

        {matches.length > 0 ? (
          <div className="divide-y divide-ink/5">
            {matches.map((m, i) => (
              <MatchRow key={i} match={m} />
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm text-ink-soft">Hozircha o&apos;yinlar yo&apos;q</p>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            router.push("/oyinlar");
          }}
          className="mt-3 block w-full rounded-pill bg-cream py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
        >
          Boshqa o&apos;yinlar →
        </button>
      </div>
    </div>
  );
}
