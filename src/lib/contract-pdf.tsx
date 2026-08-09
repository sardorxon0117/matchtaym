// Only ever imported dynamically (from ContractPdfButton, on click) — keeps
// @react-pdf/renderer's sizable bundle out of every page's initial JS.
// Deliberately client-side (no headless-browser/server dependency): this
// project already got burned once by a native/Node-heavy library
// (isomorphic-dompurify's jsdom) crashing only in Vercel's serverless
// runtime, so PDF generation stays as plain, portable JS that runs the same
// in the browser everywhere.
import { Document, Page, Text, View, Image, StyleSheet, pdf } from "@react-pdf/renderer";
import type { ContractDocumentData } from "@/components/ContractDocument";
import { formatUzs } from "@/lib/contract-format";
import { formatDateTimeUz } from "@/lib/utils";

const BLANK = "________________";

const styles = StyleSheet.create({
  page: { padding: 48, fontFamily: "Times-Roman", fontSize: 10.5, lineHeight: 1.5, color: "#1a1a1a" },
  title: { fontSize: 14, fontWeight: 700, textAlign: "center", marginBottom: 4, textTransform: "uppercase" },
  subtitle: { fontSize: 8.5, textAlign: "center", marginBottom: 20, color: "#666" },
  bold: { fontWeight: 700 },
  para: { marginBottom: 10 },
  clause: { flexDirection: "row", marginBottom: 8 },
  clauseNum: { width: 16, fontWeight: 700 },
  clauseBody: { flex: 1 },
  statusPara: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#ccc" },
  signatures: { flexDirection: "row", marginTop: 24, paddingTop: 14, borderTopWidth: 1, borderTopColor: "#ccc" },
  sigCol: { flex: 1, position: "relative" },
  sigLabel: { fontWeight: 700, marginBottom: 3 },
  small: { fontSize: 8.5, color: "#666" },
  stamp: { position: "absolute", top: 16, left: 2, width: 64, height: 64, opacity: 0.6, transform: "rotate(-9deg)" },
});

const CLAUSES = (contract: ContractDocumentData, period: string) => [
  {
    title: "Shartnoma predmeti.",
    body: "Ijrochi Buyurtmachiga MatchTaym veb-saytida reklama banneri joylashtirish xizmatini ko'rsatadi, Buyurtmachi esa ushbu xizmat uchun belgilangan haqni to'laydi.",
  },
  { title: "Xizmat muddati.", body: `Reklama ${period} davomida saytda ko'rinib turadi.` },
  {
    title: "Xizmat narxi.",
    body: `1 (bir) soat narxi - ${formatUzs(contract.hourlyRateUzs)}. Yuqoridagi muddat asosida umumiy summa - ${
      contract.totalAmountUzs !== null ? formatUzs(contract.totalAmountUzs) : BLANK
    }.`,
  },
  {
    title: "To'lov tartibi.",
    body: "Buyurtmachi umumiy summani Ijrochining ko'rsatilgan bank kartasiga o'tkazma orqali to'laydi va to'lovni tasdiqlovchi chekni yuklaydi. Ijrochi chekni tekshirib, to'lovni tasdiqlaydi - shundan so'ng reklama belgilangan vaqtda saytga joylanadi.",
  },
  {
    title: "Tomonlarning majburiyatlari.",
    body: "Ijrochi - to'lov tasdiqlangandan so'ng reklamani belgilangan muddatda, uzluksiz ko'rsatib turishga; Buyurtmachi - to'lovni to'liq va o'z vaqtida amalga oshirishga majburdir.",
  },
  {
    title: "Bekor qilish sharti.",
    body: "To'lov tasdiqlanmaguncha har ikki tomon ham shartnomadan bepul voz kecha oladi. To'lov tasdiqlangandan so'ng bekor qilish tomonlar o'rtasidagi alohida kelishuv asosida amalga oshiriladi.",
  },
  {
    title: "Elektron shartnoma haqida.",
    body: "Ushbu shartnoma elektron shaklda tuzilgan. Buyurtmachining email manzili Google orqali tasdiqlangan, roziligi bildirilgan payt IP-manzili va vaqt belgisi bilan qayd etilgan. Tomonlar ushbu elektron kelishuvni o'zaro yozma shartnomaga teng deb tan olishadi.",
  },
];

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

function PdfStamp() {
  // eslint-disable-next-line jsx-a11y/alt-text -- this is @react-pdf/renderer's Image (PDF content), not a DOM <img>; it has no alt prop
  return <Image src="/stamp-mark.png" style={styles.stamp} />;
}

function ContractPdfDocument({ contract }: { contract: ContractDocumentData }) {
  const period =
    contract.startAt && contract.endAt
      ? `${formatDateTimeUz(contract.startAt)} dan ${formatDateTimeUz(contract.endAt)} gacha`
      : "hali belgilanmagan";
  const statusText = paymentStatusText(contract);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reklama xizmatlarini ko&apos;rsatish to&apos;g&apos;risida shartnoma</Text>
        <Text style={styles.subtitle}>
          № {contract.id.slice(-8).toUpperCase()} - {formatDateTimeUz(contract.createdAt)}
        </Text>

        <Text style={styles.para}>
          <Text style={styles.bold}>IJROCHI: </Text>
          &quot;MatchTaym&quot; loyihasi (jamoasi nomidan), veb-sayt: matchtaym.sardorkhon.me - bundan buyon
          &quot;Ijrochi&quot; deb yuritiladi, bir tomondan, va
        </Text>
        <Text style={styles.para}>
          <Text style={styles.bold}>BUYURTMACHI: </Text>
          {contract.signerName ?? BLANK} (email: {contract.signerEmail ?? BLANK}) - bundan buyon
          &quot;Buyurtmachi&quot; deb yuritiladi, ikkinchi tomondan, quyidagilar to&apos;g&apos;risida ushbu
          shartnomani tuzdilar:
        </Text>

        {CLAUSES(contract, period).map((c, i) => (
          <View key={i} style={styles.clause}>
            <Text style={styles.clauseNum}>{i + 1}.</Text>
            <Text style={styles.clauseBody}>
              <Text style={styles.bold}>{c.title} </Text>
              {c.body}
            </Text>
          </View>
        ))}

        {statusText && (
          <Text style={styles.statusPara}>
            <Text style={styles.bold}>To&apos;lov holati. </Text>
            {statusText}
          </Text>
        )}

        <View style={styles.signatures}>
          <View style={styles.sigCol}>
            {contract.status === "CONFIRMED" && <PdfStamp />}
            <Text style={styles.sigLabel}>IJROCHI</Text>
            <Text>MatchTaym jamoasi</Text>
          </View>
          <View style={styles.sigCol}>
            <Text style={styles.sigLabel}>BUYURTMACHI</Text>
            <Text>{contract.signerName ?? BLANK}</Text>
            <Text style={styles.small}>{contract.signerEmail ?? BLANK}</Text>
            {contract.agreedAt && (
              <Text style={styles.small}>
                Roziligi bildirilgan: {formatDateTimeUz(contract.agreedAt)}
                {contract.agreedIp ? ` - IP: ${contract.agreedIp}` : ""}
              </Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}

export async function buildContractPdfBlob(contract: ContractDocumentData): Promise<Blob> {
  return pdf(<ContractPdfDocument contract={contract} />).toBlob();
}
