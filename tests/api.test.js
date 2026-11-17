import test from "node:test";
import assert from "node:assert/strict";
import { POST } from "../app/api/checkout/route.js";
import { GET as catalog } from "../app/api/catalog/route.js";
import { products } from "../lib/catalog.js";
const body = {
  firstName: "Test",
  lastName: "Buyer",
  email: "buyer@example.com",
  phone: "+971500000000",
  address: "Example building",
  country: "QA",
  city: "Doha",
  payment: "card",
  requestId: "test-order-123456",
  items: [{ id: 1, size: 50, qty: 1 }],
};
test("standalone API returns all sample products and labelled simulated checkout", async () => {
  delete process.env.WORDPRESS_URL;
  delete process.env.LRT_API_SECRET;
  delete process.env[["NO", "OR"].join("") + "_API_SECRET"];
  const c = await (await catalog()).json();
  assert.equal(c.products.length, products.length);
  const r = await POST(
    new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify(body),
    }),
  );
  assert.equal(r.status, 200);
  const d = await r.json();
  assert.equal(d.mode, "demo");
  assert.equal(d.status, "simulated-card");
  assert.equal(d.total, 129);
  assert.equal(d.currency, "QAR");
  assert.ok(d.id.startsWith("DEMO-"));
  assert.equal(d.paymentUrl, undefined);
});
test("reject cross-origin checkout requests", async () => {
  const r = await POST(
    new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://other.example",
      },
      body: JSON.stringify(body),
    }),
  );
  assert.equal(r.status, 403);
});
test("reject malformed and oversized request bodies", async () => {
  const r = await POST(
    new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
      },
      body: "{",
    }),
  );
  assert.equal(r.status, 400);
  const large = await POST(
    new Request("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
      },
      body: "x".repeat(17000),
    }),
  );
  assert.equal(large.status, 413);
});
