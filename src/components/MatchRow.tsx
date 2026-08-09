import type { Fixture } from "@/lib/match-format";
import { formatKickoffDate, formatKickoffTime, getMatchPhase, statusLabel } from "@/lib/match-format";

export default function MatchRow({ match }: { match: Fixture }) {
  const phase = getMatchPhase(match);
  const started = phase !== "upcoming";

  return (
    <div className="py-3.5">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft/60">
          {match.leagueLogo && (
            // eslint-disable-next-line @next/next/no-img-element -- small external competition badge
            <img src={match.leagueLogo} alt="" className="h-3.5 w-3.5 shrink-0 object-contain" />
          )}
          {formatKickoffDate(match.timestamp)}, {formatKickoffTime(match.timestamp)}
        </span>
        <span className={`text-xs font-semibold ${phase === "live" ? "text-green-600" : "text-ink-soft/60"}`}>
          {statusLabel(match)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2 text-sm text-ink">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element -- small external team badges, not worth an image-optimization proxy */}
          <img src={match.homeLogo} alt="" className="h-6 w-6 shrink-0 rounded-full bg-ink/5 object-contain" />
          <span className="truncate font-medium">{match.homeName}</span>
        </div>
        {started && <span className="shrink-0 font-bold">{match.goalsHome}</span>}
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 text-sm text-ink">
        <div className="flex min-w-0 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={match.awayLogo} alt="" className="h-6 w-6 shrink-0 rounded-full bg-ink/5 object-contain" />
          <span className="truncate font-medium">{match.awayName}</span>
        </div>
        {started && <span className="shrink-0 font-bold">{match.goalsAway}</span>}
      </div>
    </div>
  );
}
