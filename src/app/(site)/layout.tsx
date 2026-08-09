import { Suspense } from "react";
import { auth } from "@/auth";
import { getActiveBanners } from "@/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileAdBanner from "@/components/MobileAdBanner";
import PromoBoxServer from "@/components/PromoBoxServer";
import PromoBoxSkeleton from "@/components/PromoBoxSkeleton";
import type { HeaderUser } from "@/components/UserMenu";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Only fast, first-party data here (auth + our own DB) — the slow
  // third-party matches feed lives inside PromoBoxServer's own Suspense
  // boundary below, so it can never block the rest of the page.
  const [session, banners] = await Promise.all([auth(), getActiveBanners()]);

  const user: HeaderUser | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? session.user.email ?? "Foydalanuvchi",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
        role: session.user.role,
      }
    : null;

  return (
    <>
      <div className="print:hidden">
        <Header user={user} />
        <MobileAdBanner banners={banners} />
      </div>

      <div className="mx-auto flex w-full max-w-[90rem] items-start gap-6 px-0 md:px-6">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="sticky top-20 hidden w-[340px] shrink-0 py-8 md:block print:hidden">
          <Suspense fallback={<PromoBoxSkeleton />}>
            <PromoBoxServer banners={banners} />
          </Suspense>
        </aside>
      </div>

      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
