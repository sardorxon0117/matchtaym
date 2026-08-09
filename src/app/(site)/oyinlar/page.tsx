import type { Metadata } from "next";
import { getFeedMatches } from "@/lib/matches";
import MatchTile from "@/components/MatchTile";

export const metadata: Metadata = { title: "O'yinlar" };
export const revalidate = 300;

export default async function MatchesPage() {
  const matches = await getFeedMatches();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink sm:text-3xl">O&apos;yinlar</h1>
      <p className="mb-6 text-ink-soft">Barcha futbol o&apos;yinlari, tartib bilan</p>

      {matches.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m, i) => (
            <MatchTile key={i} match={m} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-ink-soft">Hozircha o&apos;yinlar yo&apos;q. Keyinroq qayta tekshiring.</p>
      )}
    </div>
  );
}
