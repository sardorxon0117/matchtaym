import type { Banner } from "@/generated/prisma/client";
import { getTop5Fixtures } from "@/lib/football";
import { pickClosestFixtures } from "@/lib/match-format";
import HeroPromoBox from "./HeroPromoBox";

// Isolated in its own (Suspense-wrapped) component so a slow/unresponsive
// upstream API call can never block the rest of the page from rendering.
export default async function PromoBoxServer({ banners }: { banners: Banner[] }) {
  const fixtures = await getTop5Fixtures();
  const heroFixtures = pickClosestFixtures(fixtures, 3);
  return <HeroPromoBox matches={heroFixtures} banners={banners} />;
}
