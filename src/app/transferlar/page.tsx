import type { Metadata } from "next";
import { getTransfers } from "@/lib/queries";
import TransferTable from "@/components/TransferTable";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = { title: "Transferlar" };
export const revalidate = 60;

export default async function TransfersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; club?: string; league?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const { items, total, pageSize, leagues } = await getTransfers({
    club: sp.club,
    league: sp.league,
    page,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink sm:text-3xl">Transferlar</h1>
      <p className="mb-6 text-ink-soft">Futbolchilarning klublar orasidagi ko&apos;chishlari</p>

      <form className="mb-6 flex flex-wrap gap-3" action="/transferlar">
        <input
          type="text"
          name="club"
          defaultValue={sp.club}
          placeholder="Klub nomi bo'yicha qidirish"
          className="input max-w-xs"
        />
        <select name="league" defaultValue={sp.league ?? ""} className="input max-w-xs">
          <option value="">Barcha ligalar</option>
          {leagues.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <button type="submit" className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          Filtrlash
        </button>
      </form>

      <TransferTable transfers={items} />
      <Pagination
        page={page}
        total={total}
        pageSize={pageSize}
        basePath="/transferlar"
        query={{ club: sp.club, league: sp.league }}
      />
    </div>
  );
}
