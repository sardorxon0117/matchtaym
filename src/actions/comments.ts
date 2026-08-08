"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);

export async function createComment(
  articleId: string,
  parentId: string | null,
  _prevState: string | undefined,
  formData: FormData
) {
  const session = await auth();
  if (!session?.user) return "Izoh qoldirish uchun tizimga kiring";

  const content = ((formData.get("content") as string) ?? "").trim();
  if (content.length < 2) return "Izoh juda qisqa";
  if (content.length > 2000) return "Izoh juda uzun";

  await prisma.comment.create({
    data: { content, articleId, parentId, authorId: session.user.id },
  });

  revalidatePath("/maqola", "layout");
  return undefined;
}

export async function deleteComment(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Ruxsat yo'q");

  const comment = await prisma.comment.findUnique({ where: { id } });
  if (!comment) return;

  const isOwner = comment.authorId === session.user.id;
  const role = (session.user as { role?: string }).role ?? "";
  const isStaff = STAFF_ROLES.has(role);
  if (!isOwner && !isStaff) throw new Error("Ruxsat yo'q");

  await prisma.comment.delete({ where: { id } });
  revalidatePath("/maqola", "layout");
}
