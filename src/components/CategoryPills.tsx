import Link from "next/link";
import { CATEGORY_SEED } from "@/lib/utils";

export default function CategoryPills({ activeSlug }: { activeSlug?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/"
        className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
          !activeSlug ? "bg-primary text-white" : "bg-white text-ink-soft hover:text-primary border border-ink/10"
        }`}
      >
        Barchasi
      </Link>
      {CATEGORY_SEED.map((c) => (
        <Link
          key={c.slug}
          href={`/kategoriya/${c.slug}`}
          className={`rounded-pill px-4 py-2 text-sm font-medium transition-colors ${
            activeSlug === c.slug ? "bg-primary text-white" : "bg-white text-ink-soft hover:text-primary border border-ink/10"
          }`}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
