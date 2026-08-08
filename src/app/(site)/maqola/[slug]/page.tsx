import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles, incrementViews } from "@/lib/queries";
import { renderMarkdown } from "@/lib/markdown";
import { formatDateUz } from "@/lib/utils";
import ArticleCard from "@/components/ArticleCard";
import ShareButtons from "@/components/ShareButtons";
import CommentSection from "@/components/CommentSection";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://matchtaym.sardorkhon.me";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || article.status !== "PUBLISHED") return { title: "Maqola topilmadi" };

  const title = article.metaTitle || article.title;
  const description = article.metaDesc || article.excerpt || undefined;

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/maqola/${article.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      images: article.coverImage ? [{ url: article.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.coverImage ? [article.coverImage] : undefined,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== "PUBLISHED") notFound();

  incrementViews(article.id).catch(() => {});
  const related = await getRelatedArticles(article.categoryId, article.id);
  const html = renderMarkdown(article.content);
  const url = `${siteUrl}/maqola/${article.slug}`;

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {article.category && (
        <Link
          href={`/kategoriya/${article.category.slug}`}
          className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
        >
          {article.category.name}
        </Link>
      )}

      <h1 className="mb-4 font-heading text-2xl font-bold leading-tight text-ink sm:text-3xl md:text-4xl">
        {article.title}
      </h1>

      <div className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
        <span>{article.author.name}</span>
        <span>•</span>
        <span>{article.publishedAt ? formatDateUz(article.publishedAt) : ""}</span>
        <span>•</span>
        <span>{article.readTimeMin} daqiqa o&apos;qish</span>
        <span>•</span>
        <span>{article.views + 1} ko&apos;rish</span>
      </div>

      {article.coverImage && (
        <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-card">
          <Image src={article.coverImage} alt={article.title} fill priority className="object-cover" sizes="768px" />
        </div>
      )}

      <div className="prose-article" dangerouslySetInnerHTML={{ __html: html }} />

      {article.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag.id} className="rounded-full bg-ink/5 px-3 py-1 text-xs font-medium text-ink-soft">
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 border-t border-ink/10 pt-6">
        <p className="mb-3 text-sm font-semibold text-ink">Ulashish</p>
        <ShareButtons url={url} title={article.title} />
      </div>

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-5 font-heading text-xl font-bold text-ink">O&apos;xshash maqolalar</h2>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {related.map((r) => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </div>
      )}

      <CommentSection articleId={article.id} />
    </article>
  );
}
