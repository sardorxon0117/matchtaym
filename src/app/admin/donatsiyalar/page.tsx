import { getDonationInquiries } from "@/lib/queries";
import { deleteDonationInquiry } from "@/actions/donate";
import { formatDateTimeUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminDonationsPage() {
  const inquiries = await getDonationInquiries();

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Donatsiyalar</h1>
      <p className="mb-6 text-sm text-ink-soft">
        /donate sahifasidagi &quot;Xabardor qilishimizni istayman&quot; formasi orqali yuborilgan so&apos;rovlar. Click
        hamkorligi yakunlangach, bu odamlarga birinchi navbatda xabar bering.
      </p>

      <div className="space-y-3">
        {inquiries.map((d) => (
          <div key={d.id} className="rounded-card border border-ink/10 bg-white p-4">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{d.name}</span>
                <span className="text-ink-soft/60">•</span>
                <a href={`mailto:${d.email}`} className="text-primary hover:underline">
                  {d.email}
                </a>
                <span className="text-ink-soft/60">•</span>
                <span className="text-ink-soft/60">{formatDateTimeUz(d.createdAt)}</span>
              </div>
              <DeleteButton
                action={deleteDonationInquiry.bind(null, d.id)}
                className="text-xs font-medium text-red-600 hover:underline"
                successMessage="O'chirildi"
              />
            </div>
            {d.message && <p className="whitespace-pre-wrap text-sm text-ink-soft">{d.message}</p>}
          </div>
        ))}
        {inquiries.length === 0 && <p className="py-16 text-center text-ink-soft">Hozircha so&apos;rovlar yo&apos;q</p>}
      </div>
    </div>
  );
}
