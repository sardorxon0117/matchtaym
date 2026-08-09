import type { Banner } from "@/generated/prisma/client";
import { getFeedMatches } from "@/lib/matches";
import { pickClosestMatches } from "@/lib/match-format";
import HeroPromoBox from "./HeroPromoBox";

// Isolated in its own (Suspense-wrapped) component so the slow third-party
// matches feed can never block the rest of the page from rendering.
export default async function PromoBoxServer({ banners }: { banners: Banner[] }) {
  const matches = await getFeedMatches();
  const heroMatches = pickClosestMatches(matches, 3);
  return <HeroPromoBox matches={heroMatches} banners={banners} />;
}
