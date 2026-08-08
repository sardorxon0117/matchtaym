import Link from "next/link";
import { auth } from "@/auth";
import { getCommentsForArticle } from "@/lib/queries";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

function countAll(nodes: { replies: unknown[] }[]): number {
  return nodes.reduce((sum, n) => sum + 1 + countAll(n.replies as { replies: unknown[] }[]), 0);
}

export default async function CommentSection({ articleId }: { articleId: string }) {
  const [session, comments] = await Promise.all([auth(), getCommentsForArticle(articleId)]);

  const currentUser = session?.user
    ? { id: session.user.id, role: (session.user as { role?: string }).role ?? "" }
    : null;

  const total = countAll(comments);

  return (
    <section className="mt-10 border-t border-ink/10 pt-8">
      <h2 className="mb-5 font-heading text-xl font-bold text-ink">Izohlar ({total})</h2>

      {currentUser ? (
        <div className="mb-8 max-w-xl">
          <CommentForm articleId={articleId} placeholder="Fikringizni yozing…" />
        </div>
      ) : (
        <p className="mb-8 rounded-card border border-ink/10 bg-white p-4 text-sm text-ink-soft">
          Izoh qoldirish uchun{" "}
          <Link href="/kirish" className="font-medium text-primary hover:underline">
            tizimga kiring
          </Link>{" "}
          yoki{" "}
          <Link href="/royxatdan-otish" className="font-medium text-primary hover:underline">
            ro&apos;yxatdan o&apos;ting
          </Link>
          .
        </p>
      )}

      {comments.length > 0 ? (
        <div className="divide-y divide-ink/5">
          {comments.map((c) => (
            <CommentItem key={c.id} comment={c} articleId={articleId} currentUser={currentUser} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-ink-soft">Hozircha izohlar yo&apos;q. Birinchi bo&apos;lib fikr bildiring!</p>
      )}
    </section>
  );
}
