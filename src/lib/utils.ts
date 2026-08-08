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

export const CATEGORY_SEED = [
  { name: "Transferlar", slug: "transferlar" },
  { name: "Milliy terma", slug: "milliy-terma" },
  { name: "Liga yangiliklari", slug: "liga-yangiliklari" },
  { name: "Tahlil", slug: "tahlil" },
];
