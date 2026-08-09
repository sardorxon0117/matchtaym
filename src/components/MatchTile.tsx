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
    <div className="rounded-card border border-ink/10 bg-white p-4">
      <p className="mb-3 text-center text-xs font-medium text-ink-soft/60">
        {formatMatchDate(match.dateCount)} · {formatMatchClock(match.dateCount)}
      </p>

      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line @next/next/no-img-element -- small external team badges */}
        <img src={match.team1image} alt="" className="h-8 w-8 shrink-0 rounded-full bg-ink/5 object-contain" />
        <span className="flex-1 text-sm font-semibold text-ink">{match.team1name}</span>
      </div>

      <div className="my-2 flex justify-center">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_CLASS[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="flex-1 text-right text-sm font-semibold text-ink">{match.team2name}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={match.team2image} alt="" className="h-8 w-8 shrink-0 rounded-full bg-ink/5 object-contain" />
      </div>
    </div>
  );
}
