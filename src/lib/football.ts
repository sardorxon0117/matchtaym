import "server-only";
import type { Fixture } from "./match-format";

const API_BASE = "https://api.football-data.org/v4";

// Premier League, La Liga (Primera Division), Serie A, Bundesliga, Ligue 1.
const TOP5_COMPETITIONS = "PL,PD,SA,BL1,FL1";

type RawMatch = {
  id: number;
  utcDate: string;
  status: string;
  competition: { id: number; name: string; emblem: string | null };
  homeTeam: { name: string; crest: string | null };
  awayTeam: { name: string; crest: string | null };
  score: { fullTime: { home: number | null; away: number | null } };
};

type MatchesResponse = { matches?: RawMatch[] };

function tashkentDateStr(date: Date): string {
  // en-CA formats as YYYY-MM-DD, which is exactly what the API expects.
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(date);
}

function mapMatch(m: RawMatch): Fixture {
  return {
    id: m.id,
    timestamp: Math.floor(new Date(m.utcDate).getTime() / 1000),
    statusShort: m.status,
    statusLong: m.status,
    elapsed: null, // this API doesn't expose a live "minute" field
    leagueId: m.competition.id,
    leagueName: m.competition.name,
    leagueLogo: m.competition.emblem ?? "",
    homeName: m.homeTeam.name,
    homeLogo: m.homeTeam.crest ?? "",
    awayName: m.awayTeam.name,
    awayLogo: m.awayTeam.crest ?? "",
    goalsHome: m.score.fullTime.home,
    goalsAway: m.score.fullTime.away,
  };
}

/**
 * Top-5-league fixtures from roughly yesterday through the next week
 * (Tashkent dates), in one request — cached for 30 min. The free
 * football-data.org plan allows 10 requests/minute, so this is comfortably
 * within budget even without caching, but there's no reason to hammer it.
 */
export async function getTop5Fixtures(): Promise<Fixture[]> {
  const token = process.env.FOOTBALL_API_KEY;
  if (!token) return [];

  // The free plan caps the range at 10 days — bias it forward (today..+9)
  // rather than including yesterday, since upcoming fixtures matter more
  // here than recently-finished ones.
  const now = new Date();
  const dateFrom = tashkentDateStr(now);
  const dateTo = tashkentDateStr(new Date(now.getTime() + 9 * 86400000));

  try {
    const res = await fetch(
      `${API_BASE}/matches?competitions=${TOP5_COMPETITIONS}&dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: { "X-Auth-Token": token },
        next: { revalidate: 1800 },
        signal: AbortSignal.timeout(6000),
      }
    );
    if (!res.ok) return [];
    const data: MatchesResponse = await res.json();
    return (data.matches ?? []).map(mapMatch).sort((a, b) => a.timestamp - b.timestamp);
  } catch (err) {
    console.error("football-data.org fetch failed:", err);
    return [];
  }
}
