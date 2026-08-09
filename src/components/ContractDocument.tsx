import { formatUzs } from "@/lib/contract-format";
import { formatDateTimeUz } from "@/lib/utils";
import ContractStamp from "@/components/ContractStamp";

export type ContractDocumentData = {
  id: string;
  hourlyRateUzs: number;
  signerEmail: string | null;
  signerName: string | null;
  startAt: Date | string | null;
  endAt: Date | string | null;
  totalAmountUzs: number | null;
  status: string;
  agreedAt: Date | string | null;
  agreedIp: string | null;
  paymentConfirmedAt: Date | string | null;
  createdAt: Date | string;
};

const BLANK = "________________";

function paymentStatusText(contract: ContractDocumentData): string | null {
  if (contract.status === "CONFIRMED" && contract.totalAmountUzs !== null) {
    return `Ushbu shartnoma bo'yicha ${formatUzs(contract.totalAmountUzs)} to'lovi ${
      contract.paymentConfirmedAt ? formatDateTimeUz(contract.paymentConfirmedAt) : ""
    } sanada to'liq amalga oshirilgan va Ijrochi tomonidan tasdiqlangan.`;
  }
  if (contract.status === "PAYMENT_SUBMITTED") {
    return "To'lovni tasdiqlovchi hujjat (chek) taqdim etilgan, Ijrochi tomonidan tekshirilmoqda.";
  }
  if (contract.status === "AWAITING_PAYMENT" || contract.status === "REJECTED") {
    return "Ushbu shartnoma bo'yicha to'lov hali amalga oshirilmagan.";
  }
  return null;
}

/** Plain, formal paragraph — same tone as the numbered clauses above it, no badges/colors/emoji. */
function PaymentStatusLine({ contract }: { contract: ContractDocumentData }) {
  const text = paymentStatusText(contract);
  if (!text) return null;
  return (
    <p className="mt-4 border-t border-ink/10 pt-4">
      <span className="font-semibold">To&apos;lov holati.</span> {text}
    </p>
  );
}

/**
 * Renders the ad-placement contract as a formal, A4-styled document — used
 * both on the admin's detail page and on the advertiser's signing page, so
 * both sides always see byte-for-byte the same terms. Signed fields
 * (signerName/startAt/endAt/totalAmountUzs/agreedAt/agreedIp) are never
 * edited by any code path after signing, so rendering live from the DB
 * record is equivalent to a "frozen" snapshot in practice.
 */
