import type { FeedMatch } from "@/lib/match-format";
import { formatMatchDate, formatMatchClock, getMatchStatus } from "@/lib/match-format";

const STATUS_LABEL: Record<string, string> = {
  upcoming: "Boshlanmagan",
  live: "O'ynalmoqda",
  finished: "Tugadi",
};

const STATUS_CLASS: Record<string, string> = {
  upcoming: "bg-amber-100 text-amber-700",
  live: "bg-green-100 text-green-700",
  finished: "bg-ink/10 text-ink-soft",
};

export default function MatchTile({ match }: { match: FeedMatch }) {
  const status = getMatchStatus(match.dateCount);

  return (
    <div className="flex items-center gap-3 rounded-card border border-ink/10 bg-white p-4">
      <div className="w-14 shrink-0 text-center">
        <p className="text-xs font-semibold text-ink">{formatMatchDate(match.dateCount)}</p>
        <p className="text-xs text-ink-soft">{formatMatchClock(match.dateCount)}</p>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
        <span className="truncate text-sm font-medium text-ink">{match.team1name}</span>
        {/* eslint-disable-next-line @next/next/no-img-element -- small external team badges */}
        <img src={match.team1image} alt="" className="h-7 w-7 shrink-0 rounded-full bg-ink/5 object-contain" />
      </div>

      <span className={`shrink-0 rounded-full px-2.5 py-1 text-center text-[11px] font-semibold ${STATUS_CLASS[status]}`}>
        {STATUS_LABEL[status]}
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={match.team2image} alt="" className="h-7 w-7 shrink-0 rounded-full bg-ink/5 object-contain" />
        <span className="truncate text-sm font-medium text-ink">{match.team2name}</span>
      </div>
    </div>
  );
}
