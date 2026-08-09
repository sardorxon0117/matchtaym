"use client";

import Image from "next/image";
import type { Banner } from "@/generated/prisma/client";
import { useRotatingIndex } from "@/lib/useRotatingIndex";

const ROTATE_MS = 5 * 60 * 1000;

export default function MobileAdBanner({ banners }: { banners: Banner[] }) {
  const index = useRotatingIndex(banners.length, ROTATE_MS);
  if (banners.length === 0) return null;
  const banner = banners[index];

  return (
    <a
      key={banner.id}
      href={banner.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="ad-fade relative block h-16 w-full overflow-hidden border-b border-ink/10 md:hidden"
    >
      <Image src={banner.mobileImageUrl} alt="Reklama" fill className="object-cover" sizes="100vw" />
      <span className="absolute bottom-1 right-2 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-white">
        Reklama
      </span>
    </a>
  );
}
