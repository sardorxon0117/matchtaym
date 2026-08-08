import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByCategory, getTransfers } from "@/lib/queries";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import TransferTable from "@/components/TransferTable";
import TransferFilters from "@/components/TransferFilters";
import { CATEGORY_SEED } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "transferlar") return { title: "Transferlar" };
  const { category } = await getArticlesByCategory(slug, 1);
  return { title: category?.name ?? "Kategoriya" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; club?: string; league?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  // "Transferlar" is both a news category and the dedicated transfer-deals
  // table — merged into one page so the nav only links here once.
  if (slug === "transferlar") {
    const { items, total, pageSize, leagues } = await getTransfers({
      club: sp.club,
      league: sp.league,
      page,
    });

    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-2 font-heading text-2xl font-bold text-ink sm:text-3xl">Transferlar</h1>
        <p className="mb-6 text-ink-soft">Futbolchilarning klublar orasidagi ko&apos;chishlari</p>

        <TransferFilters initialClub={sp.club ?? ""} initialLeague={sp.league ?? ""} leagues={leagues} />

        <TransferTable transfers={items} />
        <Pagination
          page={page}
          total={total}
          pageSize={pageSize}
          basePath="/kategoriya/transferlar"
          query={{ club: sp.club, league: sp.league }}
        />
      </div>
    );
  }

  if (!CATEGORY_SEED.some((c) => c.slug === slug)) notFound();

  const { items, total, pageSize, category } = await getArticlesByCategory(slug, page);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
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
