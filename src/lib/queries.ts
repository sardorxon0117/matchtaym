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
  _count: { select: { comments: true } },
} satisfies Prisma.ArticleSelect;

export async function getFeed(page = 1) {
  const where: Prisma.ArticleWhereInput = { status: "PUBLISHED" };

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

/** Banners whose visibility window currently covers "now". */
export async function getActiveBanners() {
  const now = new Date();
  const scheduled = await prisma.banner.findMany({
    where: { isEnabled: true, isFallback: false, startAt: { lte: now }, endAt: { gte: now } },
    orderBy: { startAt: "asc" },
  });
  if (scheduled.length > 0) return scheduled;

  // Nothing scheduled for right now — show the "always on" fallback banner(s) instead.
  return prisma.banner.findMany({
    where: { isEnabled: true, isFallback: true },
    orderBy: { startAt: "asc" },
  });
}

export async function getAllBannersForAdmin() {
  return prisma.banner.findMany({ orderBy: { startAt: "desc" } });
}

export async function getBannerForEdit(id: string) {
  return prisma.banner.findUnique({ where: { id } });
}

export async function getCommentsForArticle(articleId: string) {
  const comments = await prisma.comment.findMany({
    where: { articleId },
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  type CommentWithAuthor = (typeof comments)[number];
  type CommentNode = CommentWithAuthor & { replies: CommentNode[] };

  const byId = new Map<string, CommentNode>();
  for (const c of comments) byId.set(c.id, { ...c, replies: [] });

  const roots: CommentNode[] = [];
  for (const c of comments) {
    const node = byId.get(c.id)!;
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function getDashboardStats() {
  const [articleCount, publishedCount, transferCount, totalViews, commentCount] = await Promise.all([
    prisma.article.count(),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.transfer.count(),
    prisma.article.aggregate({ _sum: { views: true } }),
    prisma.comment.count(),
  ]);
  return {
    articleCount,
    publishedCount,
    draftCount: articleCount - publishedCount,
    transferCount,
    totalViews: totalViews._sum.views ?? 0,
    commentCount,
  };
}

export async function getAdContracts() {
  return prisma.adContract.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAdContractById(id: string) {
  return prisma.adContract.findUnique({ where: { id } });
}

export async function getAdContractByToken(token: string) {
  return prisma.adContract.findUnique({ where: { token } });
}

export async function getAdContractSettings() {
  return prisma.adContractSettings.findUnique({ where: { id: "singleton" } });
}

export async function getDonationInquiries() {
  return prisma.donationInquiry.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getFeedbackList() {
  return prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getAllCommentsForAdmin(filter: "all" | "answered" | "pending" = "all") {
  const topLevel = await prisma.comment.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: {
      author: { select: { name: true, role: true } },
      article: { select: { title: true, slug: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, role: true } } },
      },
    },
  });

  if (filter === "answered") return topLevel.filter((c) => c.replies.length > 0);
  if (filter === "pending") return topLevel.filter((c) => c.replies.length === 0);
  return topLevel;
}

// --- Live ---

export async function getLiveSettings() {
  return prisma.liveSettings.findUnique({ where: { id: "singleton" } });
}

/** Upcoming broadcasts only, soonest first — for the public /live page. */
export async function getUpcomingLiveSchedule() {
  return prisma.liveSchedule.findMany({
    where: { startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
  });
}

export async function getAllLiveScheduleForAdmin() {
  return prisma.liveSchedule.findMany({ orderBy: { startAt: "desc" } });
}

/** Builds an arbitrary-depth reply tree, same approach as getCommentsForArticle. */
export async function getLiveComments() {
  const comments = await prisma.liveComment.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      author: { select: { id: true, name: true, image: true, role: true } },
    },
  });

  type LiveCommentWithAuthor = (typeof comments)[number];
  type LiveCommentNode = LiveCommentWithAuthor & { replies: LiveCommentNode[] };

  const byId = new Map<string, LiveCommentNode>();
  for (const c of comments) byId.set(c.id, { ...c, replies: [] });

  const roots: LiveCommentNode[] = [];
  for (const c of comments) {
    const node = byId.get(c.id)!;
    if (c.parentId && byId.has(c.parentId)) {
      byId.get(c.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export async function getAllLiveCommentsForAdmin(filter: "all" | "answered" | "pending" = "all") {
  const topLevel = await prisma.liveComment.findMany({
    where: { parentId: null },
    orderBy: { createdAt: "desc" },
    take: 300,
    include: {
      author: { select: { name: true, role: true } },
      replies: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { name: true, role: true } } },
      },
    },
  });

  if (filter === "answered") return topLevel.filter((c) => c.replies.length > 0);
  if (filter === "pending") return topLevel.filter((c) => c.replies.length === 0);
  return topLevel;
}
