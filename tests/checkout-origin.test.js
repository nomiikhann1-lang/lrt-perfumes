import test from 'node:test';
import assert from 'node:assert/strict';
import { allowedCheckoutOrigin } from '../lib/request-security.js';
import { POST } from '../app/api/checkout/route.js';

const config = {
  NODE_ENV: 'production', VERCEL: '1',
  WORDPRESS_URL: 'https://backend.invalid', LRT_API_SECRET: 'test-only-not-a-real-secret-123456789',
  VERCEL_URL: 'lrt-deployment.example',
  VERCEL_BRANCH_URL: 'lrt-branch.example',
  VERCEL_PROJECT_PRODUCTION_URL: 'lrt-production.example',
  NEXT_PUBLIC_SITE_URL: '', CHECKOUT_ORIGIN: '',
};
async function configured(run) {
  const before = Object.fromEntries(Object.keys(config).map(k => [k, process.env[k]]));
  Object.assign(process.env, config);
  try { await run(); } finally {
    for (const [key, value] of Object.entries(before)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
  }
}
function request(origin, extra = {}) {
  return new Request('http://internal:3000/api/checkout', {
    method: 'POST', headers: { ...(origin ? { origin } : {}),
      'content-type': 'application/json', ...extra }, body: '{}',
  });
}
test('checkout accepts exact Vercel deployment, branch and production aliases', () => configured(async () => {
  for (const host of [config.VERCEL_URL, config.VERCEL_BRANCH_URL, config.VERCEL_PROJECT_PRODUCTION_URL]) {
    assert(allowedCheckoutOrigin(request(`https://${host}`, {'sec-fetch-site':'same-origin'})));
    // Invalid order must reach validation (400), not fail the origin guard (403).
    assert.equal((await POST(request(`https://${host}`))).status, 400);
  }
}));
test('checkout rejects absent, opaque, unrelated, suffix and cross-site origins', () => configured(() => {
  for (const origin of [undefined, 'null', 'https://attacker.example',
    'https://lrt-production.example.attacker.example', 'http://lrt-production.example']) {
    assert.equal(allowedCheckoutOrigin(request(origin)), false);
  }
  assert.equal(allowedCheckoutOrigin(request('https://lrt-production.example', {'sec-fetch-site':'cross-site'})), false);
  assert.equal(allowedCheckoutOrigin(request('https://attacker.example', {
    host:'attacker.example', 'x-forwarded-host':'attacker.example', 'sec-fetch-site':'same-origin',
  })), false);
}));
test('Vercel aliases require Vercel runtime; explicit custom origin still works', () => configured(() => {
  process.env.VERCEL = '0';
  assert.equal(allowedCheckoutOrigin(request('https://lrt-production.example')), false);
  process.env.CHECKOUT_ORIGIN = 'https://custom.example';
  assert(allowedCheckoutOrigin(request('https://custom.example')));
}));
