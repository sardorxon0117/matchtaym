import Link from "next/link";

export default function Pagination({
  page,
  total,
  pageSize,
  basePath,
  query = {},
}: {
  page: number;
  total: number;
  pageSize: number;
  basePath: string;
  query?: Record<string, string | undefined>;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  if (totalPages <= 1) return null;

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const hrefFor = (p: number) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value) params.set(key, value);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Sahifalash">
      {hasPrev ? (
        <Link href={hrefFor(page - 1)} className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary">
          ← Oldingi
        </Link>
      ) : (
        <span className="rounded-pill border border-ink/5 px-4 py-2 text-sm font-medium text-ink-soft/30">← Oldingi</span>
      )}

      <span className="text-sm text-ink-soft">
        {page} / {totalPages}
      </span>

      {hasNext ? (
        <Link href={hrefFor(page + 1)} className="rounded-pill border border-ink/15 px-4 py-2 text-sm font-medium text-ink-soft hover:border-primary hover:text-primary">
          Keyingi →
        </Link>
      ) : (
        <span className="rounded-pill border border-ink/5 px-4 py-2 text-sm font-medium text-ink-soft/30">Keyingi →</span>
      )}
    </nav>
  );
}
