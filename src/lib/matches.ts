import "server-only";
import type { FeedMatch } from "./match-format";

export type { FeedMatch } from "./match-format";
export { formatMatchTime } from "./match-format";

const FEED_URL = "https://autofeed.bannersvideo.com/json/uz_new.json";

type FeedResponse = { result?: FeedMatch[] };

/** Upcoming fixtures from the odds feed — team names/logos and kickoff time only (no live scores). */
export async function getFeedMatches(): Promise<FeedMatch[]> {
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

  // The feed repeats the same fixture with different odds snapshots — collapse to one card.
  const seen = new Set<string>();
  const unique: FeedMatch[] = [];
  for (const m of all) {
    const key = `${m.team1name}|${m.team2name}|${m.dateCount}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(m);
  }

  unique.sort((a, b) => a.dateCount.localeCompare(b.dateCount));
  return unique;
}
