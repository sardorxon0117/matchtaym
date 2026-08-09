import { auth } from "@/auth";
import { getBanner } from "@/lib/queries";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MobileAdBanner, DesktopAdBanner } from "@/components/AdBanner";
import TodayMatchesWidget from "@/components/TodayMatchesWidget";
import type { HeaderUser } from "@/components/UserMenu";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [session, banner] = await Promise.all([auth(), getBanner()]);

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
      <MobileAdBanner banner={banner} />

      <div className="mx-auto flex w-full max-w-[88rem] items-start gap-6 px-0 md:px-6">
        <div className="min-w-0 flex-1">{children}</div>
        <aside className="sticky top-20 hidden w-[300px] shrink-0 space-y-4 py-8 md:block">
          <DesktopAdBanner banner={banner} />
          <TodayMatchesWidget />
        </aside>
      </div>

      <Footer />
    </>
  );
}
