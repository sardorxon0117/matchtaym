"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notifyNewDonationInquiry, notifyNewFeedback } from "@/lib/telegram";

const STAFF_ROLES = new Set(["ADMIN", "EDITOR"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readContact(formData: FormData): { name: string; email: string } | string {
  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  if (name.length < 2) return "Ismingizni kiriting";
  if (name.length > 120) return "Ism juda uzun";
  if (!EMAIL_RE.test(email)) return "Email manzil noto'g'ri";
  return { name, email };
}

async function requireStaff() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role ?? "";
  if (!session?.user || !STAFF_ROLES.has(role)) throw new Error("Ruxsat yo'q");
}

export async function submitDonationInquiry(_prevState: string | undefined, formData: FormData) {
  const contact = readContact(formData);
  if (typeof contact === "string") return contact;

  const message = ((formData.get("message") as string) ?? "").trim().slice(0, 2000) || null;

  await prisma.donationInquiry.create({
    data: { name: contact.name, email: contact.email, message },
  });

  await notifyNewDonationInquiry({ name: contact.name, email: contact.email, message });
  return undefined;
}

export async function submitFeedback(_prevState: string | undefined, formData: FormData) {
  const contact = readContact(formData);
  if (typeof contact === "string") return contact;

  const message = ((formData.get("message") as string) ?? "").trim();
  if (message.length < 5) return "Xabar juda qisqa";
  if (message.length > 3000) return "Xabar juda uzun";

  const typeRaw = (formData.get("type") as string) ?? "SUGGESTION";
  const type = typeRaw === "COMPLAINT" ? "COMPLAINT" : "SUGGESTION";

  await prisma.feedback.create({
    data: { name: contact.name, email: contact.email, message, type },
  });

  await notifyNewFeedback({ name: contact.name, email: contact.email, message, type });
  return undefined;
}

export async function deleteDonationInquiry(id: string) {
  await requireStaff();
  await prisma.donationInquiry.delete({ where: { id } });
  revalidatePath("/admin/donatsiyalar");
}

export async function deleteFeedback(id: string) {
  await requireStaff();
  await prisma.feedback.delete({ where: { id } });
  revalidatePath("/admin/taklif-shikoyat");
}
