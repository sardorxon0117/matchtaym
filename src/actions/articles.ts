"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toSlug, calcReadTime } from "@/lib/utils";
import { deleteImage } from "@/lib/s3";

const articleSchema = z.object({
  title: z.string().min(3, "Sarlavha kamida 3 belgi bo'lishi kerak"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Matn juda qisqa"),
  coverImage: z.string().optional(),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
});

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.article.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

async function resolveTags(tagsCsv?: string) {
  const names = (tagsCsv ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const tags = [];
  for (const name of names) {
    const slug = toSlug(name);
    const tag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
    tags.push({ id: tag.id });
  }
  return tags;
}

export async function createArticle(formData: FormData) {
  const user = await requireAdmin();
  const parsed = articleSchema.parse(Object.fromEntries(formData));

  const baseSlug = toSlug(parsed.slug?.trim() || parsed.title);
  const slug = await uniqueSlug(baseSlug);
  const tags = await resolveTags(parsed.tags);

  const article = await prisma.article.create({
    data: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
      status: parsed.status,
      publishedAt: parsed.status === "PUBLISHED" ? new Date() : null,
      readTimeMin: calcReadTime(parsed.content),
      metaTitle: parsed.metaTitle || null,
      metaDesc: parsed.metaDesc || null,
      categoryId: parsed.categoryId || null,
      authorId: user.id,
      tags: { connect: tags },
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/maqolalar");
  redirect(`/admin/maqolalar/${article.id}`);
}

export async function updateArticle(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = articleSchema.parse(Object.fromEntries(formData));

  const existing = await prisma.article.findUniqueOrThrow({ where: { id } });
  const baseSlug = toSlug(parsed.slug?.trim() || parsed.title);
  const slug = baseSlug === existing.slug ? existing.slug : await uniqueSlug(baseSlug, id);
  const tags = await resolveTags(parsed.tags);

  const becamePublished = parsed.status === "PUBLISHED" && existing.status !== "PUBLISHED";

  await prisma.article.update({
    where: { id },
    data: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt || null,
      content: parsed.content,
      coverImage: parsed.coverImage || null,
      status: parsed.status,
      publishedAt: becamePublished ? new Date() : existing.publishedAt,
      readTimeMin: calcReadTime(parsed.content),
      metaTitle: parsed.metaTitle || null,
      metaDesc: parsed.metaDesc || null,
      categoryId: parsed.categoryId || null,
      tags: { set: tags },
    },
  });

  revalidatePath("/");
  revalidatePath(`/maqola/${slug}`);
  revalidatePath("/admin/maqolalar");
}

export async function deleteArticle(id: string) {
  await requireAdmin();
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return;

  await prisma.article.delete({ where: { id } });
  if (article.coverImage) {
    await deleteImage(article.coverImage).catch(() => {});
  }

  revalidatePath("/");
  revalidatePath("/admin/maqolalar");
}
