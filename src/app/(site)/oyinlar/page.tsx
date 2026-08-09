import type { Metadata } from "next";
import { getTodayMatches } from "@/lib/matches";
import MatchRow from "@/components/MatchRow";

export const metadata: Metadata = { title: "Bugungi o'yinlar" };
export const revalidate = 300;

export default async function MatchesPage() {
  const matches = await getTodayMatches();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink sm:text-3xl">Bugungi o&apos;yinlar</h1>
      <p className="mb-6 text-ink-soft">Bugun bo&apos;lib o&apos;tadigan futbol o&apos;yinlari</p>

      {matches.length > 0 ? (
        <div className="divide-y divide-ink/5 rounded-card border border-ink/10 bg-white px-4">
          {matches.map((m, i) => (
            <MatchRow key={i} match={m} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-ink-soft">Bugun o&apos;yinlar yo&apos;q. Keyinroq qayta tekshiring.</p>
      )}
    </div>
  );
}
