import { createHash } from "node:crypto";
// Bounded per-process guard. Use an edge/WAF limiter across multiple replicas.
const windows = new Map();
export function allowRequest(key, now = Date.now()) {
  for (const [k, v] of windows) if (v.until <= now) windows.delete(k);
  const current = windows.get(key);
  if (current) {
    current.count++;
    return current.count <= 12;
  }
  if (windows.size >= 2000) return false;
  windows.set(key, { count: 1, until: now + 60000 });
  return true;
}
export async function readLimitedBody(req, max = 16000) {
  if (Number(req.headers.get("content-length") || 0) > max)
    throw Object.assign(new Error("Request too large."), { status: 413 });
  const reader = req.body?.getReader();
  if (!reader) return "";
  const chunks = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        throw Object.assign(new Error("Request too large."), { status: 413 });
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks).toString("utf8");
}
export function trustedPaymentUrl(value) {
  const url = new URL(value),
    base = new URL(process.env.WORDPRESS_URL);
  if (
    url.origin !== base.origin ||
    url.protocol !== "https:" ||
    url.username ||
    url.password
  )
    throw new Error("Invalid payment destination.");
  return url.href;
}

export function allowedCheckoutOrigin(req) {
  const configured = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.CHECKOUT_ORIGIN,
    process.env.VERCEL === "1" && process.env.VERCEL_URL
      ? "https://" + process.env.VERCEL_URL
      : null,
  ].filter(Boolean);
  if (process.env.NODE_ENV !== "production")
    configured.push(new URL(req.url).origin);
  return (
    configured.some((value) => {
      try {
        return new URL(value).origin === req.headers.get("origin");
      } catch {
        return false;
      }
    }) && req.headers.get("sec-fetch-site") !== "cross-site"
  );
}
export function clientKey(req) {
  const trusted =
    process.env.VERCEL === "1" || process.env.TRUST_PROXY_IP === "true";
  const ip = trusted ? req.headers.get("x-real-ip") || "unknown" : "shared";
  return createHash("sha256").update(ip.slice(0, 128)).digest("hex");
}
export function safeOrder(body) {
  return Object.fromEntries(
    [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "country",
      "city",
      "payment",
      "requestId",
      "note",
      "currency",
      "terms",
      "items",
    ]
      .filter((key) => Object.hasOwn(body, key))
      .map((key) => [
        key,
        key === "items"
          ? body.items.map((i) => ({ id: i.id, size: i.size, qty: i.qty }))
          : body[key],
      ]),
  );
}
