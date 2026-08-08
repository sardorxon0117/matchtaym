import { getBanner } from "@/lib/queries";
import BannerForm from "@/components/admin/BannerForm";

export default async function AdminBannerPage() {
  const banner = await getBanner();

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Reklama banneri</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Mobil va kompyuter/planshet uchun alohida rasm yuklaysiz — har biri o&apos;z joyiga moslashtirilgan
        o&apos;lchamda ko&apos;rinadi. Yangi rasm yuklasangiz, eskisi almashtiriladi.
      </p>
      <BannerForm
        initialMobileImageUrl={banner?.mobileImageUrl ?? ""}
        initialDesktopImageUrl={banner?.desktopImageUrl ?? ""}
        initialLinkUrl={banner?.linkUrl ?? ""}
      />
    </div>
  );
}
