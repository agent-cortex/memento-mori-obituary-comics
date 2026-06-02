import assert from "node:assert/strict";
import test from "node:test";

import { createApp } from "../lib/latest-pdf.js";

const PAY_TO = "0x000000000000000000000000000000000000dEaD";

test("GET /api/latest-pdf returns an x402 payment challenge", async () => {
  const app = createApp(
    { X402_PAY_TO: PAY_TO },
    {
      facilitatorClient: {
        async getSupported() {
          return {
            extensions: [],
            kinds: [{ x402Version: 2, scheme: "exact", network: "eip155:8453" }],
            signers: {},
          };
        },
      },
    },
  );

  const response = await app.fetch(new Request("https://example.com/api/latest-pdf"));
  const paymentRequired = response.headers.get("payment-required");

  assert.equal(response.status, 402);
  assert.ok(paymentRequired, "expected payment-required header");

  const decoded = JSON.parse(Buffer.from(paymentRequired, "base64url").toString("utf8"));
  assert.equal(decoded.accepts[0].network, "eip155:8453");
  assert.equal(decoded.accepts[0].amount, "100000");
  assert.equal(decoded.accepts[0].payTo, PAY_TO);
});
