import "server-only";

const FEED_URL = "https://autofeed.bannersvideo.com/json/uz_new.json";

export type FeedMatch = {
  team1image: string;
  team2image: string;
  team1name: string;
  team2name: string;
  date: string; // "DD.MM.YYYY HH:MM"
  dateCount: string; // "DD,MM,YYYY,HH,MM"
};

type FeedResponse = { result?: FeedMatch[] };

function todayInTashkent(): { day: number; month: number; year: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(new Date());

  return {
    day: Number(parts.find((p) => p.type === "day")?.value),
    month: Number(parts.find((p) => p.type === "month")?.value),
    year: Number(parts.find((p) => p.type === "year")?.value),
  };
}

/** Today's fixtures from the odds feed — team names/logos and kickoff time only (no live scores). */
export async function getTodayMatches(): Promise<FeedMatch[]> {
  let data: FeedResponse;
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    data = await res.json();
  } catch (err) {
    console.error("Matches feed fetch failed:", err);
    return [];
  }

  const all = data.result ?? [];
  const { day, month, year } = todayInTashkent();

  const todays = all.filter((m) => {
    const [d, mo, y] = m.dateCount.split(",").map(Number);
    return d === day && mo === month && y === year;
  });

  // The feed repeats the same fixture with different odds snapshots — collapse to one card.
  const seen = new Set<string>();
  const unique: FeedMatch[] = [];
  for (const m of todays) {
    const key = `${m.team1name}|${m.team2name}|${m.dateCount}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(m);
  }

  unique.sort((a, b) => a.dateCount.localeCompare(b.dateCount));
  return unique;
}

const MONTHS_SHORT = [
  "yan", "fev", "mar", "apr", "may", "iyun",
  "iyul", "avg", "sen", "okt", "noy", "dek",
];

export function formatMatchTime(dateCount: string): string {
  const [d, mo, , h, mi] = dateCount.split(",");
  const month = MONTHS_SHORT[Number(mo) - 1] ?? mo;
  return `${Number(d)}-${month}, ${h}:${mi}`;
}
