import Link from "next/link";
import { getTodayMatches } from "@/lib/matches";
import MatchRow from "./MatchRow";

export default async function TodayMatchesWidget() {
  const matches = await getTodayMatches();

  return (
    <div className="rounded-card border border-ink/10 bg-white p-4">
      <h3 className="font-heading text-base font-bold text-ink">Bugungi o&apos;yinlar</h3>

      {matches.length > 0 ? (
        <>
          <div className="divide-y divide-ink/5">
            {matches.slice(0, 5).map((m, i) => (
              <MatchRow key={i} match={m} />
            ))}
          </div>
          <Link
            href="/oyinlar"
            className="mt-2 block rounded-pill bg-cream py-2 text-center text-sm font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Barcha o&apos;yinlar →
          </Link>
        </>
      ) : (
        <p className="py-6 text-center text-sm text-ink-soft">Bugun o&apos;yinlar yo&apos;q</p>
      )}
    </div>
  );
}
