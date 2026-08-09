import Image from "next/image";
import Link from "next/link";
import { formatRelativeUz } from "@/lib/utils";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: string | null;
  publishedAt: Date | string | null;
  views: number;
  category: { name: string; slug: string } | null;
  _count?: { comments: number };
};

export default function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/maqola/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-card border border-ink/10 bg-white transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-ink/5">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-3xl">⚽</div>
        )}
        {article.category && (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-white">
            {article.category.name}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 font-heading text-base font-semibold leading-snug text-ink group-hover:text-primary">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mb-3 line-clamp-2 flex-1 text-sm text-ink-soft">{article.excerpt}</p>
        )}
        <div className="mt-auto flex items-center gap-3 text-xs text-ink-soft/70">
          {article.publishedAt && <span>{formatRelativeUz(article.publishedAt)}</span>}
          <span className="flex items-center gap-1">
            <EyeIcon /> {article.views}
          </span>
          <span className="flex items-center gap-1">
            <CommentIcon /> {article._count?.comments ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}

function EyeIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
