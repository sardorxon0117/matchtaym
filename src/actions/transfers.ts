"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const transferSchema = z.object({
  playerName: z.string().min(2, "O'yinchi ismi kiritilishi shart"),
  playerImage: z.string().optional(),
  fromClub: z.string().min(1, "Qaysi klubdan kiritilishi shart"),
  toClub: z.string().min(1, "Qaysi klubga kiritilishi shart"),
  fee: z.string().optional(),
  status: z.enum(["RUMOR", "CONFIRMED", "OFFICIAL"]),
  date: z.string().min(1),
  league: z.string().optional(),
  relatedArticleId: z.string().optional(),
});

export async function createTransfer(formData: FormData) {
  await requireAdmin();
  const parsed = transferSchema.parse(Object.fromEntries(formData));

  await prisma.transfer.create({
    data: {
      playerName: parsed.playerName,
      playerImage: parsed.playerImage || null,
      fromClub: parsed.fromClub,
      toClub: parsed.toClub,
      fee: parsed.fee || null,
      status: parsed.status,
      date: new Date(parsed.date),
      league: parsed.league || null,
      relatedArticleId: parsed.relatedArticleId || null,
    },
  });

  revalidatePath("/transferlar");
  revalidatePath("/admin/transferlar");
  redirect("/admin/transferlar");
}

export async function updateTransfer(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = transferSchema.parse(Object.fromEntries(formData));

  await prisma.transfer.update({
    where: { id },
    data: {
      playerName: parsed.playerName,
      playerImage: parsed.playerImage || null,
      fromClub: parsed.fromClub,
      toClub: parsed.toClub,
      fee: parsed.fee || null,
      status: parsed.status,
      date: new Date(parsed.date),
      league: parsed.league || null,
      relatedArticleId: parsed.relatedArticleId || null,
    },
  });

  revalidatePath("/transferlar");
  revalidatePath("/admin/transferlar");
  redirect("/admin/transferlar");
}

export async function deleteTransfer(id: string) {
  await requireAdmin();
  await prisma.transfer.delete({ where: { id } });
  revalidatePath("/transferlar");
  revalidatePath("/admin/transferlar");
}
