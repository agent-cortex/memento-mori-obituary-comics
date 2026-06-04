import { put as putBlob } from "@vercel/blob";

import { assertSafeBlobPath, contentTypeForBlobPath } from "../../../../lib/blob-media.js";
import {
  assertFreshTimestamp,
  DEFAULT_BLOB_UPLOAD_PUBLIC_KEY,
  sha256Hex,
  verifyBlobUploadSignature,
} from "../../../../lib/blob-upload-auth.js";

const ONE_YEAR = 31536000;
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function jsonError(message, status) {
  return Response.json({ error: message }, { status });
}

function publicKeyPem() {
  return process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY || DEFAULT_BLOB_UPLOAD_PUBLIC_KEY;
}

export async function POST(request, { blobClient = { put: putBlob } } = {}) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const blobPath = String(body?.blobPath || "");
  const contentType = String(body?.contentType || "");
  const dataBase64 = String(body?.dataBase64 || "");
  const signatureBase64 = String(body?.signatureBase64 || "");
  const timestamp = body?.timestamp;

  if (!blobPath || !contentType || !dataBase64 || !signatureBase64 || !timestamp) {
    return jsonError("Missing upload fields", 400);
  }

  let safeBlobPath;
  try {
    safeBlobPath = assertSafeBlobPath(blobPath);
    assertFreshTimestamp(timestamp);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Invalid upload metadata", 400);
  }

  const expectedContentType = contentTypeForBlobPath(safeBlobPath);
  if (!contentType.toLowerCase().startsWith(expectedContentType.toLowerCase())) {
    return jsonError(`Invalid content type for ${safeBlobPath}`, 400);
  }

  const buffer = Buffer.from(dataBase64, "base64");
  if (!buffer.length) return jsonError("Empty upload body", 400);
  if (buffer.length > MAX_UPLOAD_BYTES) return jsonError("Upload body too large", 413);

  const metadata = {
    blobPath: safeBlobPath,
    contentType: expectedContentType,
    sha256: sha256Hex(buffer),
    size: buffer.length,
    timestamp: Number(timestamp),
  };

  const verified = verifyBlobUploadSignature({
    metadata,
    publicKeyPem: publicKeyPem(),
    signatureBase64,
  });

  if (!verified) return jsonError("Invalid upload signature", 401);

  try {
    await blobClient.put(safeBlobPath, buffer, {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: ONE_YEAR,
      contentType: expectedContentType,
    });
  } catch (error) {
    console.error("signed blob upload failed", error);
    return jsonError("Blob upload failed", 502);
  }

  return Response.json({ ok: true, blobPath: safeBlobPath, size: buffer.length });
}
