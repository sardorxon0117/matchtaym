import type { FeedMatch } from "@/lib/match-format";
import { formatMatchTime } from "@/lib/match-format";

export default function MatchRow({ match }: { match: FeedMatch }) {
  return (
    <div className="py-3">
      <p className="mb-1.5 text-xs font-medium text-ink-soft/60">{formatMatchTime(match.dateCount)}</p>
      <div className="flex items-center gap-2 text-sm text-ink">
        {/* eslint-disable-next-line @next/next/no-img-element -- small external team badges, not worth an image-optimization proxy */}
        <img src={match.team1image} alt="" className="h-5 w-5 shrink-0 rounded-full bg-ink/5 object-contain" />
        <span className="font-medium">{match.team1name}</span>
      </div>
      <div className="mt-1 flex items-center gap-2 text-sm text-ink">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={match.team2image} alt="" className="h-5 w-5 shrink-0 rounded-full bg-ink/5 object-contain" />
        <span className="font-medium">{match.team2name}</span>
      </div>
    </div>
  );
}
