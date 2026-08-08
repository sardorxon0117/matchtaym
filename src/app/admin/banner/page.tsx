import { getBanner } from "@/lib/queries";
import BannerForm from "@/components/admin/BannerForm";

export default async function AdminBannerPage() {
  const banner = await getBanner();

  return (
    <div>
      <h1 className="mb-2 font-heading text-2xl font-bold text-ink">Reklama banneri</h1>
      <p className="mb-6 text-sm text-ink-soft">
        Bitta banner butun saytda ko&apos;rinadi: telefonlarda header ostida, kompyuter/planshetlarda o&apos;ng
        tomonda. Yangi rasm yuklasangiz, eskisi almashtiriladi.
      </p>
      <BannerForm initialImageUrl={banner?.imageUrl ?? ""} initialLinkUrl={banner?.linkUrl ?? ""} />
    </div>
  );
}
