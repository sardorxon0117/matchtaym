import type { Metadata } from "next";
import { getFeed } from "@/lib/queries";
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
  const { items, total, pageSize } = await getFeed(page);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-ink-soft">
          Hozircha maqolalar yo&apos;q. Tez orada yangiliklar bilan qaytamiz!
        </p>
      )}

      <Pagination page={page} total={total} pageSize={pageSize} basePath="/" />
    </div>
  );
}
