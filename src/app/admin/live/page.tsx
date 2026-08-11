import Link from "next/link";
import {
  getLiveSettings,
  getAllLiveScheduleForAdmin,
  getAllLiveCommentsForAdmin,
  getAllLiveSessions,
} from "@/lib/queries";
import { deleteLiveScheduleEntry } from "@/actions/live";
import { formatDateTimeUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";
import LiveToggle from "@/components/admin/LiveToggle";
import LiveSettingsForm from "@/components/admin/LiveSettingsForm";
import LiveScheduleForm from "@/components/admin/LiveScheduleForm";
import FlashToast from "@/components/FlashToast";

const TABS = [
  { key: "sozlamalar", label: "Sozlamalar" },
  { key: "jadval", label: "Jadval" },
  { key: "sharhlar", label: "Sharhlar" },
] as const;
type Tab = (typeof TABS)[number]["key"];

export default async function AdminLivePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; created?: string; session?: string }>;
}) {
  const sp = await searchParams;
  const tab: Tab = (TABS.map((t) => t.key) as string[]).includes(sp.tab ?? "") ? (sp.tab as Tab) : "sozlamalar";

  return (
    <div>
      <FlashToast param="created" message="Qo'shildi ✓" />
      <div className="mb-6">
        <h1 className="mb-1 font-heading text-2xl font-bold text-ink">Live</h1>
        <p className="text-sm text-ink-soft">Jonli efir holati, translatsiyalar jadvali va izohlar.</p>
      </div>

      <div className="mb-6 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={t.key === "sozlamalar" ? "/admin/live" : `/admin/live?tab=${t.key}`}
            className={`rounded-pill px-4 py-2 text-sm font-medium ${
              tab === t.key ? "bg-primary text-white" : "border border-ink/10 text-ink-soft hover:border-primary hover:text-primary"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {tab === "sozlamalar" && <SettingsTab />}
      {tab === "jadval" && <ScheduleTab />}
      {tab === "sharhlar" && <CommentsTab sessionId={sp.session} />}
    </div>
  );
}

async function SettingsTab() {
  const settings = await getLiveSettings();

  return (
    <div className="space-y-6">
      <div className="rounded-card border border-ink/10 bg-white p-5">
        <p className="mb-3 text-sm font-medium text-ink">Efir holati</p>
        <LiveToggle initialLive={settings?.isLive ?? false} />
      </div>

      <LiveSettingsForm initialChannel={settings?.twitchChannel ?? ""} />

      <p className="max-w-sm text-sm text-ink-soft">
        Donate uchun karta raqami{" "}
        <Link href="/admin/reklama-shartnomalari?tab=sozlamalar" className="font-medium text-primary hover:underline">
          shu yerda
        </Link>{" "}
        boshqariladi (reklama shartnomalarida ham ishlatiladigan kartaning o&apos;zi).
      </p>
    </div>
  );
}

async function ScheduleTab() {
  const schedule = await getAllLiveScheduleForAdmin();

  return (
    <div className="space-y-6">
      <LiveScheduleForm />

      <div className="space-y-3">
        {schedule.map((s) => (
          <div key={s.id} className="rounded-card border border-ink/10 bg-white p-4">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">{s.title}</p>
              <DeleteButton
                action={deleteLiveScheduleEntry.bind(null, s.id)}
                className="text-xs font-medium text-red-600 hover:underline"
                successMessage="O'chirildi"
              />
            </div>
            <p className="text-sm text-ink-soft">{formatDateTimeUz(s.startAt)}</p>
            {s.note && <p className="mt-0.5 text-sm text-ink-soft">{s.note}</p>}
          </div>
        ))}
        {schedule.length === 0 && <p className="py-10 text-center text-ink-soft">Hozircha reja yo&apos;q</p>}
      </div>
    </div>
  );
}

async function CommentsTab({ sessionId }: { sessionId?: string }) {
  const sessions = await getAllLiveSessions();
  if (sessions.length === 0) {
    return <p className="py-16 text-center text-ink-soft">Hozircha hech qanday efir bo&apos;lib o&apos;tmagan</p>;
  }

  const activeId = sessionId && sessions.some((s) => s.id === sessionId) ? sessionId : sessions[0].id;
  const comments = await getAllLiveCommentsForAdmin(activeId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {sessions.map((s) => (
          <Link
            key={s.id}
            href={`/admin/live?tab=sharhlar&session=${s.id}`}
            className={`rounded-pill px-3 py-1.5 text-xs font-medium ${
              activeId === s.id
                ? "bg-primary text-white"
                : "border border-ink/10 text-ink-soft hover:border-primary hover:text-primary"
            }`}
          >
            {formatDateTimeUz(s.startedAt)} {!s.endedAt && "🔴"} ({s._count.comments})
          </Link>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm text-ink-soft">
          Javob yozish uchun{" "}
          <Link href="/live" className="font-medium text-primary hover:underline">
            Live sahifasiga
          </Link>{" "}
          o&apos;ting — har bir izoh ostida &quot;Javob yozish&quot; tugmasi chiqadi.
        </p>
        {comments.map((c) => (
          <div key={c.id} className="rounded-card border border-ink/10 bg-white p-4">
            <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-ink">{c.author.name}</span>
                <span className="text-ink-soft/60">•</span>
                <span className="text-ink-soft/60">{formatDateTimeUz(c.createdAt)}</span>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-sm text-ink-soft">{c.content}</p>

            {c.replies.length > 0 && (
              <div className="mt-3 space-y-2 border-l-2 border-primary/20 pl-3">
                {c.replies.map((r) => (
                  <p key={r.id} className="text-sm text-ink-soft">
                    <span className="font-semibold text-ink">{r.author.name}:</span> {r.content}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && <p className="py-16 text-center text-ink-soft">Hozircha izohlar yo&apos;q</p>}
      </div>
    </div>
  );
}
