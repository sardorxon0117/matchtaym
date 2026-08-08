import Image from "next/image";
import type { Banner } from "@/generated/prisma/client";

export function MobileAdBanner({ banner }: { banner: Banner | null }) {
  if (!banner) return null;
  return (
    <a
      href={banner.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="relative block h-16 w-full overflow-hidden border-b border-ink/10 md:hidden"
    >
      <Image src={banner.imageUrl} alt="Reklama" fill className="object-cover" sizes="100vw" />
      <span className="absolute bottom-1 right-2 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-white">
        Reklama
      </span>
    </a>
  );
}

export function DesktopAdBanner({ banner }: { banner: Banner | null }) {
  if (!banner) return null;
  return (
    <a
      href={banner.linkUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="relative hidden h-[600px] w-full overflow-hidden rounded-card border border-ink/10 md:block"
    >
      <Image src={banner.imageUrl} alt="Reklama" fill className="object-cover" sizes="300px" />
      <span className="absolute bottom-2 right-2 rounded bg-ink/60 px-1.5 py-0.5 text-[10px] text-white">
        Reklama
      </span>
    </a>
  );
}
