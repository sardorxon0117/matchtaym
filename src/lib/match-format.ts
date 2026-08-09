// Client-safe helpers for match data — no "server-only" import here, since
// MatchRow/MatchTile (used inside the client HeroPromoBox) need this too.

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

export function formatMatchDate(dateCount: string): string {
  const [d, mo] = dateCount.split(",");
  const month = MONTHS_SHORT[Number(mo) - 1] ?? mo;
  return `${Number(d)}-${month}`;
}

export function formatMatchClock(dateCount: string): string {
  const parts = dateCount.split(",");
  return `${parts[3]}:${parts[4]}`;
}

/** The feed's dates read as Tashkent wall-clock time (fixed UTC+5, no DST). */
export function parseFeedDate(dateCount: string): Date {
  const [d, mo, y, h, mi] = dateCount.split(",").map(Number);
  return new Date(Date.UTC(y, mo - 1, d, h - 5, mi));
}

export type MatchStatus = "upcoming" | "live" | "finished";

// Heuristic — the feed has no live score/whistle event, so "live" is just
// "kickoff was recent enough that the match is probably still on".
const ASSUMED_MATCH_DURATION_MS = 2 * 60 * 60 * 1000;

export function getMatchStatus(dateCount: string, now: number = Date.now()): MatchStatus {
  const kickoff = parseFeedDate(dateCount).getTime();
  if (now < kickoff) return "upcoming";
  if (now < kickoff + ASSUMED_MATCH_DURATION_MS) return "live";
  return "finished";
}

/**
 * Picks the `count` matches whose kickoff is closest to now — regardless of
 * whether they've already finished, are in progress, or haven't started.
 */
export function pickClosestMatches(matches: FeedMatch[], count: number, now: number = Date.now()): FeedMatch[] {
  return [...matches]
    .sort(
      (a, b) =>
        Math.abs(parseFeedDate(a.dateCount).getTime() - now) - Math.abs(parseFeedDate(b.dateCount).getTime() - now)
    )
    .slice(0, count);
}
