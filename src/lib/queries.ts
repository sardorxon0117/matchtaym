import "server-only";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 9;

const articleCard = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
  readTimeMin: true,
  views: true,
  category: { select: { name: true, slug: true } },
  author: { select: { name: true } },
} satisfies Prisma.ArticleSelect;

export async function getHeroAndFeed(page = 1) {
  const publishedWhere: Prisma.ArticleWhereInput = { status: "PUBLISHED" };

  const hero = page === 1
    ? await prisma.article.findFirst({
        where: publishedWhere,
        orderBy: { publishedAt: "desc" },
        select: articleCard,
      })
    : null;

  const excludeId = hero?.id;
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where: excludeId ? { ...publishedWhere, id: { not: excludeId } } : publishedWhere,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: articleCard,
    }),
    prisma.article.count({ where: publishedWhere }),
  ]);

  return { hero, items, total, pageSize: PAGE_SIZE };
}

export async function getArticlesByCategory(slug: string, page = 1) {
  const where: Prisma.ArticleWhereInput = {
    status: "PUBLISHED",
    category: { slug },
  };
  const [items, total, category] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: articleCard,
    }),
    prisma.article.count({ where }),
    prisma.category.findUnique({ where: { slug } }),
  ]);
  return { items, total, pageSize: PAGE_SIZE, category };
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findUnique({
    where: { slug },
    include: {
      category: true,
      author: { select: { name: true } },
      tags: true,
    },
  });
}

export async function incrementViews(id: string) {
  await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });
}

export async function getRelatedArticles(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  return prisma.article.findMany({
    where: { status: "PUBLISHED", categoryId, id: { not: excludeId } },
    orderBy: { publishedAt: "desc" },
    take: 3,
    select: articleCard,
  });
}

export async function searchArticles(q: string, page = 1) {
  const where: Prisma.ArticleWhereInput = {
    status: "PUBLISHED",
    OR: [
      { title: { contains: q, mode: "insensitive" } },
      { content: { contains: q, mode: "insensitive" } },
      { excerpt: { contains: q, mode: "insensitive" } },
    ],
  };
  const [items, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: articleCard,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total, pageSize: PAGE_SIZE };
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getTransfers(opts: {
  club?: string;
  league?: string;
  page?: number;
} = {}) {
  const page = opts.page ?? 1;
  const pageSize = 20;
  const where: Prisma.TransferWhereInput = {};
  if (opts.club) {
    where.OR = [
      { fromClub: { contains: opts.club, mode: "insensitive" } },
      { toClub: { contains: opts.club, mode: "insensitive" } },
    ];
  }
  if (opts.league) where.league = opts.league;

  const [items, total, leagues] = await Promise.all([
    prisma.transfer.findMany({
      where,
      orderBy: { date: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { relatedArticle: { select: { slug: true } } },
    }),
    prisma.transfer.count({ where }),
    prisma.transfer.findMany({
      select: { league: true },
      distinct: ["league"],
      where: { league: { not: null } },
    }),
  ]);

  return {
    items,
    total,
    pageSize,
    leagues: leagues.map((l) => l.league).filter(Boolean) as string[],
  };
}

// --- Admin listing helpers ---

export async function getAllArticlesForAdmin() {
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      views: true,
      publishedAt: true,
      createdAt: true,
      category: { select: { name: true } },
    },
  });
}

export async function getArticleForEdit(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: { tags: true, category: true },
  });
}

export async function getArticlesMinimal() {
  return prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true },
    take: 200,
  });
}

export async function getAllTransfersForAdmin() {
  return prisma.transfer.findMany({
    orderBy: { date: "desc" },
    include: { relatedArticle: { select: { title: true, slug: true } } },
  });
}

export async function getDashboardStats() {
  const [articleCount, publishedCount, transferCount, totalViews] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.transfer.count(),
    prisma.article.aggregate({ _sum: { views: true } }),
  ]);
  return {
    articleCount,
    publishedCount,
    draftCount: articleCount - publishedCount,
    transferCount,
    totalViews: totalViews._sum.views ?? 0,
  };
}
