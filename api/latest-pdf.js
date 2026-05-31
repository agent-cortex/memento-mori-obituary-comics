import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { get as getBlob } from "@vercel/blob";
import { facilitator } from "@coinbase/x402";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";
import { paymentMiddleware, x402ResourceServer } from "@x402/hono";
import { Hono } from "hono";

import {
  buildPdfHeaders,
  findLatestComicWithPdf,
  jsonError,
  resolveComicPdfBlobPath,
} from "./latest-pdf.helpers.js";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COMICS_JSON_PATH = path.join(ROOT_DIR, "comics.json");
const ENDPOINT_PATHS = ["/api/latest-pdf", "/api/latest-pdf/"];
const X402_NETWORK = "eip155:8453";
const X402_PRICE = "$0.10";

let cachedApp;

function isEvmAddress(value) {
  return /^0x[a-fA-F0-9]{40}$/.test(value || "");
}

function createApp(env = process.env, options = {}) {
  const app = new Hono();
  const payTo = env.X402_PAY_TO;
  const blobClient = options.blobClient || { get: getBlob };
  const facilitatorClient = options.facilitatorClient || new HTTPFacilitatorClient(facilitator);
  const syncFacilitatorOnStart = options.syncFacilitatorOnStart ?? true;

  if (!isEvmAddress(payTo)) {
    for (const endpointPath of ENDPOINT_PATHS) {
      app.get(endpointPath, () => jsonError("X402_PAY_TO must be a valid EVM address"));
    }
    return app;
  }

  const routes = Object.fromEntries(
    ENDPOINT_PATHS.map(endpointPath => [
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

  const resourceServer = new x402ResourceServer(facilitatorClient)
    .register(X402_NETWORK, new ExactEvmScheme());

  app.use(paymentMiddleware(routes, resourceServer, undefined, undefined, syncFacilitatorOnStart));

  for (const endpointPath of ENDPOINT_PATHS) {
    app.get(endpointPath, async () => {
      try {
        const comics = JSON.parse(await readFile(COMICS_JSON_PATH, "utf8"));
        const latestComic = findLatestComicWithPdf(comics);
        const pdfBlobPath = resolveComicPdfBlobPath(latestComic);
        const pdf = await blobClient.get(pdfBlobPath, { access: "private" });

        if (!pdf || pdf.statusCode !== 200) {
          throw new Error(`Latest PDF Blob not found: ${pdfBlobPath}`);
        }

        return new Response(pdf.stream, {
          headers: buildPdfHeaders(latestComic, pdf.blob.size),
        });
      } catch (error) {
        console.error("latest-pdf endpoint failed", error);
        return jsonError("Latest PDF is unavailable");
      }
    });
  }

  return app;
}

function getApp() {
  if (!cachedApp) {
    cachedApp = createApp();
  }
  return cachedApp;
}

export function GET(request) {
  return getApp().fetch(request);
}

export { createApp };
