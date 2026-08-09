import "server-only";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import type { BookedRange } from "@/lib/contract-format";

export type { BookedRange };
export { rangesOverlap, findConflict, calcTotalAmountUzs, formatUzs } from "@/lib/contract-format";

/** Every currently-reserved ad slot, optionally excluding one contract (for re-checking its own edit). */
export async function getBookedRanges(excludeId?: string): Promise<BookedRange[]> {
  return prisma.adContract.findMany({
    where: {
      startAt: { not: null },
      endAt: { not: null },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true, startAt: true, endAt: true, signerName: true },
    orderBy: { startAt: "asc" },
  }) as Promise<BookedRange[]>;
}

/** Best-effort real client IP behind Vercel's proxy — falls back gracefully if absent. */
export async function getClientIp(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip");
}
