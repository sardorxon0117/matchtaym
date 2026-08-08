"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { toSlug } from "@/lib/utils";

const categorySchema = z.object({
  name: z.string().min(2, "Nom kamida 2 belgi bo'lishi kerak"),
});

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse(Object.fromEntries(formData));
  const slug = toSlug(parsed.name);

  await prisma.category.upsert({
    where: { slug },
    update: { name: parsed.name },
    create: { name: parsed.name, slug },
  });

  revalidatePath("/admin/kategoriyalar");
  revalidatePath("/");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } }).catch(() => {
    throw new Error("Bu kategoriyada maqolalar bor, avval ularni ko'chiring");
  });
  revalidatePath("/admin/kategoriyalar");
  revalidatePath("/");
}
