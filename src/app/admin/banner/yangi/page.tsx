import { createBanner } from "@/actions/banner";
import BannerForm from "@/components/admin/BannerForm";

export default function NewBannerPage() {
  return (
    <div>
      <h1 className="mb-6 font-heading text-2xl font-bold text-ink">Yangi banner</h1>
      <BannerForm action={createBanner} />
    </div>
  );
}
