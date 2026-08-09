"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { tashkentInputToUtcDate, formatDateTimeUz } from "@/lib/utils";
import { getBookedRanges, findConflict, calcTotalAmountUzs, formatUzs, getClientIp } from "@/lib/contract";
import { notifyContractSigned, notifyPaymentSubmitted } from "@/lib/telegram";

const MAX_DURATION_HOURS = 24 * 90; // 90 kun — oddiy xato bosishlardan himoya

function revalidateContract(token: string) {
  revalidatePath(`/shartnoma/${token}`);
  revalidatePath("/admin/reklama-shartnomalari");
}

// --- Admin: yaratish / sozlamalar / to'lovni boshqarish ---

export async function createAdContract(formData: FormData) {
  await requireAdmin();

  const hourlyRateUzs = Number(formData.get("hourlyRateUzs"));
  if (!Number.isFinite(hourlyRateUzs) || hourlyRateUzs <= 0) {
    throw new Error("Soatlik narx noto'g'ri");
  }

  const contract = await prisma.adContract.create({
    data: { hourlyRateUzs: Math.round(hourlyRateUzs) },
  });

  revalidatePath("/admin/reklama-shartnomalari");
  redirect(`/admin/reklama-shartnomalari/${contract.id}?created=1`);
}

export async function deleteAdContract(id: string) {
  await requireAdmin();
  await prisma.adContract.delete({ where: { id } });
  revalidatePath("/admin/reklama-shartnomalari");
}

export async function confirmPayment(id: string) {
  await requireAdmin();
  const contract = await prisma.adContract.update({
    where: { id },
    data: { status: "CONFIRMED", paymentConfirmedAt: new Date() },
  });
  revalidateContract(contract.token);
}

export async function rejectPayment(id: string, _prevState: string | undefined, formData: FormData) {
  await requireAdmin();
  const reason = ((formData.get("reason") as string) ?? "").trim();
  if (reason.length < 3) return "Rad etish sababini yozing";

  const contract = await prisma.adContract.update({
    where: { id },
    data: { status: "REJECTED", rejectedAt: new Date(), rejectReason: reason },
  });
  revalidateContract(contract.token);
  return undefined;
}

const settingsSchema = z.object({
  cardNumber: z.string().min(1, "Karta raqamini kiriting"),
  cardHolderName: z.string().min(1, "Karta egasining ismini kiriting"),
});

export async function updateAdContractSettings(_prevState: string | undefined, formData: FormData) {
  await requireAdmin();
  const parsed = settingsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return parsed.error.issues[0]?.message ?? "Ma'lumot noto'g'ri";

  await prisma.adContractSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...parsed.data },
    update: parsed.data,
  });
  revalidatePath("/admin/reklama-shartnomalari");
  return undefined;
}

// --- Reklama beruvchi: imzolash / to'lov ---

export async function signAdContract(token: string, _prevState: string | undefined, formData: FormData) {
  const contract = await prisma.adContract.findUnique({ where: { token } });
  if (!contract) return "Shartnoma topilmadi";
  if (contract.status !== "PENDING_SIGNATURE") return "Bu shartnoma allaqachon imzolangan";
  if (!contract.signerEmail) return "Avval Google orqali emailingizni tasdiqlang";

  const familiya = ((formData.get("familiya") as string) ?? "").trim();
  const ism = ((formData.get("ism") as string) ?? "").trim();
  const sharif = ((formData.get("sharif") as string) ?? "").trim();
  if (familiya.length < 2 || ism.length < 2) return "Familiya va ismingizni to'liq kiriting";

  const startRaw = (formData.get("startAt") as string) ?? "";
  const endRaw = (formData.get("endAt") as string) ?? "";
  if (!startRaw || !endRaw) return "Reklama ko'rinish vaqtini tanlang";

  const startAt = tashkentInputToUtcDate(startRaw);
  const endAt = tashkentInputToUtcDate(endRaw);
  if (!(endAt > startAt)) return "Tugash vaqti boshlanish vaqtidan keyin bo'lishi kerak";
  const durationHours = (endAt.getTime() - startAt.getTime()) / (60 * 60 * 1000);
  if (durationHours > MAX_DURATION_HOURS) return "Bu oraliq juda uzoq — qisqaroq muddat tanlang";

  if (formData.get("roziman") !== "on") return "Shartlarga rozilik bildirishingiz kerak";

  const booked = await getBookedRanges(contract.id);
  const conflict = findConflict(startAt, endAt, booked);
  if (conflict) {
    return `Bu vaqt oralig'i band: ${formatDateTimeUz(conflict.startAt)} — ${formatDateTimeUz(conflict.endAt)}. Boshqa vaqt tanlang.`;
  }

  const totalAmountUzs = calcTotalAmountUzs(contract.hourlyRateUzs, startAt, endAt);
  const signerName = [familiya, ism, sharif].filter(Boolean).join(" ");
  const agreedIp = await getClientIp();

  await prisma.adContract.update({
    where: { id: contract.id },
    data: {
      signerName,
      startAt,
      endAt,
      totalAmountUzs,
      status: "AWAITING_PAYMENT",
      agreedAt: new Date(),
      agreedIp,
    },
  });

  await notifyContractSigned({
    signerName,
    signerEmail: contract.signerEmail,
    startAt,
    endAt,
    amount: formatUzs(totalAmountUzs),
    adminUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/reklama-shartnomalari/${contract.id}`,
  });

  revalidateContract(token);
  return undefined;
}

export async function submitPayment(token: string, _prevState: string | undefined, formData: FormData) {
  const contract = await prisma.adContract.findUnique({ where: { token } });
  if (!contract) return "Shartnoma topilmadi";
  if (contract.status !== "AWAITING_PAYMENT" && contract.status !== "REJECTED") {
    return "Bu bosqichda chek yuklab bo'lmaydi";
  }

  const receiptUrl = (formData.get("receiptUrl") as string) ?? "";
  if (!receiptUrl) return "To'lov chekini yuklang";

  await prisma.adContract.update({
    where: { id: contract.id },
    data: {
      receiptUrl,
      status: "PAYMENT_SUBMITTED",
      paymentSubmittedAt: new Date(),
      rejectedAt: null,
      rejectReason: null,
    },
  });

  await notifyPaymentSubmitted({
    signerName: contract.signerName ?? "Noma'lum",
    amount: contract.totalAmountUzs ? formatUzs(contract.totalAmountUzs) : "—",
    adminUrl: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/reklama-shartnomalari/${contract.id}`,
  });

  revalidateContract(token);
  return undefined;
}
