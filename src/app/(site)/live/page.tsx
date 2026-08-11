import type { Metadata } from "next";
import { getLiveSettings, getUpcomingLiveSchedule, getAdContractSettings, getActiveBanners } from "@/lib/queries";
import { formatDateTimeUz } from "@/lib/utils";
import TwitchPlayer from "@/components/TwitchPlayer";
import CopyLinkButton from "@/components/CopyLinkButton";
import LiveCommentSection from "@/components/LiveCommentSection";
import LiveAdBanner from "@/components/LiveAdBanner";
import LiveStatusWatcher from "@/components/LiveStatusWatcher";

export const metadata: Metadata = { title: "Live" };
export const revalidate = 30;

export default async function LivePage() {
  const [settings, schedule, cardSettings, banners] = await Promise.all([
    getLiveSettings(),
    getUpcomingLiveSchedule(),
    getAdContractSettings(),
    getActiveBanners(),
  ]);

  const isLive = !!settings?.isLive && !!settings.twitchChannel;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <LiveStatusWatcher initialLive={isLive} />
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink sm:text-3xl">Live</h1>

      {isLive ? (
        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>
            <span className="text-sm font-semibold text-red-600">Jonli efirdamiz</span>
          </div>
          <TwitchPlayer channel={settings!.twitchChannel!} />
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-3 rounded-card border border-ink/10 bg-white px-5 py-4">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-ink/20" />
            <div>
              <p className="font-heading text-sm font-semibold text-ink">Hozircha jonli efir yo&apos;q</p>
              <p className="text-sm text-ink-soft">
                {schedule.length > 0
                  ? `Keyingi efir: ${schedule[0].title} — ${formatDateTimeUz(schedule[0].startAt)}`
                  : "Tez orada yangi efir haqida xabar beramiz."}
              </p>
            </div>
          </div>
          <LiveAdBanner banners={banners} />
        </>
      )}

      {schedule.length > 0 && (
        <section className="mb-8 rounded-card border border-ink/10 bg-white p-5 sm:p-6">
          <h2 className="mb-3 font-heading text-lg font-semibold text-ink">Kutilayotgan translatsiyalar</h2>
          <ul className="divide-y divide-ink/5">
            {schedule.map((s) => (
              <li key={s.id} className="py-3">
                <p className="font-medium text-ink">{s.title}</p>
                <p className="text-sm text-ink-soft">{formatDateTimeUz(s.startAt)}</p>
                {s.note && <p className="mt-0.5 text-sm text-ink-soft">{s.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mb-8 rounded-card border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <h2 className="mb-2 font-heading text-lg font-semibold text-ink">Efirni qo&apos;llab-quvvatlang</h2>
        {cardSettings?.cardNumber ? (
          <>
            <div className="mb-1 flex flex-wrap items-center gap-2 text-sm text-ink-soft">
              <span>
                Karta raqami: <span className="font-mono font-semibold text-ink">{cardSettings.cardNumber}</span>
              </span>
              <CopyLinkButton text={cardSettings.cardNumber} label="Nusxalash" />
            </div>
            <p className="text-sm text-ink-soft">
              Karta egasi: <span className="font-semibold text-ink">{cardSettings.cardHolderName}</span>
            </p>
          </>
        ) : (
          <p className="text-sm text-ink-soft">To&apos;lov ma&apos;lumotlari hali kiritilmagan.</p>
        )}
      </section>

      <LiveCommentSection />
    </div>
  );
}
