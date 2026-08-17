import type { Fixture } from "@/lib/match-format";
import { formatKickoffDate, formatKickoffTime, getMatchPhase, statusLabel } from "@/lib/match-format";

export default function MatchTile({ match }: { match: Fixture }) {
  const phase = getMatchPhase(match);
  const started = phase !== "upcoming";
  // Highlight the winning side once the match is over — draws stay neutral.
  const winner =
    phase === "finished" && match.goalsHome !== match.goalsAway
      ? match.goalsHome! > match.goalsAway!
        ? "home"
        : "away"
      : null;

  return (
    <div className="rounded-card border border-ink/10 bg-white p-4">
      <div className="mb-3 flex items-center gap-1.5 border-b border-ink/5 pb-2.5">
        {match.leagueLogo && (
          // eslint-disable-next-line @next/next/no-img-element -- small external competition badge
          <img src={match.leagueLogo} alt="" className="h-4 w-4 shrink-0 object-contain" />
        )}
        <span className="truncate text-xs font-semibold text-ink-soft">{match.leagueName}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-14 shrink-0 text-center">
          <p className="text-xs font-semibold text-ink">{formatKickoffDate(match.timestamp)}</p>
          <p className="text-xs text-ink-soft">{formatKickoffTime(match.timestamp)}</p>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
          <span className={`truncate text-sm font-medium ${winner === "home" ? "text-primary" : "text-ink"}`}>
            {match.homeName}
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element -- small external team badge */}
          <img src={match.homeLogo} alt="" className="h-7 w-7 shrink-0 rounded-full bg-ink/5 object-contain" />
        </div>

        <div className="flex w-16 shrink-0 flex-col items-center gap-0.5">
          {started ? (
            <>
              <span className="text-base font-bold">
                <span className={winner === "home" ? "text-primary" : "text-ink"}>{match.goalsHome}</span>
                <span className="text-ink"> – </span>
                <span className={winner === "away" ? "text-primary" : "text-ink"}>{match.goalsAway}</span>
              </span>
              <span className={`text-[10px] font-semibold ${phase === "live" ? "text-green-600" : "text-ink-soft/60"}`}>
                {statusLabel(match)}
              </span>
            </>
          ) : (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-center text-[11px] font-semibold text-amber-700">
              {statusLabel(match)}
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={match.awayLogo} alt="" className="h-7 w-7 shrink-0 rounded-full bg-ink/5 object-contain" />
          <span className={`truncate text-sm font-medium ${winner === "away" ? "text-primary" : "text-ink"}`}>
            {match.awayName}
          </span>
        </div>
      </div>
    </div>
  );
}
