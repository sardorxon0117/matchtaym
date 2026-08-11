import type { Metadata } from "next";
import { getTop5Fixtures } from "@/lib/football";
import MatchTile from "@/components/MatchTile";
import MatchRow from "@/components/MatchRow";

export const metadata: Metadata = { title: "O'yinlar" };
export const revalidate = 1800;

export default async function MatchesPage() {
  const matches = await getTop5Fixtures();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink sm:text-3xl">O&apos;yinlar</h1>
      <p className="mb-6 text-ink-soft">
        Angliya, Ispaniya, Italiya, Germaniya va Fransiyaning eng kuchli ligalaridagi o&apos;yinlar
      </p>

      {matches.length > 0 ? (
        <div className="flex flex-col gap-4">
          {matches.map((m) => (
            <div key={m.id}>
              {/* MatchTile's horizontal layout (date | team | score | team) gets too
                  cramped on narrow phones — team names/logos were getting squeezed
                  out. Below sm, use the same stacked layout as the promo box instead. */}
              <div className="rounded-card border border-ink/10 bg-white px-4 sm:hidden">
                <MatchRow match={m} />
              </div>
              <div className="hidden sm:block">
                <MatchTile match={m} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-ink-soft">Hozircha o&apos;yinlar yo&apos;q. Keyinroq qayta tekshiring.</p>
      )}
    </div>
  );
}
