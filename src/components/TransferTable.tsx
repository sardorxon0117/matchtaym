import Link from "next/link";
import Image from "next/image";
import { formatDateUz } from "@/lib/utils";

const STATUS_STYLE: Record<string, string> = {
  RUMOR: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  OFFICIAL: "bg-green-100 text-green-700",
};

const STATUS_LABEL: Record<string, string> = {
  RUMOR: "Mish-mish",
  CONFIRMED: "Tasdiqlangan",
  OFFICIAL: "Rasmiy",
};

export type TransferRow = {
  id: string;
  playerName: string;
  playerImage: string | null;
  fromClub: string;
  toClub: string;
  fee: string | null;
  status: string;
  date: Date | string;
  league: string | null;
  relatedArticle: { slug: string } | null;
};

export default function TransferTable({ transfers }: { transfers: TransferRow[] }) {
  if (transfers.length === 0) {
    return <p className="py-16 text-center text-ink-soft">Hozircha transferlar topilmadi.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-card border border-ink/10 bg-white">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-ink/10 text-xs uppercase tracking-wide text-ink-soft/70">
          <tr>
            <th className="px-4 py-3">O&apos;yinchi</th>
            <th className="px-4 py-3">Yo&apos;nalish</th>
            <th className="px-4 py-3">Summa</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Sana</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {transfers.map((t) => (
            <tr key={t.id} className="border-b border-ink/5 transition-colors last:border-0 hover:bg-cream/60">
              <td className="flex items-center gap-3 px-4 py-3 font-medium text-ink">
                {t.playerImage ? (
                  <span className="relative h-8 w-8 overflow-hidden rounded-full bg-ink/5">
                    <Image src={t.playerImage} alt="" fill className="object-cover" />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink/5 text-sm">⚽</span>
                )}
                {t.playerName}
              </td>
              <td className="px-4 py-3 text-ink-soft">
                {t.fromClub} <span className="text-primary">→</span> {t.toClub}
              </td>
              <td className="px-4 py-3 text-ink-soft">{t.fee ?? "—"}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLE[t.status]}`}>
                  {STATUS_LABEL[t.status]}
                </span>
              </td>
              <td className="px-4 py-3 text-ink-soft">{formatDateUz(t.date)}</td>
              <td className="px-4 py-3 text-right">
                {t.relatedArticle && (
                  <Link href={`/maqola/${t.relatedArticle.slug}`} className="text-sm font-medium text-primary hover:underline">
                    Maqola →
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
