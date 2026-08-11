"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { tashkentInputToUtcDate } from "@/lib/utils";
import { notifyNewLiveComment } from "@/lib/telegram";

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);

// --- Public: live comments ---

export async function createLiveComment(parentId: string | null, _prevState: string | undefined, formData: FormData) {
  const session = await auth();
  if (!session?.user) return "Izoh qoldirish uchun tizimga kiring";

  const content = ((formData.get("content") as string) ?? "").trim();
  if (content.length < 2) return "Izoh juda qisqa";
  if (content.length > 2000) return "Izoh juda uzun";

  await prisma.liveComment.create({
    data: { content, parentId, authorId: session.user.id },
  });

  await notifyNewLiveComment({
    authorName: session.user.name ?? session.user.email ?? "Foydalanuvchi",
    content,
    isReply: !!parentId,
  });

  revalidatePath("/live");
  return undefined;
}

export async function deleteLiveComment(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Ruxsat yo'q");

  const comment = await prisma.liveComment.findUnique({ where: { id } });
  if (!comment) return;

  const isOwner = comment.authorId === session.user.id;
  const role = (session.user as { role?: string }).role ?? "";
  const isStaff = STAFF_ROLES.has(role);
  if (!isOwner && !isStaff) throw new Error("Ruxsat yo'q");

  await prisma.liveComment.delete({ where: { id } });
  revalidatePath("/live");
}

// --- Admin: settings ---

export async function toggleLiveStatus(next: boolean) {
  await requireAdmin();
  await prisma.liveSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", isLive: next },
    update: { isLive: next },
  });
  revalidatePath("/live");
  revalidatePath("/admin/live");
}

export async function updateLiveSettings(_prevState: string | undefined, formData: FormData) {
  await requireAdmin();
  const twitchChannel = ((formData.get("twitchChannel") as string) ?? "").trim();
  if (!twitchChannel) return "Twitch kanal nomini kiriting";

  await prisma.liveSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", twitchChannel },
    update: { twitchChannel },
  });
  revalidatePath("/live");
  revalidatePath("/admin/live");
  return undefined;
}

// --- Admin: schedule ---

export async function createLiveScheduleEntry(formData: FormData) {
  await requireAdmin();

  const title = ((formData.get("title") as string) ?? "").trim();
  const startRaw = (formData.get("startAt") as string) ?? "";
  const note = ((formData.get("note") as string) ?? "").trim() || null;
  if (!title || !startRaw) throw new Error("Sarlavha va vaqtni kiriting");

  await prisma.liveSchedule.create({
    data: { title, startAt: tashkentInputToUtcDate(startRaw), note },
  });

  revalidatePath("/live");
  redirect("/admin/live?tab=jadval&created=1");
}

export async function deleteLiveScheduleEntry(id: string) {
  await requireAdmin();
  await prisma.liveSchedule.delete({ where: { id } });
  revalidatePath("/live");
  revalidatePath("/admin/live");
}
