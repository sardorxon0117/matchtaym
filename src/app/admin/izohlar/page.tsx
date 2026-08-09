import Link from "next/link";
import { getAllCommentsForAdmin } from "@/lib/queries";
import { deleteComment } from "@/actions/comments";
import { formatDateUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

const TABS = [
  { key: "all", label: "Barchasi" },
  { key: "pending", label: "Javob kutilmoqda" },
  { key: "answered", label: "Javob berilgan" },
] as const;

export default async function AdminCommentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: filterParam } = await searchParams;
  const filter = (["all", "answered", "pending"] as const).includes(filterParam as never)
    ? (filterParam as "all" | "answered" | "pending")
    : "all";

  const comments = await getAllCommentsForAdmin(filter);

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Izohlar</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Javob yozish uchun maqola sahifasiga o&apos;ting — admin sifatida kirgan bo&apos;lsangiz, har bir izoh ostida
        &quot;Javob yozish&quot; tugmasi chiqadi.
      </p>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "all" ? "/admin/izohlar" : `/admin/izohlar?filter=${t.key}`}
            className={`rounded-pill px-4 py-2 text-sm font-medium ${
              filter === t.key ? "bg-primary text-white" : "border border-ink/10 text-ink-soft hover:border-primary hover:text-primary"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-card border border-ink/10 bg-white p-4">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{c.author.name}</span>
                <span className="text-ink-soft/60">•</span>
                <span className="text-ink-soft/60">{formatDateUz(c.createdAt)}</span>
                {c.replies.length > 0 ? (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Javob berilgan
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Javob kutilmoqda
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/maqola/${c.article.slug}`} className="text-xs font-medium text-primary hover:underline">
                  {c.article.title} →
                </Link>
                <DeleteButton action={deleteComment.bind(null, c.id)} className="text-xs font-medium text-red-600 hover:underline" />
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm text-ink-soft">{c.content}</p>

            {c.replies.length > 0 && (
              <div className="mt-3 space-y-2 border-l-2 border-primary/20 pl-3">
                {c.replies.map((r) => (
                  <div key={r.id} className="flex items-start justify-between gap-2">
                    <p className="text-sm text-ink-soft">
                      <span className="font-semibold text-ink">{r.author.name}:</span> {r.content}
                    </p>
                    <DeleteButton action={deleteComment.bind(null, r.id)} className="shrink-0 text-xs font-medium text-red-600 hover:underline" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <p className="py-16 text-center text-ink-soft">Bu bo&apos;limda izohlar yo&apos;q</p>
        )}
      </div>
    </div>
  );
}
