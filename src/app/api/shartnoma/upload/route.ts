import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPresignedUpload } from "@/lib/s3";

// Deliberately NOT gated by a NextAuth session (advertisers never get one) —
// instead, authorization is "do you hold the contract's own unguessable
// token, and is it currently in a state where uploading a receipt makes
// sense". Same trust model as the rest of the /shartnoma/[token] flow.
export async function POST(req: Request) {
  let body: { contentType?: string; token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  if (!body.contentType || !body.token) {
    return NextResponse.json({ error: "Ma'lumot yetishmayapti" }, { status: 400 });
  }

  const contract = await prisma.adContract.findUnique({ where: { token: body.token } });
  if (!contract) {
    return NextResponse.json({ error: "Shartnoma topilmadi" }, { status: 404 });
  }
  if (contract.status !== "AWAITING_PAYMENT" && contract.status !== "REJECTED") {
    return NextResponse.json({ error: "Bu bosqichda fayl yuklab bo'lmaydi" }, { status: 400 });
  }

  try {
    const { uploadUrl, publicUrl } = await createPresignedUpload(body.contentType, "uploads/shartnoma-cheklar");
    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yuklashda xatolik";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
