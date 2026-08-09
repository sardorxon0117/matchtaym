// Client-safe helpers for match data — no "server-only" import here, since
// MatchRow (used inside the client HeroPromoBox) needs this too.

export type FeedMatch = {
  team1image: string;
  team2image: string;
  team1name: string;
  team2name: string;
  date: string; // "DD.MM.YYYY HH:MM"
  dateCount: string; // "DD,MM,YYYY,HH,MM"
};

const MONTHS_SHORT = [
  "yan", "fev", "mar", "apr", "may", "iyun",
  "iyul", "avg", "sen", "okt", "noy", "dek",
];

export function formatMatchTime(dateCount: string): string {
  const [d, mo, , h, mi] = dateCount.split(",");
  const month = MONTHS_SHORT[Number(mo) - 1] ?? mo;
  return `${Number(d)}-${month}, ${h}:${mi}`;
}
