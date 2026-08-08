import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CATEGORY_SEED } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://matchtaym.sardorkhon.me";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 5000,
  });

  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "hourly", priority: 1 },
    { url: `${siteUrl}/transferlar`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${siteUrl}/qidiruv`, changeFrequency: "weekly", priority: 0.3 },
    ...CATEGORY_SEED.map((c) => ({
      url: `${siteUrl}/kategoriya/${c.slug}`,
      changeFrequency: "hourly" as const,
      priority: 0.7,
    })),
  ];

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/maqola/${a.slug}`,
    lastModified: a.updatedAt,
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
