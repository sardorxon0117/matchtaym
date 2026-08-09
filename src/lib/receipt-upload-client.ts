const HARD_MAX_BYTES = 10 * 1024 * 1024; // chek — rasm yoki PDF, kichik bo'lishi kerak

function putWithProgress(url: string, file: File, onProgress?: (percent: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error("Saqlab bo'lmadi, qayta urinib ko'ring"));
    };
    xhr.onerror = () => reject(new Error("Tarmoq xatosi — internetni tekshirib, qayta urinib ko'ring"));

    xhr.send(file);
  });
}

/** Uploads a payment receipt (image or PDF) straight to S3, scoped to one contract token. */
export async function uploadReceiptToS3(
  file: File,
  token: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  if (file.size > HARD_MAX_BYTES) {
    throw new Error(`Fayl hajmi juda katta (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal: 10MB.`);
  }

  const presignRes = await fetch("/api/shartnoma/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, token }),
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

  await putWithProgress(presignData.uploadUrl, file, onProgress);

  return presignData.publicUrl;
}