export default function ContractDocument({ contract }: { contract: ContractDocumentData }) {
  const period =
    contract.startAt && contract.endAt
      ? `${formatDateTimeUz(contract.startAt)} dan ${formatDateTimeUz(contract.endAt)} gacha`
      : "hali belgilanmagan";

  return (
    <div
      className="mx-auto max-w-[210mm] rounded-card border border-ink/10 bg-white p-6 text-sm leading-relaxed text-ink shadow-sm sm:p-10 print:border-0 print:shadow-none"
      style={{ fontFamily: "'Times New Roman', Times, serif" }}
    >
      <h1 className="mb-1 text-center text-lg font-bold uppercase tracking-wide">
        Reklama xizmatlarini ko&apos;rsatish to&apos;g&apos;risida shartnoma
      </h1>
      <p className="mb-6 text-center text-xs text-ink-soft">
        № {contract.id.slice(-8).toUpperCase()} &middot; {formatDateTimeUz(contract.createdAt)}
      </p>

      <p className="mb-4">
        <span className="font-semibold">IJROCHI:</span> &laquo;MatchTaym&raquo; loyihasi (jamoasi nomidan), veb-sayt:
        matchtaym.sardorkhon.me — bundan buyon &laquo;Ijrochi&raquo; deb yuritiladi, bir tomondan, va
      </p>
      <p className="mb-6">
        <span className="font-semibold">BUYURTMACHI:</span> {contract.signerName ?? BLANK} (email:{" "}
        {contract.signerEmail ?? BLANK}) — bundan buyon &laquo;Buyurtmachi&raquo; deb yuritiladi, ikkinchi
        tomondan, quyidagilar to&apos;g&apos;risida ushbu shartnomani tuzdilar:
      </p>

      <ol className="list-decimal space-y-3 pl-5">
        <li>
          <span className="font-semibold">Shartnoma predmeti.</span> Ijrochi Buyurtmachiga MatchTaym veb-saytida
          reklama banneri joylashtirish xizmatini ko&apos;rsatadi, Buyurtmachi esa ushbu xizmat uchun belgilangan
          haqni to&apos;laydi.
        </li>
        <li>
          <span className="font-semibold">Xizmat muddati.</span> Reklama {period} davomida saytda ko&apos;rinib
          turadi.
        </li>
        <li>
          <span className="font-semibold">Xizmat narxi.</span> 1 (bir) soat narxi — {formatUzs(contract.hourlyRateUzs)}.
          Yuqoridagi muddat asosida umumiy summa —{" "}
          <span className="font-semibold">
            {contract.totalAmountUzs !== null ? formatUzs(contract.totalAmountUzs) : BLANK}
          </span>
          .
        </li>
        <li>
          <span className="font-semibold">To&apos;lov tartibi.</span> Buyurtmachi umumiy summani Ijrochining ushbu
          sahifada ko&apos;rsatilgan bank kartasiga o&apos;tkazma orqali to&apos;laydi va to&apos;lovni tasdiqlovchi
          chekni shu sahifaga yuklaydi. Ijrochi chekni tekshirib, to&apos;lovni tasdiqlaydi — shundan so&apos;ng
          reklama belgilangan vaqtda saytga joylanadi.
        </li>
        <li>
          <span className="font-semibold">Tomonlarning majburiyatlari.</span> Ijrochi — to&apos;lov
          tasdiqlangandan so&apos;ng reklamani belgilangan muddatda, uzluksiz ko&apos;rsatib turishga; Buyurtmachi —
          to&apos;lovni to&apos;liq va o&apos;z vaqtida amalga oshirishga majburdir.
        </li>
        <li>
          <span className="font-semibold">Bekor qilish sharti.</span> To&apos;lov tasdiqlanmaguncha har ikki tomon
          ham shartnomadan bepul voz kecha oladi. To&apos;lov tasdiqlangandan so&apos;ng bekor qilish tomonlar
          o&apos;rtasidagi alohida kelishuv asosida amalga oshiriladi.
        </li>
        <li>
          <span className="font-semibold">Elektron shartnoma haqida.</span> Ushbu shartnoma elektron shaklda
          tuzilgan. Buyurtmachining email manzili Google orqali tasdiqlangan, roziligi bildirilgan payt IP-manzili
          va vaqt belgisi bilan qayd etilgan. Tomonlar ushbu elektron kelishuvni o&apos;zaro yozma shartnomaga teng
          deb tan olishadi.
        </li>
      </ol>

      <PaymentStatusLine contract={contract} />

      <div className="mt-8 grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-2">
        <div className="relative">
          <p className="mb-1 font-semibold">IJROCHI</p>
          <p>MatchTaym jamoasi</p>
          {contract.status === "CONFIRMED" && (
            <ContractStamp className="pointer-events-none absolute -top-4 left-16 h-28 w-28 sm:left-24" />
          )}
        </div>
        <div>
          <p className="mb-1 font-semibold">BUYURTMACHI</p>
          <p>{contract.signerName ?? BLANK}</p>
          <p className="text-xs text-ink-soft">{contract.signerEmail ?? BLANK}</p>
          {contract.agreedAt && (
            <p className="mt-1 text-xs text-ink-soft">
              Roziligi bildirilgan: {formatDateTimeUz(contract.agreedAt)}
              {contract.agreedIp ? ` · IP: ${contract.agreedIp}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
