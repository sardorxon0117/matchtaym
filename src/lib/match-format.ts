// Client-safe fixture types + formatting — no "server-only" import here,
// since MatchRow/MatchTile (used inside the client HeroPromoBox) need this too.

export type Fixture = {
  id: number;
  timestamp: number; // unix seconds, kickoff time
  statusShort: string; // football-data.org status: "SCHEDULED" | "TIMED" | "IN_PLAY" | "PAUSED" | "FINISHED" | ...
  statusLong: string;
  elapsed: number | null; // this data source doesn't provide a live minute — always null
  leagueId: number;
  leagueName: string;
  leagueLogo: string;
  homeName: string;
  homeLogo: string;
  awayName: string;
  awayLogo: string;
  goalsHome: number | null;
  goalsAway: number | null;
};

const LIVE_STATUSES = new Set(["IN_PLAY", "PAUSED", "EXTRA_TIME", "PENALTY_SHOOTOUT", "SUSPENDED"]);
const FINISHED_STATUSES = new Set(["FINISHED", "AWARDED"]);

export type MatchPhase = "upcoming" | "live" | "finished";

export function getMatchPhase(fixture: Fixture): MatchPhase {
  if (LIVE_STATUSES.has(fixture.statusShort)) return "live";
  if (FINISHED_STATUSES.has(fixture.statusShort)) return "finished";
  return "upcoming"; // SCHEDULED, TIMED, POSTPONED, CANCELLED
}

const STATUS_LABEL_UZ: Record<string, string> = {
  SCHEDULED: "Boshlanmagan",
  TIMED: "Boshlanmagan",
  IN_PLAY: "Jonli",
  PAUSED: "Tanaffus",
  EXTRA_TIME: "Qo'shimcha vaqt",
  PENALTY_SHOOTOUT: "Penaltilar",
  SUSPENDED: "To'xtatilgan",
  FINISHED: "Tugadi",
  AWARDED: "Texnik natija",
  POSTPONED: "Ko'chirildi",
  CANCELLED: "Bekor qilindi",
};

export function statusLabel(fixture: Fixture): string {
  if (getMatchPhase(fixture) === "live" && fixture.elapsed) return `${fixture.elapsed}'`;
  return STATUS_LABEL_UZ[fixture.statusShort] ?? fixture.statusLong;
}

const MONTHS_SHORT = [
  "yan", "fev", "mar", "apr", "may", "iyun",
  "iyul", "avg", "sen", "okt", "noy", "dek",
];

function tashkentParts(timestampSec: number) {
  const d = new Date(timestampSec * 1000);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tashkent",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: Number(get("day")), month: Number(get("month")), hour: get("hour"), minute: get("minute") };
}

export function formatKickoffDate(timestampSec: number): string {
  const { day, month } = tashkentParts(timestampSec);
  return `${day}-${MONTHS_SHORT[month - 1] ?? month}`;
}

export function formatKickoffTime(timestampSec: number): string {
  const { hour, minute } = tashkentParts(timestampSec);
  return `${hour}:${minute}`;
}

/** Picks the `count` fixtures whose kickoff is closest to now — live/soon-to-start first in practice. */
export function pickClosestFixtures(fixtures: Fixture[], count: number, nowSec: number = Date.now() / 1000): Fixture[] {
  return [...fixtures]
    .sort((a, b) => Math.abs(a.timestamp - nowSec) - Math.abs(b.timestamp - nowSec))
    .slice(0, count);
}

/**
 * Picks one fixture per given league (the earliest-kickoff match of that
 * league in the supplied list), in the order the leagues are given — used
 * for the compact promo box, which wants variety (one match each from a
 * fixed set of leagues) rather than just "whatever's closest to now".
 * Leagues with no current fixture are simply skipped.
 */
export function pickOnePerLeague(fixtures: Fixture[], leagueIds: number[]): Fixture[] {
  const picks: Fixture[] = [];
  for (const id of leagueIds) {
    const candidates = fixtures.filter((f) => f.leagueId === id);
    if (candidates.length === 0) continue;
    picks.push(candidates.reduce((a, b) => (a.timestamp <= b.timestamp ? a : b)));
  }
  return picks.sort((a, b) => a.timestamp - b.timestamp);
}
