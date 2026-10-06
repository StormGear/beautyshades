import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";

const endpoint = process.env.AWS_ENDPOINT_URL_S3;
const region = process.env.AWS_REGION || "us-east-2";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
export const BUCKET_NAME = process.env.NEON_STORAGE_BUCKET || "shop";

export const s3 = new S3Client({
  endpoint,
  region,
  credentials:
    accessKeyId && secretAccessKey
      ? {
          accessKeyId,
          secretAccessKey,
        }
      : undefined,
  forcePathStyle: true,
});

export async function uploadToStorage(
  fileBuffer: Buffer | Uint8Array,
  filename: string,
  contentType: string = "image/jpeg",
  folder: string = "products"
): Promise<{ url: string; key: string }> {
  if (!endpoint) {
    throw new Error("AWS_ENDPOINT_URL_S3 is not configured in environment variables.");
  }

  const ext = filename.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = filename
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  const key = `${folder}/${safeName || "upload"}-${Date.now()}-${randomUUID().slice(0, 8)}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  const cleanEndpoint = endpoint.replace(/\/$/, "");
  const url = `${cleanEndpoint}/${BUCKET_NAME}/${key}`;

  return { url, key };
}

export async function deleteFromStorage(key: string): Promise<void> {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  );
}
