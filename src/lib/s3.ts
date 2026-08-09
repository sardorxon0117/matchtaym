import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const region = process.env.AWS_REGION!;
const bucket = process.env.AWS_S3_BUCKET!;

export const s3 = new S3Client({ region });

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);
export const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB — uploads go straight to S3, no server body limit

export function publicUrlFor(key: string): string {
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function keyFromUrl(url: string): string | null {
  const marker = `.amazonaws.com/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

// Browser uploads directly to S3 with this URL — the file never passes
// through our own server, so Vercel's ~4.5MB function body limit (which was
// causing "Request Entity Too Large" / invalid-JSON errors on real photos)
// no longer applies.
export async function createPresignedUpload(
  contentType: string,
  folder = "uploads/articles"
): Promise<{ uploadUrl: string; publicUrl: string }> {
  if (!ALLOWED_TYPES.has(contentType)) {
    throw new Error("Faqat rasm fayllari qabul qilinadi (jpg, png, webp, avif, gif)");
  }

  const ext = contentType.split("/")[1];
  const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
    { expiresIn: 60 }
  );

  return { uploadUrl, publicUrl: publicUrlFor(key) };
}

export async function deleteImage(url: string): Promise<void> {
  const key = keyFromUrl(url);
  if (!key || !key.startsWith("uploads/")) return;
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
