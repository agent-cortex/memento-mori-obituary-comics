import { createHash, createPrivateKey, createPublicKey, sign as signData, verify as verifyData } from "node:crypto";

export const DEFAULT_BLOB_UPLOAD_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEANro2H9snB1kCR+CxW9+EnHk8su+8UySiyRM5Im2Wha8=
-----END PUBLIC KEY-----`;

const MAX_CLOCK_SKEW_MS = 10 * 60 * 1000;

export function sha256Hex(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

export function canonicalBlobUploadMessage({ blobPath, contentType, sha256, size, timestamp }) {
  return [String(timestamp), blobPath, contentType, sha256, String(size)].join("\n");
}

export function signBlobUpload({ metadata, privateKeyPem }) {
  const privateKey = createPrivateKey(privateKeyPem);
  const message = canonicalBlobUploadMessage(metadata);
  return signData(null, Buffer.from(message), privateKey).toString("base64");
}

export function verifyBlobUploadSignature({ metadata, publicKeyPem, signatureBase64 }) {
  const publicKey = createPublicKey(publicKeyPem || DEFAULT_BLOB_UPLOAD_PUBLIC_KEY);
  const message = canonicalBlobUploadMessage(metadata);
  return verifyData(null, Buffer.from(message), publicKey, Buffer.from(signatureBase64, "base64"));
}

export function assertFreshTimestamp(timestamp, now = Date.now()) {
  const parsed = Number(timestamp);
  if (!Number.isFinite(parsed)) throw new Error("Invalid upload timestamp");
  if (Math.abs(now - parsed) > MAX_CLOCK_SKEW_MS) throw new Error("Upload signature expired");
  return parsed;
}
