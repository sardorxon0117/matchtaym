import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadImage } from "@/lib/s3";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fayl topilmadi" }, { status: 400 });
  }

  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yuklashda xatolik";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
