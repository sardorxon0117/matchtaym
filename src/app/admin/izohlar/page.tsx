import Link from "next/link";
import { getAllCommentsForAdmin } from "@/lib/queries";
import { deleteComment } from "@/actions/comments";
import { formatDateUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCommentsPage() {
  const comments = await getAllCommentsForAdmin();

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink">Izohlar</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Javob yozish uchun maqola sahifasiga o&apos;ting — admin sifatida kirgan bo&apos;lsangiz, har bir izoh ostida
        &quot;Javob yozish&quot; tugmasi chiqadi.
      </p>

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="rounded-card border border-ink/10 bg-white p-4">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{c.author.name}</span>
                <span className="text-ink-soft/60">•</span>
                <span className="text-ink-soft/60">{formatDateUz(c.createdAt)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/maqola/${c.article.slug}`} className="text-xs font-medium text-primary hover:underline">
                  {c.article.title} →
                </Link>
                <DeleteButton action={deleteComment.bind(null, c.id)} className="text-xs font-medium text-red-600 hover:underline" />
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm text-ink-soft">{c.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="py-16 text-center text-ink-soft">Hozircha izohlar yo&apos;q</p>
        )}
      </div>
    </div>
  );
}
