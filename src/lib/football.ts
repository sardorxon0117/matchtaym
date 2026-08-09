import "server-only";
import type { Fixture } from "./match-format";

const API_BASE = "https://api.football-data.org/v4";

// Premier League, La Liga, Serie A, Bundesliga, Ligue 1, UEFA Champions League.
// (Carabao Cup / FA Cup / Conference League / Club World Cup aren't on the
// free football-data.org plan — checked directly against the account.)
const COMPETITIONS = ["PL", "PD", "SA", "BL1", "FL1", "CL"] as const;

type CompetitionInfo = {
  currentSeason: { endDate: string; currentMatchday: number | null } | null;
};

type RawMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  competition: { id: number; name: string; emblem: string | null };
  homeTeam: { name: string; crest: string | null };
  awayTeam: { name: string; crest: string | null };
  score: { fullTime: { home: number | null; away: number | null } };
};

type MatchesResponse = { matches?: RawMatch[] };

function authHeaders(): HeadersInit {
  return { "X-Auth-Token": process.env.FOOTBALL_API_KEY ?? "" };
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
 * Which matchday is "current" for a competition — changes roughly once a
 * week, so this is cached far longer than the fixtures themselves. Before a
 * season starts, the API already reports matchday 1 here, which is exactly
 * the "show the opening round" behaviour we want with zero special-casing.
 */
async function getCurrentMatchday(code: string): Promise<number | null> {
  try {
    const res = await fetch(`${API_BASE}/competitions/${code}`, {
      headers: authHeaders(),
      next: { revalidate: 6 * 3600 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data: CompetitionInfo = await res.json();
    const season = data.currentSeason;
    if (!season || !season.currentMatchday) return null;
    // A season whose end date has already passed means the API hasn't
    // rolled over to the next one yet (common for cup competitions between
    // editions) — skip it rather than showing last season's stale round.
    if (new Date(season.endDate).getTime() < Date.now()) return null;
    return season.currentMatchday;
  } catch (err) {
    console.error(`football-data.org matchday lookup failed for ${code}:`, err);
    return null;
  }
}

async function getMatchdayFixtures(code: string, matchday: number): Promise<Fixture[]> {
  try {
    const res = await fetch(`${API_BASE}/competitions/${code}/matches?matchday=${matchday}`, {
      headers: authHeaders(),
      next: { revalidate: 900 }, // 15 min — fresh enough for status/score changes
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const data: MatchesResponse = await res.json();
    return (data.matches ?? []).map(mapMatch);
  } catch (err) {
    console.error(`football-data.org fixtures fetch failed for ${code}:`, err);
    return [];
  }
}

/** Current-round fixtures across the top-5 leagues + Champions League. */
export async function getTop5Fixtures(): Promise<Fixture[]> {
  if (!process.env.FOOTBALL_API_KEY) return [];

  const results = await Promise.allSettled(
    COMPETITIONS.map(async (code) => {
      const matchday = await getCurrentMatchday(code);
      if (matchday === null) return [];
      return getMatchdayFixtures(code, matchday);
    })
  );

  const fixtures = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));
  return fixtures.sort((a, b) => a.timestamp - b.timestamp);
}
