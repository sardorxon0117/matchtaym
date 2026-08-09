import { getFeedbackList } from "@/lib/queries";
import { deleteFeedback } from "@/actions/donate";
import { formatDateTimeUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminFeedbackPage() {
  const items = await getFeedbackList();

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Taklif va shikoyatlar</h1>
      <p className="mb-6 text-sm text-ink-soft">/donate sahifasidagi forma orqali yuborilgan xabarlar.</p>

      <div className="space-y-3">
        {items.map((f) => (
          <div key={f.id} className="rounded-card border border-ink/10 bg-white p-4">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{f.name}</span>
                <span className="text-ink-soft/60">•</span>
                <a href={`mailto:${f.email}`} className="text-primary hover:underline">
                  {f.email}
                </a>
                <span className="text-ink-soft/60">•</span>
                <span className="text-ink-soft/60">{formatDateTimeUz(f.createdAt)}</span>
                {f.type === "COMPLAINT" ? (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Shikoyat</span>
                ) : (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Taklif</span>
                )}
              </div>
              <DeleteButton
                action={deleteFeedback.bind(null, f.id)}
                className="text-xs font-medium text-red-600 hover:underline"
                successMessage="O'chirildi"
              />
            </div>
            <p className="whitespace-pre-wrap text-sm text-ink-soft">{f.message}</p>
          </div>
        ))}
        {items.length === 0 && <p className="py-16 text-center text-ink-soft">Hozircha xabarlar yo&apos;q</p>}
      </div>
    </div>
  );
}
