import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdContractByToken, getAdContractSettings } from "@/lib/queries";
import { getBookedRanges } from "@/lib/contract";
import { formatUzs } from "@/lib/contract-format";
import { formatDateTimeUz } from "@/lib/utils";
import ContractDocument from "@/components/ContractDocument";
import ContractSignForm from "@/components/ContractSignForm";
import ContractPaymentForm from "@/components/ContractPaymentForm";
import PrintContractButton from "@/components/PrintContractButton";
import CopyLinkButton from "@/components/CopyLinkButton";

export const metadata: Metadata = { title: "Reklama shartnomasi" };

export default async function ContractSignPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ xato?: string }>;
}) {
  const { token } = await params;
  const { xato } = await searchParams;
  const contract = await getAdContractByToken(token);
  if (!contract) notFound();

  const needsBookedRanges = contract.status === "PENDING_SIGNATURE";
  const needsSettings = contract.status === "AWAITING_PAYMENT" || contract.status === "REJECTED";

  const [bookedRanges, settings] = await Promise.all([
    needsBookedRanges ? getBookedRanges(contract.id) : Promise.resolve([]),
    needsSettings ? getAdContractSettings() : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-ink sm:text-3xl">Reklama shartnomasi</h1>
        <PrintContractButton />
      </div>

      {xato && (
        <p className="mb-4 rounded-card border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Google orqali tasdiqlashda xatolik yuz berdi, qayta urinib ko&apos;ring.
        </p>
      )}

      <div className="mb-6">
        <ContractDocument contract={contract} />
      </div>

      {contract.status === "PENDING_SIGNATURE" && !contract.signerEmail && (
        <div className="rounded-card border border-primary/20 bg-primary/5 p-5 text-center sm:p-6">
          <p className="mb-4 text-sm text-ink-soft">
            Davom etish uchun avval Google orqali emailingizni tasdiqlang.
          </p>
          <a
            href={`/api/shartnoma/google/start?token=${token}`}
            className="inline-flex items-center gap-2 rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Google orqali tasdiqlash
          </a>
        </div>
      )}

      {contract.status === "PENDING_SIGNATURE" && contract.signerEmail && (
        <ContractSignForm
          token={token}
          bookedRanges={bookedRanges.map((r) => ({
            startAt: r.startAt.toISOString(),
            endAt: r.endAt.toISOString(),
          }))}
        />
      )}

      {(contract.status === "AWAITING_PAYMENT" || contract.status === "REJECTED") && (
        <div className="space-y-6">
          {contract.status === "REJECTED" && (
            <div className="rounded-card border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">To&apos;lov cheki rad etildi</p>
              {contract.rejectReason && <p className="mt-1">{contract.rejectReason}</p>}
              <p className="mt-1">Iltimos, to&apos;g&apos;ri chekni qayta yuklang.</p>
            </div>
          )}

          <div className="rounded-card border border-ink/10 bg-white p-5 sm:p-6">
            <h2 className="mb-3 font-heading text-lg font-semibold text-ink">To&apos;lov ma&apos;lumotlari</h2>
            <p className="mb-1 text-sm text-ink-soft">
              Summa:{" "}
              <span className="font-semibold text-ink">
                {contract.totalAmountUzs !== null ? formatUzs(contract.totalAmountUzs) : "—"}
              </span>
            </p>
            {settings?.cardNumber ? (
              <>
                <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
                  <span>
                    Karta raqami: <span className="font-mono font-semibold text-ink">{settings.cardNumber}</span>
                  </span>
                  <CopyLinkButton text={settings.cardNumber} label="Nusxalash" />
                </div>
                <p className="text-sm text-ink-soft">
                  Karta egasi: <span className="font-semibold text-ink">{settings.cardHolderName}</span>
                </p>
              </>
            ) : (
              <p className="text-sm text-ink-soft">
                To&apos;lov ma&apos;lumotlari hali kiritilmagan — admin bilan bog&apos;laning.
              </p>
            )}
          </div>

          <ContractPaymentForm token={token} />
        </div>
      )}

      {contract.status === "PAYMENT_SUBMITTED" && (
        <div className="rounded-card border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 sm:p-6">
          <p className="font-semibold">To&apos;lov tasdiqlanishini kuting</p>
          <p className="mt-1">
            Chekingiz qabul qilindi, tez orada tasdiqlanadi. Holatni shu havola orqali istalgan vaqt ko&apos;rishingiz
            mumkin.
          </p>
          {contract.receiptUrl && (
            <a
              href={contract.receiptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-primary underline"
            >
              Yuklangan chekni ko&apos;rish
            </a>
          )}
        </div>
      )}

      {contract.status === "CONFIRMED" && (
        <div className="rounded-card border border-green-200 bg-green-50 p-5 text-sm text-green-800 sm:p-6">
          <p className="font-semibold">✅ Tasdiqlandi!</p>
          <p className="mt-1">
            Reklamangiz{" "}
            {contract.startAt && contract.endAt
              ? `${formatDateTimeUz(contract.startAt)} dan ${formatDateTimeUz(contract.endAt)} gacha`
              : ""}{" "}
            ko&apos;rinib turadi.
          </p>
        </div>
      )}
    </div>
  );
}
