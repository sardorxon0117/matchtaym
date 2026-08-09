import Link from "next/link";
import { getAllTransfersForAdmin } from "@/lib/queries";
import { deleteTransfer } from "@/actions/transfers";
import { formatDateUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import FlashToast from "@/components/FlashToast";

const STATUS_LABEL: Record<string, string> = {
  RUMOR: "Mish-mish",
  CONFIRMED: "Tasdiqlangan",
  OFFICIAL: "Rasmiy",
};

export default async function AdminTransfersPage() {
  const transfers = await getAllTransfersForAdmin();

  return (
    <div>
      <FlashToast param="created" message="Transfer qo'shildi ✓" />
      <FlashToast param="saved" message="Transfer saqlandi ✓" />
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-ink">Transferlar</h1>
        <Link href="/admin/transferlar/yangi" className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          + Yangi transfer
        </Link>
      </div>

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
              <tr key={t.id} className="border-b border-ink/5 last:border-0">
                <td className="px-4 py-3 font-medium text-ink">{t.playerName}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {t.fromClub} → {t.toClub}
                </td>
                <td className="px-4 py-3 text-ink-soft">{t.fee ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft">{STATUS_LABEL[t.status]}</td>
                <td className="px-4 py-3 text-ink-soft">{formatDateUz(t.date)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/transferlar/${t.id}`} className="text-sm font-medium text-primary hover:underline">
                      Tahrirlash
                    </Link>
                    <DeleteButton action={deleteTransfer.bind(null, t.id)} successMessage="Transfer o'chirildi" />
                  </div>
                </td>
              </tr>
            ))}
            {transfers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink-soft">
                  Hozircha transferlar yo&apos;q
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
