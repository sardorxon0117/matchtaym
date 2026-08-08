import Link from "next/link";
import { getAllArticlesForAdmin } from "@/lib/queries";
import { deleteArticle } from "@/actions/articles";
import { formatDateUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-ink">Maqolalar</h1>
        <Link href="/admin/maqolalar/yangi" className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          + Yangi maqola
        </Link>
      </div>

      <div className="overflow-x-auto rounded-card border border-ink/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-soft/70">
            <tr>
              <th className="px-4 py-3">Sarlavha</th>
              <th className="px-4 py-3">Kategoriya</th>
              <th className="px-4 py-3">Holat</th>
              <th className="px-4 py-3">Ko&apos;rishlar</th>
              <th className="px-4 py-3">Sana</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">
                  <Link href={`/admin/maqolalar/${a.id}`} className="hover:text-primary">
                    {a.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-soft">{a.category?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      a.status === "PUBLISHED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {a.status === "PUBLISHED" ? "Nashr qilingan" : "Qoralama"}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-soft">{a.views}</td>
                <td className="px-4 py-3 text-ink-soft">{formatDateUz(a.publishedAt ?? a.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/maqolalar/${a.id}`} className="text-sm font-medium text-primary hover:underline">
                      Tahrirlash
                    </Link>
                    <DeleteButton action={deleteArticle.bind(null, a.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  Hozircha maqolalar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
