import "server-only";
import { createHmac } from "node:crypto";
export const connected = () =>
  Boolean(process.env.WORDPRESS_URL && process.env.LRT_API_SECRET);
export function wordpressConfig() {
  const secret = process.env.LRT_API_SECRET || "";
  if (secret.length < 32) throw new Error("Backend configuration unavailable.");
  const url = new URL(process.env.WORDPRESS_URL || "");
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new Error("Backend configuration unavailable.");
  return { base: url.href.replace(/\/$/, ""), secret };
}
export async function wp(path, body, { timeout = 12000 } = {}) {
  if (!/^(?:products\?page=\d{1,2}|checkout)$/.test(path))
    throw new Error("Invalid backend operation.");
  const { base, secret } = wordpressConfig();
  const method = body ? "POST" : "GET";
  const raw = body ? JSON.stringify(body) : "";
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", secret)
    .update(timestamp + "\n" + method + "\n" + path.split("?")[0] + "\n" + raw)
    .digest("hex");
  const res = await fetch(base + "/wp-json/lrt/v1/" + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Lrt-Time": timestamp,
      "X-Lrt-Signature": signature,
    },
    body: body ? raw : undefined,
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error("Backend request failed.");
  const reader = res.body?.getReader();
  if (!reader) throw new Error("Invalid backend response.");
  let bytes = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 4_000_000) {
        await reader.cancel();
        throw new Error("Backend response exceeds limit.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw new Error("Invalid backend response.");
  }
}
