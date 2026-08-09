import Link from "next/link";
import { getAdContracts, getAdContractSettings } from "@/lib/queries";
import { AD_CONTRACT_STATUS_LABELS, AD_CONTRACT_STATUS_BADGE, formatUzs } from "@/lib/contract-format";
import { formatDateTimeUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import CopyLinkButton from "@/components/admin/CopyLinkButton";
import ContractCalendar from "@/components/admin/ContractCalendar";
import ContractSettingsForm from "@/components/admin/ContractSettingsForm";
import { deleteAdContract } from "@/actions/ad-contract";

const TABS = [
  { key: "royxat", label: "Ro'yxat" },
  { key: "jadval", label: "Jadval" },
  { key: "sozlamalar", label: "Sozlamalar" },
] as const;
type Tab = (typeof TABS)[number]["key"];

export default async function AdContractsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; y?: string; m?: string }>;
}) {
  const sp = await searchParams;
  const tab: Tab = (TABS.map((t) => t.key) as string[]).includes(sp.tab ?? "") ? (sp.tab as Tab) : "royxat";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="mb-1 font-heading text-2xl font-bold text-ink">Reklama shartnomalari</h1>
          <p className="text-sm text-ink-soft">Reklama beruvchilar bilan elektron shartnoma va to&apos;lov jarayoni.</p>
        </div>
        <Link
          href="/admin/reklama-shartnomalari/yangi"
          className="rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Yangi shartnoma
        </Link>
      </div>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "royxat" ? "/admin/reklama-shartnomalari" : `/admin/reklama-shartnomalari?tab=${t.key}`}
            className={`rounded-pill px-4 py-2 text-sm font-medium ${
              tab === t.key ? "bg-primary text-white" : "border border-ink/10 text-ink-soft hover:border-primary hover:text-primary"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "royxat" && <ContractListTab siteUrl={siteUrl} />}
      {tab === "jadval" && <CalendarTab y={sp.y} m={sp.m} />}
      {tab === "sozlamalar" && <SettingsTab />}
    </div>
  );
}

async function ContractListTab({ siteUrl }: { siteUrl: string }) {
  const contracts = await getAdContracts();

  return (
    <div className="space-y-3">
      {contracts.map((c) => (
        <div key={c.id} className="rounded-card border border-ink/10 bg-white p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-ink">{c.signerName ?? "Hali imzolanmagan"}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${AD_CONTRACT_STATUS_BADGE[c.status]}`}>
                {AD_CONTRACT_STATUS_LABELS[c.status]}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/reklama-shartnomalari/${c.id}`} className="text-xs font-medium text-primary hover:underline">
                Ko&apos;rish →
              </Link>
              <DeleteButton
                action={deleteAdContract.bind(null, c.id)}
                className="text-xs font-medium text-red-600 hover:underline"
                successMessage="O'chirildi"
                confirmText="Shartnomani butunlay o'chirmoqchimisiz? Bu bandlangan vaqtni ham bo'shatadi."
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
            <span>Soatlik: {formatUzs(c.hourlyRateUzs)}</span>
            {c.totalAmountUzs !== null && <span>Jami: {formatUzs(c.totalAmountUzs)}</span>}
            {c.startAt && c.endAt && (
              <span>
                {formatDateTimeUz(c.startAt)} — {formatDateTimeUz(c.endAt)}
              </span>
            )}
            <span>Yaratildi: {formatDateTimeUz(c.createdAt)}</span>
          </div>
          {c.status === "PENDING_SIGNATURE" && (
            <div className="mt-2 flex items-center gap-2">
              <code className="min-w-0 flex-1 truncate rounded bg-cream px-2 py-1 text-xs text-ink-soft">
                {siteUrl}/shartnoma/{c.token}
              </code>
              <CopyLinkButton text={`${siteUrl}/shartnoma/${c.token}`} />
            </div>
          )}
        </div>
      ))}
      {contracts.length === 0 && <p className="py-16 text-center text-ink-soft">Hozircha shartnomalar yo&apos;q</p>}
    </div>
  );
}

async function CalendarTab({ y, m }: { y?: string; m?: string }) {
  const now = new Date();
  const year = Number(y) || now.getFullYear();
  const month = m ? Number(m) - 1 : now.getMonth();

  const contracts = await getAdContracts();
  const bookings = contracts
    .filter((c) => c.startAt && c.endAt)
    .map((c) => ({ id: c.id, signerName: c.signerName, startAt: c.startAt!, endAt: c.endAt! }));

  const prev = new Date(year, month - 1, 1);
  const next = new Date(year, month + 1, 1);

  return (
    <div className="rounded-card border border-ink/10 bg-white p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={`/admin/reklama-shartnomalari?tab=jadval&y=${prev.getFullYear()}&m=${prev.getMonth() + 1}`}
          className="rounded-pill border border-ink/10 px-3 py-1.5 text-sm text-ink-soft hover:border-primary hover:text-primary"
        >
          ← Oldingi
        </Link>
        <Link
          href={`/admin/reklama-shartnomalari?tab=jadval&y=${next.getFullYear()}&m=${next.getMonth() + 1}`}
          className="rounded-pill border border-ink/10 px-3 py-1.5 text-sm text-ink-soft hover:border-primary hover:text-primary"
        >
          Keyingi →
        </Link>
      </div>
      <ContractCalendar bookings={bookings} year={year} month={month} />
    </div>
  );
}

async function SettingsTab() {
  const settings = await getAdContractSettings();
  return <ContractSettingsForm initial={settings ?? undefined} />;
}
