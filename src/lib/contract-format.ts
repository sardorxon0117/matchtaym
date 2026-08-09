// Pure, client-safe helpers — no "server-only" here, since ContractDocument
// (rendered on both the admin's and the advertiser's pages) needs these too.

export type BookedRange = { id: string; startAt: Date; endAt: Date; signerName: string | null };

export function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/** The first existing booking that the given [start, end) range collides with, if any. */
export function findConflict(start: Date, end: Date, booked: BookedRange[]): BookedRange | null {
  return booked.find((b) => rangesOverlap(start, end, b.startAt, b.endAt)) ?? null;
}

/** Whole-so'm total — hours can be fractional (e.g. 1.5 soat), rounded to the nearest so'm. */
export function calcTotalAmountUzs(hourlyRateUzs: number, start: Date, end: Date): number {
  const hours = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
  return Math.round(hourlyRateUzs * hours);
}

export function formatUzs(amount: number): string {
  return `${amount.toLocaleString("uz-UZ")} so'm`;
}

export const AD_CONTRACT_STATUS_LABELS: Record<string, string> = {
  PENDING_SIGNATURE: "Kutilmoqda",
  AWAITING_PAYMENT: "Imzolandi — to'lov kutilmoqda",
  PAYMENT_SUBMITTED: "Chek yuklandi — tasdiqlash kerak",
  CONFIRMED: "Tasdiqlandi",
  REJECTED: "Chek rad etildi",
};

export const AD_CONTRACT_STATUS_BADGE: Record<string, string> = {
  PENDING_SIGNATURE: "bg-ink/10 text-ink-soft",
  AWAITING_PAYMENT: "bg-blue-100 text-blue-700",
  PAYMENT_SUBMITTED: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};
