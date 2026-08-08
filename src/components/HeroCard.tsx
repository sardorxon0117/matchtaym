import Image from "next/image";
import Link from "next/link";
import { formatRelativeUz } from "@/lib/utils";
import type { ArticleCardData } from "./ArticleCard";

export default function HeroCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/maqola/${article.slug}`}
      className="group flex h-40 overflow-hidden rounded-card border border-ink/10 bg-ink text-white sm:h-44"
    >
      <div className="relative w-32 shrink-0 overflow-hidden sm:w-56">
        {article.coverImage ? (
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            priority
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 640px) 224px, 128px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-ink-soft text-3xl">⚽</div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
        {article.category && (
          <span className="inline-block w-fit rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold">
            {article.category.name}
          </span>
        )}
        <h1 className="line-clamp-2 font-heading text-base font-bold leading-snug sm:text-xl">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
          {article.publishedAt && <span>{formatRelativeUz(article.publishedAt)}</span>}
          <span>•</span>
          <span>{article.readTimeMin} daqiqa</span>
          <span className="hidden items-center gap-1 font-semibold text-accent sm:inline-flex">
            <ArrowIcon />
            To&apos;liq o&apos;qish
          </span>
        </div>
      </div>
    </Link>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
