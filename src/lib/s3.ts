import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.AWS_REGION!;
const bucket = process.env.AWS_S3_BUCKET!;

export const s3 = new S3Client({ region });

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export function publicUrlFor(key: string): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function keyFromUrl(url: string): string | null {
  const marker = `.amazonaws.com/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function uploadImage(file: File, folder = "uploads/articles"): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Faqat rasm fayllari qabul qilinadi (jpg, png, webp, avif, gif)");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Fayl hajmi 8MB dan oshmasligi kerak");
  }

  const ext = file.type.split("/")[1];
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return publicUrlFor(key);
}

export async function deleteImage(url: string): Promise<void> {
  const key = keyFromUrl(url);
  if (!key || !key.startsWith("uploads/")) return;
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
