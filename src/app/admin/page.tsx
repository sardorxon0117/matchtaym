import Link from "next/link";
import { getDashboardStats } from "@/lib/queries";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Jami maqolalar", value: stats.articleCount },
    { label: "Nashr qilingan", value: stats.publishedCount },
    { label: "Qoralamalar", value: stats.draftCount },
    { label: "Jami ko'rishlar", value: stats.totalViews },
    { label: "Transferlar", value: stats.transferCount },
    { label: "Izohlar", value: stats.commentCount },
  ];

  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink">Boshqaruv paneli</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-ink/10 bg-white p-4">
            <p className="text-2xl font-bold text-ink">{c.value}</p>
            <p className="mt-1 text-xs text-ink-soft">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/maqolalar/yangi" className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          + Yangi maqola
        </Link>
        <Link href="/admin/transferlar/yangi" className="rounded-pill border border-ink/15 px-5 py-2.5 text-sm font-semibold text-ink-soft hover:border-primary hover:text-primary">
          + Yangi transfer
        </Link>
      </div>
    </div>
  );
}
