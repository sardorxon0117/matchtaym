import Image from "next/image";
import Link from "next/link";
import { formatRelativeUz } from "@/lib/utils";
import type { ArticleCardData } from "./ArticleCard";

export default function HeroCard({ article }: { article: ArticleCardData }) {
  return (
    <Link
      href={`/maqola/${article.slug}`}
      className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-card border border-ink/10 bg-ink text-white sm:min-h-[26rem]"
    >
      {article.coverImage ? (
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          className="object-cover opacity-90 transition-transform duration-300 group-hover:scale-105"
          sizes="100vw"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

      <div className="relative z-10 p-6 sm:p-8">
        {article.category && (
          <span className="mb-3 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold">
            {article.category.name}
          </span>
        )}
        <h1 className="max-w-3xl font-heading text-2xl font-bold leading-tight sm:text-3xl md:text-4xl">
          {article.title}
        </h1>
        {article.excerpt && (
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">{article.excerpt}</p>
        )}
        <div className="mt-4 flex items-center gap-2 text-xs text-white/70">
          {article.publishedAt && <span>{formatRelativeUz(article.publishedAt)}</span>}
          <span>•</span>
          <span>{article.readTimeMin} daqiqa o&apos;qish</span>
        </div>
      </div>
    </Link>
  );
}
