import { readFile } from "node:fs/promises";
import path from "node:path";

import { facilitator } from "@coinbase/x402";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { Hono } from "hono";

const ROOT_DIR = process.cwd();
const X402_NETWORK = "eip155:8453";
const X402_PRICE = "$0.10";
const ENDPOINT_PATHS = ["/api/latest-pdf", "/api/latest-pdf/"];

let cachedApp;

export function findLatestComicWithPdf(comics) {
  if (!Array.isArray(comics)) throw new TypeError("Expected comics to be an array");

  let latest = null;
  let latestTime = Number.NEGATIVE_INFINITY;
  for (const comic of comics) {
    if (!comic || typeof comic !== "object" || !comic.pdf) continue;
    const publishedTime = Date.parse(comic.published_at || "");
    const sortableTime = Number.isNaN(publishedTime) ? Number.NEGATIVE_INFINITY : publishedTime;
    if (!latest || sortableTime > latestTime) {
      latest = comic;
      latestTime = sortableTime;
    }
  }
  if (!latest) throw new Error("No published comic PDF found");
  return latest;
}

export function resolveComicPdfPath(comic, rootDir = ROOT_DIR) {
  if (!comic?.slug || !comic?.pdf) throw new Error("Comic PDF metadata is incomplete");
  if (path.basename(comic.pdf) !== comic.pdf) throw new Error("Unsafe PDF filename");
  return path.join(rootDir, "public", "comics", comic.slug, comic.pdf);
}

export function buildPdfHeaders(comic, contentLength) {
  const filename = path.basename(comic.pdf);
  return {
    "Cache-Control": "private, no-store",
    "Content-Disposition": `inline; filename="${filename}"`,
    "Content-Length": String(contentLength),
    "Content-Type": "application/pdf",
    "X-Comic-Slug": comic.slug,
  };
}

export function jsonError(message, status = 500) {
  return Response.json({ error: message }, { status });
}

function isEvmAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value || "");
}

export function createApp(env = process.env, options = {}) {
  const app = new Hono();
  const payTo = env.X402_PAY_TO;
  const facilitatorClient = options.facilitatorClient || new HTTPFacilitatorClient(facilitator);
  const syncFacilitatorOnStart = options.syncFacilitatorOnStart ?? true;

  if (!isEvmAddress(payTo)) {
    for (const endpointPath of ENDPOINT_PATHS) {
      app.get(endpointPath, () => jsonError("X402_PAY_TO must be a valid EVM address"));
    }
    return app;
  }

  const routes = Object.fromEntries(
    ENDPOINT_PATHS.map((endpointPath) => [
      `GET ${endpointPath}`,
      {
        accepts: [
          {
            scheme: "exact",
            price: X402_PRICE,
            network: X402_NETWORK,
            payTo,
          },
        ],
        description: "Latest Memento Mori Obituary Comic PDF",
        mimeType: "application/pdf",
      },
    ]),
  );

  const resourceServer = new x402ResourceServer(facilitatorClient).register(X402_NETWORK, new ExactEvmScheme());
  app.use(paymentMiddleware(routes, resourceServer, undefined, undefined, syncFacilitatorOnStart));

  for (const endpointPath of ENDPOINT_PATHS) {
    app.get(endpointPath, async () => {
      try {
        const comics = JSON.parse(await readFile(path.join(ROOT_DIR, "comics.json"), "utf8"));
        const latestComic = findLatestComicWithPdf(comics);
        const pdfPath = resolveComicPdfPath(latestComic, ROOT_DIR);
        const pdf = await readFile(pdfPath);
        return new Response(pdf, { headers: buildPdfHeaders(latestComic, pdf.byteLength) });
      } catch (error) {
        console.error("latest-pdf endpoint failed", error);
        return jsonError("Latest PDF is unavailable");
      }
    });
  }

  return app;
}

export function getApp() {
  if (!cachedApp) cachedApp = createApp();
  return cachedApp;
}
