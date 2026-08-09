import type { Fixture } from "@/lib/match-format";
import { formatKickoffDate, formatKickoffTime, getMatchPhase, statusLabel } from "@/lib/match-format";

export default function MatchTile({ match }: { match: Fixture }) {
  const phase = getMatchPhase(match);
  const started = phase !== "upcoming";

  return (
    <div className="flex items-center gap-3 rounded-card border border-ink/10 bg-white p-4">
      <div className="w-14 shrink-0 text-center">
        <p className="text-xs font-semibold text-ink">{formatKickoffDate(match.timestamp)}</p>
        <p className="text-xs text-ink-soft">{formatKickoffTime(match.timestamp)}</p>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span className="truncate text-sm font-medium text-ink">{match.homeName}</span>
        {/* eslint-disable-next-line @next/next/no-img-element -- small external team badges */}
        <img src={match.homeLogo} alt="" className="h-7 w-7 shrink-0 rounded-full bg-ink/5 object-contain" />
      </div>

      <div className="flex w-16 shrink-0 flex-col items-center gap-0.5">
        {started ? (
          <>
            <span className="text-base font-bold text-ink">
              {match.goalsHome} – {match.goalsAway}
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
        <span className="truncate text-sm font-medium text-ink">{match.awayName}</span>
      </div>
    </div>
  );
}
