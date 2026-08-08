import type { Metadata } from "next";
import { getHeroAndFeed } from "@/lib/queries";
import HeroCard from "@/components/HeroCard";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Bosh sahifa",
};

export const revalidate = 60;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const { hero, items, total, pageSize } = await getHeroAndFeed(page);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {hero && (
        <div className="mb-10">
          <HeroCard article={hero} />
        </div>
      )}

      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        !hero && (
          <p className="py-16 text-center text-ink-soft">
            Hozircha maqolalar yo&apos;q. Tez orada yangiliklar bilan qaytamiz!
          </p>
        )
      )}

      <Pagination page={page} total={total} pageSize={pageSize} basePath="/" />
    </div>
  );
}
