import { notFound } from "next/navigation";
import { getBannerForEdit } from "@/lib/queries";
import { updateBanner, deleteBanner } from "@/actions/banner";
import BannerForm from "@/components/admin/BannerForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const banner = await getBannerForEdit(id);
  if (!banner) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-ink">Bannerni tahrirlash</h1>
        <DeleteButton action={deleteBanner.bind(null, banner.id)} successMessage="Banner o&apos;chirildi">O&apos;chirish</DeleteButton>
      </div>
      <BannerForm
        action={updateBanner.bind(null, banner.id)}
        initial={{
          mobileImageUrl: banner.mobileImageUrl,
          desktopImageUrl: banner.desktopImageUrl,
          linkUrl: banner.linkUrl,
          startAt: banner.startAt,
          endAt: banner.endAt,
        }}
      />
    </div>
  );
}
