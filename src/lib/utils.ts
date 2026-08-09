import slugify from "slugify";

export function toSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, trim: true });
}

export function calcReadTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const MONTHS_UZ = [
  "yanvar",
  "fevral",
  "mart",
  "aprel",
  "may",
  "iyun",
  "iyul",
  "avgust",
  "sentabr",
  "oktabr",
  "noyabr",
  "dekabr",
];

export function formatDateUz(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return `${d.getDate()} ${MONTHS_UZ[d.getMonth()]}, ${d.getFullYear()}`;
}

/** Date + time (Toshkent), for admin displays where the exact minute matters. */
export function formatDateTimeUz(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${Number(get("day"))} ${MONTHS_UZ[Number(get("month")) - 1]}, ${get("hour")}:${get("minute")}`;
}

export function formatRelativeUz(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "hozirgina";
  if (diffMin < 60) return `${diffMin} daqiqa oldin`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} soat oldin`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} kun oldin`;
  return formatDateUz(d);
}

/**
 * Converts a `datetime-local` input value ("YYYY-MM-DDTHH:mm"), entered by
 * the admin as Tashkent wall-clock time, into the correct UTC instant.
 * Tashkent is a fixed UTC+5 with no DST, so a plain offset subtraction is
 * exact — this avoids the server (which runs in UTC on Vercel) silently
 * misinterpreting the string as its own local time.
 */
export function tashkentInputToUtcDate(value: string): Date {
  const [datePart, timePart] = value.split("T");
  const [y, mo, d] = datePart.split("-").map(Number);
  const [h, mi] = (timePart ?? "00:00").split(":").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h - 5, mi));
}

/** Inverse of `tashkentInputToUtcDate` — formats a UTC Date back into Tashkent wall-clock for form inputs. */
export function dateToTashkentInputValue(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tashkent",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export const CATEGORY_SEED = [
  { name: "Transferlar", slug: "transferlar" },
  { name: "Milliy terma", slug: "milliy-terma" },
  { name: "Tahlil", slug: "tahlil" },
];
