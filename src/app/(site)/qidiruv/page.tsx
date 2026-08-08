import type { Metadata } from "next";
import { searchArticles } from "@/lib/queries";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import SearchBox from "@/components/SearchBox";

export const metadata: Metadata = { title: "Qidiruv" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").trim();
  const page = Math.max(1, Number(sp.page) || 1);

  const result = q ? await searchArticles(q, page) : { items: [], total: 0, pageSize: 9 };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink sm:text-3xl">Qidiruv</h1>

      <div className="mb-8">
        <SearchBox initialQuery={q} />
      </div>

      {q ? (
        <>
          <p className="mb-4 text-sm text-ink-soft">
            &quot;{q}&quot; bo&apos;yicha {result.total} ta natija topildi
          </p>
          {result.items.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {result.items.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <p className="py-16 text-center text-ink-soft">Hech narsa topilmadi. Boshqa so&apos;z bilan urinib ko&apos;ring.</p>
          )}
          <Pagination page={page} total={result.total} pageSize={result.pageSize} basePath="/qidiruv" query={{ q }} />
        </>
      ) : (
        <p className="py-16 text-center text-ink-soft">Qidiruv uchun kalit so&apos;z kiriting.</p>
      )}
    </div>
  );
}
