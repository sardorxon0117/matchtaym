"use client";

import Image from "next/image";
import type { Banner } from "@/generated/prisma/client";
import { useRotatingIndex } from "@/lib/useRotatingIndex";
import { isVideoUrl } from "@/lib/media";

const ROTATE_MS = 5 * 60 * 1000;

export default function MobileAdBanner({ banners }: { banners: Banner[] }) {
  const index = useRotatingIndex(banners.length, ROTATE_MS);
  if (banners.length === 0) return null;
  const banner = banners[index];
  const video = isVideoUrl(banner.mobileImageUrl);

  return (
    <a
      key={banner.id}
      href={banner.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      // Fixed 5:1 slot regardless of image or video — content fits inside via
      // "contain" (never cropped), so the advertiser's whole creative stays visible.
      className="ad-fade relative block aspect-[5/1] w-full overflow-hidden border-b border-ink/10 bg-ink/5 md:hidden"
    >
      {video ? (
        <video
          src={banner.mobileImageUrl}
          className="h-full w-full object-contain"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <Image src={banner.mobileImageUrl} alt="Reklama" fill className="object-contain" sizes="100vw" />
      )}
      <span className="absolute bottom-1 right-2 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-white">
        Reklama
      </span>
    </a>
  );
}
