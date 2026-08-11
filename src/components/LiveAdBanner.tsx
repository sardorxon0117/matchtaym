"use client";

import Image from "next/image";
import type { Banner } from "@/generated/prisma/client";
import { useRotatingIndex } from "@/lib/useRotatingIndex";
import { isVideoUrl } from "@/lib/media";

const ROTATE_MS = 5 * 60 * 1000;

/**
 * Fills the "video slot" while nothing's live — always the desktop/tablet
 * creative (desktopImageUrl) at a fixed 3:2 ratio on every screen size,
 * unlike the sidebar promo box which switches to a separate mobile creative
 * and ratio on small screens. Uses object-cover (not -contain) so the
 * creative always fills the box edge-to-edge, even if its own aspect ratio
 * isn't an exact 3:2 — no visible letterboxing strip.
 */
export default function LiveAdBanner({ banners }: { banners: Banner[] }) {
  const index = useRotatingIndex(banners.length, ROTATE_MS);
  const activeBanner = banners.length > 0 ? banners[index] : null;

  if (!activeBanner) return null;

  return (
    <a
      href={activeBanner.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      key={activeBanner.id}
      className="ad-fade relative mb-8 block aspect-[3/2] w-full overflow-hidden rounded-card border border-ink/10 bg-ink/5"
    >
      {isVideoUrl(activeBanner.desktopImageUrl) ? (
        <video
          src={activeBanner.desktopImageUrl}
          className="h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <Image src={activeBanner.desktopImageUrl} alt="Reklama" fill className="object-cover" sizes="(max-width: 768px) 100vw, 700px" />
      )}
      <span className="absolute bottom-2 right-2 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-white">Reklama</span>
    </a>
  );
}
