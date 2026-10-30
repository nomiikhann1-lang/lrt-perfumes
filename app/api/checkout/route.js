import { validateOrder, demoTotals } from "../../../lib/catalog.js";
import { connected, wp } from "../../../lib/wordpress.js";
import {
  allowRequest,
  readLimitedBody,
  trustedPaymentUrl,
  allowedCheckoutOrigin,
  clientKey,
  safeOrder,
} from "../../../lib/request-security.js";
const json = (data, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
export async function POST(req) {
  try {
    if (!allowedCheckoutOrigin(req))
      return json({ error: "Invalid request origin." }, 403);
    if (
      !req.headers
        .get("content-type")
        ?.toLowerCase()
        .startsWith("application/json")
    )
      return json({ error: "Use application/json." }, 415);
    const live = connected();
    if (
      !live &&
      (process.env.WORDPRESS_URL ||
        process.env.LRT_API_SECRET ||
        (process.env.VERCEL === "1" && process.env.ENABLE_DEMO !== "true"))
    )
      return json({ error: "Store configuration unavailable." }, 503);
    if (!allowRequest(clientKey(req)))
      return Response.json(
        { error: "Too many checkout attempts. Please wait a minute." },
        {
          status: 429,
          headers: { "Cache-Control": "no-store", "Retry-After": "60" },
        },
      );
    let body;
    try {
      body = JSON.parse(await readLimitedBody(req));
    } catch (e) {
      return json(
        { error: e.status === 413 ? e.message : "Invalid request body." },
        e.status || 400,
      );
    }
    try {
      validateOrder(body);
    } catch (e) {
      return json({ error: e.message }, 400);
    }
    body = safeOrder(body);
    if (live) {
      if (body.terms !== "on")
        return json({ error: "Please accept the terms before checkout." }, 400);
      if (process.env.COMMERCE_ENABLED !== "true")
        return json(
          {
            error:
              "Online ordering is not yet available. Please contact our team.",
          },
          503,
        );
      try {
        const raw = await wp("checkout", body);
        if (
          !Number.isSafeInteger(raw?.id) ||
          typeof raw.total !== "number" ||
          !Number.isFinite(raw.total) ||
          raw.total < 0 ||
          !["AED", "QAR"].includes(raw.currency)
        )
          throw new Error("Invalid order response.");
        const result = {
          id: raw.id,
          total: raw.total,
          currency: raw.currency,
          mode: "wordpress",
          status:
            typeof raw.status === "string"
              ? raw.status.slice(0, 40)
              : "pending",
        };
        if (raw.paymentUrl)
          result.paymentUrl = trustedPaymentUrl(raw.paymentUrl);
        return json(result);
      } catch {
        return json(
          {
            error:
              "We could not confirm your order. Keep your checkout reference and contact support before starting a new order.",
          },
          502,
        );
      }
    }
    const totals = demoTotals(body);
    return json({
      id: "DEMO-" + body.requestId.slice(0, 8).toUpperCase(),
      ...totals,
      mode: "demo",
      status: body.payment === "card" ? "simulated-card" : "simulated-cod",
    });
  } catch {
    return json({ error: "Checkout failed. Please try again." }, 400);
  }
}
