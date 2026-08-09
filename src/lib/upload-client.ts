const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB — keep in sync with lib/s3.ts

/**
 * Uploads a file straight from the browser to S3 using a short-lived
 * presigned URL. The file never passes through our own server/Vercel
 * function, so there's no request-body size limit to hit.
 */
export async function uploadImageToS3(file: File): Promise<string> {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Fayl hajmi 8MB dan oshmasligi kerak");
  }

  const presignRes = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type }),
  });

  let presignData: { uploadUrl?: string; publicUrl?: string; error?: string };
  try {
    presignData = await presignRes.json();
  } catch {
    throw new Error("Server javobi noto'g'ri keldi, qayta urinib ko'ring");
  }

  if (!presignRes.ok || !presignData.uploadUrl || !presignData.publicUrl) {
    throw new Error(presignData.error ?? "Yuklashda xatolik");
  }

  const putRes = await fetch(presignData.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("Rasmni saqlab bo'lmadi, qayta urinib ko'ring");
  }

  return presignData.publicUrl;
}
