import { notFound } from "next/navigation";
import Link from "next/link";
import { getAdContractById } from "@/lib/queries";
import { AD_CONTRACT_STATUS_LABELS, AD_CONTRACT_STATUS_BADGE } from "@/lib/contract-format";
import ContractDocument from "@/components/ContractDocument";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import ConfirmPaymentButton from "@/components/admin/ConfirmPaymentButton";
import RejectPaymentForm from "@/components/admin/RejectPaymentForm";

export default async function AdContractDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const { id } = await params;
  const { created } = await searchParams;
  const contract = await getAdContractById(id);
  if (!contract) notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const link = `${siteUrl}/shartnoma/${contract.token}`;

  return (
    <div>
      <Link href="/admin/reklama-shartnomalari" className="mb-3 block text-xs font-medium text-primary hover:underline">
        ← Ro&apos;yxatga qaytish
      </Link>

      {created && (
        <div className="mb-6 rounded-card border border-primary/20 bg-primary/5 p-4">
          <p className="mb-2 text-sm font-medium text-ink">Shartnoma yaratildi! Havolani reklama beruvchiga yuboring:</p>
          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded bg-white px-2 py-1 text-xs text-ink-soft">{link}</code>
            <CopyLinkButton text={link} />
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-ink">Shartnoma</h1>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${AD_CONTRACT_STATUS_BADGE[contract.status]}`}>
          {AD_CONTRACT_STATUS_LABELS[contract.status]}
        </span>
      </div>

      {!created && (
        <div className="mb-6 flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded bg-cream px-2 py-1 text-xs text-ink-soft">{link}</code>
          <CopyLinkButton text={link} />
        </div>
      )}

      <div className="mb-6">
        <ContractDocument contract={contract} />
      </div>

      {contract.status === "PAYMENT_SUBMITTED" && (
        <div className="rounded-card border border-ink/10 bg-white p-5 sm:p-6">
          <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Yuklangan chek</h2>
          {contract.receiptUrl && (
            <a
              href={contract.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-block text-sm text-primary underline"
            >
              Chekni to&apos;liq holda ochish →
            </a>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <ConfirmPaymentButton id={contract.id} />
            <RejectPaymentForm id={contract.id} />
          </div>
        </div>
      )}

      {contract.status === "REJECTED" && contract.rejectReason && (
        <div className="rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p className="font-semibold">Rad etish sababi:</p>
          <p>{contract.rejectReason}</p>
        </div>
      )}
    </div>
  );
}
