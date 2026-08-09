import Link from "next/link";
import Image from "next/image";
import { getAllBannersForAdmin } from "@/lib/queries";
import { deleteBanner } from "@/actions/banner";
import { formatDateTimeUz } from "@/lib/utils";
import DeleteButton from "@/components/admin/DeleteButton";

function status(startAt: Date, endAt: Date): { label: string; className: string } {
  const now = new Date();
  if (now < startAt) return { label: "Rejalashtirilgan", className: "bg-amber-100 text-amber-700" };
  if (now > endAt) return { label: "Tugagan", className: "bg-ink/10 text-ink-soft" };
  return { label: "Faol", className: "bg-green-100 text-green-700" };
}

export default async function AdminBannerListPage() {
  const banners = await getAllBannersForAdmin();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Reklama bannerlari</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Bir nechta banner qo&apos;shishingiz mumkin — har biri o&apos;z vaqt oralig&apos;ida ko&apos;rinadi. Bir
            vaqtning o&apos;zida bir nechtasi faol bo&apos;lsa, ular 5 daqiqada almashib turadi.
          </p>
        </div>
        <Link href="/admin/banner/yangi" className="whitespace-nowrap rounded-pill bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
          + Yangi banner
        </Link>
      </div>

      <div className="space-y-3">
        {banners.map((b) => {
          const s = status(b.startAt, b.endAt);
          return (
            <div key={b.id} className="flex flex-wrap items-center gap-4 rounded-card border border-ink/10 bg-white p-4">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-ink/5">
                <Image src={b.desktopImageUrl} alt="" fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${s.className}`}>{s.label}</span>
                <p className="truncate text-sm text-ink-soft">{b.linkUrl}</p>
                <p className="text-xs text-ink-soft/60">
                  {formatDateTimeUz(b.startAt)} — {formatDateTimeUz(b.endAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link href={`/admin/banner/${b.id}`} className="text-sm font-medium text-primary hover:underline">
                  Tahrirlash
                </Link>
                <DeleteButton action={deleteBanner.bind(null, b.id)} />
              </div>
            </div>
          );
        })}
        {banners.length === 0 && (
          <p className="py-16 text-center text-ink-soft">Hozircha bannerlar yo&apos;q</p>
        )}
      </div>
    </div>
  );
}
