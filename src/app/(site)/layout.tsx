import { auth } from "@/auth";
import { getActiveBanners } from "@/lib/queries";
import { getFeedMatches } from "@/lib/matches";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileAdBanner from "@/components/MobileAdBanner";
import HeroPromoBox from "@/components/HeroPromoBox";
import type { HeaderUser } from "@/components/UserMenu";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [session, banners, matches] = await Promise.all([auth(), getActiveBanners(), getFeedMatches()]);

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
      <Header user={user} />
      <MobileAdBanner banners={banners} />

      <div className="mx-auto flex w-full max-w-[88rem] items-start gap-6 px-0 md:px-6">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="sticky top-20 hidden w-[300px] shrink-0 py-8 md:block">
          <HeroPromoBox matches={matches} banners={banners} />
        </aside>
      </div>

      <Footer />
    </>
  );
}
