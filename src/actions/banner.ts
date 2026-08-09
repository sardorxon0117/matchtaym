"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { tashkentInputToUtcDate } from "@/lib/utils";

const schema = z
  .object({
    mobileImageUrl: z.string().min(1, "Mobil uchun rasm yuklang"),
    desktopImageUrl: z.string().min(1, "Kompyuter uchun rasm yuklang"),
    linkUrl: z.string().url("Havola noto'g'ri (https:// bilan boshlansin)"),
    startAt: z.string().min(1, "Boshlanish vaqtini kiriting"),
    endAt: z.string().min(1, "Tugash vaqtini kiriting"),
  })
  .refine((data) => tashkentInputToUtcDate(data.endAt) > tashkentInputToUtcDate(data.startAt), {
    message: "Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak",
    path: ["endAt"],
  });

export async function createBanner(formData: FormData) {
  await requireAdmin();
  const parsed = schema.parse(Object.fromEntries(formData));
  const isFallback = formData.get("isFallback") === "on";

  await prisma.banner.create({
    data: {
      mobileImageUrl: parsed.mobileImageUrl,
      desktopImageUrl: parsed.desktopImageUrl,
      linkUrl: parsed.linkUrl,
      startAt: tashkentInputToUtcDate(parsed.startAt),
      endAt: tashkentInputToUtcDate(parsed.endAt),
      isFallback,
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin/banner?created=1");
}

export async function updateBanner(id: string, formData: FormData) {
  await requireAdmin();
  const parsed = schema.parse(Object.fromEntries(formData));
  const isFallback = formData.get("isFallback") === "on";

  await prisma.banner.update({
    where: { id },
    data: {
      mobileImageUrl: parsed.mobileImageUrl,
      desktopImageUrl: parsed.desktopImageUrl,
      linkUrl: parsed.linkUrl,
      startAt: tashkentInputToUtcDate(parsed.startAt),
      endAt: tashkentInputToUtcDate(parsed.endAt),
      isFallback,
    },
  });

  revalidatePath("/", "layout");
  redirect("/admin/banner?saved=1");
}

export async function toggleBannerEnabled(id: string, next: boolean) {
  await requireAdmin();
  await prisma.banner.update({ where: { id }, data: { isEnabled: next } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/banner");
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/", "layout");
}
