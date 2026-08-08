import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory } from "@/lib/queries";
import ArticleCard from "@/components/ArticleCard";
import CategoryPills from "@/components/CategoryPills";
import Pagination from "@/components/Pagination";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getArticlesByCategory(slug, 1);
  return { title: category?.name ?? "Kategoriya" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { items, total, pageSize, category } = await getArticlesByCategory(slug, page);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <CategoryPills activeSlug={slug} />
      </div>

      <h1 className="mb-6 font-heading text-2xl font-bold text-ink sm:text-3xl">{category.name}</h1>

      {items.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-ink-soft">Bu kategoriyada hozircha maqolalar yo&apos;q.</p>
      )}

      <Pagination page={page} total={total} pageSize={pageSize} basePath={`/kategoriya/${slug}`} />
    </div>
  );
}
