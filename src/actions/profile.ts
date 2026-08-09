"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Ism kamida 2 belgi bo'lishi kerak"),
  image: z.string().optional(),
});

export async function updateProfile(_prevState: string | undefined, formData: FormData) {
  const session = await auth();
  if (!session?.user) return "Bu amal uchun tizimga kiring";

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Ma'lumotlar noto'g'ri";

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: parsed.data.name,
      image: parsed.data.image || null,
    },
  });

  revalidatePath("/", "layout");
  return undefined;
}
