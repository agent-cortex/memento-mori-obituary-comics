import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";

import { POST } from "../app/api/admin/blob-upload/route.js";
import { sha256Hex, signBlobUpload, verifyBlobUploadSignature } from "../lib/blob-upload-auth.js";

function testKeys() {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  return {
    privateKeyPem: privateKey.export({ format: "pem", type: "pkcs8" }),
    publicKeyPem: publicKey.export({ format: "pem", type: "spki" }),
  };
}

test("signed Blob upload metadata verifies with the matching public key", () => {
  const { privateKeyPem, publicKeyPem } = testKeys();
  const buffer = Buffer.from("fake image bytes");
  const metadata = {
    blobPath: "comics/test/pages/01-test.jpg",
    contentType: "image/jpeg",
    sha256: sha256Hex(buffer),
    size: buffer.length,
    timestamp: Date.now(),
  };

  const signatureBase64 = signBlobUpload({ metadata, privateKeyPem });
  assert.equal(verifyBlobUploadSignature({ metadata, publicKeyPem, signatureBase64 }), true);
  assert.equal(verifyBlobUploadSignature({
    metadata: { ...metadata, size: metadata.size + 1 },
    publicKeyPem,
    signatureBase64,
  }), false);
});

test("POST /api/admin/blob-upload accepts signed comic assets", async () => {
  const { privateKeyPem, publicKeyPem } = testKeys();
  const previousPublicKey = process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY;
  process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY = publicKeyPem;

  const buffer = Buffer.from("fake jpeg bytes");
  const metadata = {
    blobPath: "comics/test/pages/01-test.jpg",
    contentType: "image/jpeg",
    sha256: sha256Hex(buffer),
    size: buffer.length,
    timestamp: Date.now(),
  };
  const signatureBase64 = signBlobUpload({ metadata, privateKeyPem });
  const uploads = [];

  try {
    const response = await POST(new Request("https://www.finalnotes.page/api/admin/blob-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...metadata,
        dataBase64: buffer.toString("base64"),
        signatureBase64,
      }),
    }), {
      blobClient: {
        put: async (...args) => uploads.push(args),
      },
    });

    assert.equal(response.status, 200);
    assert.equal(uploads.length, 1);
    assert.equal(uploads[0][0], metadata.blobPath);
    assert.equal(Buffer.compare(uploads[0][1], buffer), 0);
    assert.equal(uploads[0][2].access, "private");
    assert.equal(uploads[0][2].addRandomSuffix, false);
  } finally {
    if (previousPublicKey === undefined) delete process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY;
    else process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY = previousPublicKey;
  }
});

test("POST /api/admin/blob-upload rejects invalid signatures", async () => {
  const { publicKeyPem } = testKeys();
  const previousPublicKey = process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY;
  process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY = publicKeyPem;

  try {
    const response = await POST(new Request("https://www.finalnotes.page/api/admin/blob-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        blobPath: "comics/test/pages/01-test.jpg",
        contentType: "image/jpeg",
        sha256: "bad",
        size: 3,
        timestamp: Date.now(),
        dataBase64: Buffer.from("bad").toString("base64"),
        signatureBase64: Buffer.from("not a real signature").toString("base64"),
      }),
    }), {
      blobClient: { put: async () => assert.fail("should not upload") },
    });

    assert.equal(response.status, 401);
  } finally {
    if (previousPublicKey === undefined) delete process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY;
    else process.env.FINALNOTES_BLOB_UPLOAD_PUBLIC_KEY = previousPublicKey;
  }
});
