import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createPresignedUpload } from "@/lib/s3";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  let body: { contentType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Noto'g'ri so'rov" }, { status: 400 });
  }

  if (!body.contentType) {
    return NextResponse.json({ error: "contentType kerak" }, { status: 400 });
  }

  try {
    const { uploadUrl, publicUrl } = await createPresignedUpload(body.contentType);
    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yuklashda xatolik";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
