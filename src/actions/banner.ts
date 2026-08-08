"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const schema = z.object({
  imageUrl: z.string().min(1, "Rasm yuklang"),
  linkUrl: z.string().url("Havola noto'g'ri (https:// bilan boshlansin)"),
});

export async function updateBanner(formData: FormData) {
  await requireAdmin();
  const parsed = schema.parse(Object.fromEntries(formData));

  const existing = await prisma.banner.findFirst();
  if (existing) {
    await prisma.banner.update({ where: { id: existing.id }, data: parsed });
  } else {
    await prisma.banner.create({ data: parsed });
  }

  revalidatePath("/", "layout");
}

export async function deleteBanner() {
  await requireAdmin();
  await prisma.banner.deleteMany({});
  revalidatePath("/", "layout");
}
