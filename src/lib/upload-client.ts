const MAX_DIMENSION = 1920; // px, longer side
const JPEG_QUALITY = 0.85;
const SKIP_RESIZE_UNDER_BYTES = 700 * 1024; // already small enough, don't bother re-encoding
// Absolute ceiling for whatever ends up going to S3. A huge original that we
// couldn't compress (e.g. resize failed) would otherwise upload fine but
// then fail to render in real browsers — better to reject it up front than
// ship a "disappearing" image.
const HARD_MAX_BYTES = 15 * 1024 * 1024;

function getImageDimensions(file: File): Promise<{ width: number; height: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve(null);
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/**
 * Downscales/re-encodes oversized photos in the browser before upload —
 * a 12MB camera photo displayed at a few hundred pixels wide was taking
 * forever to load even on good connections. Falls back to the original
 * file if anything about this goes wrong (unsupported format, etc.).
 */
async function resizeImageIfNeeded(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") {
    return file;
  }
  if (file.size <= SKIP_RESIZE_UNDER_BYTES) return file;

  try {
    const dims = await getImageDimensions(file);
    if (!dims) return file;

    const scale = Math.min(1, MAX_DIMENSION / Math.max(dims.width, dims.height));

    // Small dimensions already, and file isn't huge — skip re-encoding.
    if (scale === 1 && file.size <= 2 * 1024 * 1024) return file;

    const targetW = Math.max(1, Math.round(dims.width * scale));
    const targetH = Math.max(1, Math.round(dims.height * scale));

    // Ask the browser to decode directly at the target resolution — a full-res
    // decode of a huge photo (tens of megapixels) can exhaust memory on phones
    // and silently fail, which is exactly what was shipping 40MB+ originals.
    const bitmap = await createImageBitmap(file, {
      resizeWidth: targetW,
      resizeHeight: targetH,
      resizeQuality: "high",
    });

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, targetW, targetH);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob || blob.size >= file.size) return file; // re-encode didn't help — keep the original

    return new File([blob], file.name.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
  } catch (err) {
    console.error("Image resize failed, falling back to original:", err);
    return file;
  }
}

/**
 * Uploads a file straight from the browser to S3 using a short-lived
 * presigned URL. The file never passes through our own server/Vercel
 * function, so there's no size limit on our side — S3 itself accepts a
 * single PUT up to 5GB.
 */
export async function uploadImageToS3(rawFile: File): Promise<string> {
  const file = await resizeImageIfNeeded(rawFile);

  if (file.size > HARD_MAX_BYTES) {
    throw new Error(
      `Rasmni siqib bo'lmadi va u hali ham juda katta (${(file.size / 1024 / 1024).toFixed(1)}MB). Boshqa yoki kichikroq rasm tanlab ko'ring.`
    );
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
