import type { Banner } from "@/generated/prisma/client";
import { getTop5Fixtures, PROMO_LEAGUE_IDS } from "@/lib/football";
import { pickOnePerLeague } from "@/lib/match-format";
import HeroPromoBox from "./HeroPromoBox";

// Isolated in its own (Suspense-wrapped) component so a slow/unresponsive
// upstream API call can never block the rest of the page from rendering.
export default async function PromoBoxServer({ banners }: { banners: Banner[] }) {
  const fixtures = await getTop5Fixtures();
  // One match each from Premier League, La Liga and Bundesliga.
  const heroFixtures = pickOnePerLeague(fixtures, PROMO_LEAGUE_IDS);
  return <HeroPromoBox matches={heroFixtures} banners={banners} />;
}
