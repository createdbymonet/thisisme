const baseUrl = process.env.DEPLOY_URL;

const isProductionUrl = typeof baseUrl === 'string' && /^https:\/\/[a-z0-9.-]+\.workers\.dev$/u.test(baseUrl);
const isAllowedLocalUrl = process.env.ALLOW_LOCALHOST === 'true'
  && typeof baseUrl === 'string'
  && /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/u.test(baseUrl);

if (!isProductionUrl && !isAllowedLocalUrl) {
  throw new Error('DEPLOY_URL must be a Cloudflare workers.dev URL');
}

async function request(path, expectedStatus = 200) {
  const response = await fetch(new URL(path, baseUrl), { redirect: 'error' });
  if (response.status !== expectedStatus) {
    throw new Error(`${path} returned ${response.status}; expected ${expectedStatus}`);
  }
  console.log(`${path}: ${response.status}`);
  return response;
}

for (const path of ['/', '/recommend', '/access', '/private', '/manage-portal', '/docs']) {
  const response = await request(path);
  const html = await response.text();
  if (!html.includes('<div id="root"></div>')) throw new Error(`${path} did not return the frontend application`);
  if (!html.includes('name="robots" content="noindex, nofollow"')) throw new Error(`${path} lost noindex, nofollow metadata`);
}

const health = await (await request('/api/health')).json();
if (health.status !== 'ok') throw new Error('/api/health returned an unexpected body');

const openApi = await (await request('/api/openapi.json')).json();
if (typeof openApi !== 'object' || openApi === null || !('openapi' in openApi)) {
  throw new Error('/api/openapi.json did not return an OpenAPI document');
}

const testimonials = await (await request('/api/testimonials')).json();
if (typeof testimonials !== 'object' || testimonials === null || !Array.isArray(testimonials.testimonials)) {
  throw new Error('/api/testimonials returned an unexpected body');
}

await request('/api/private-profile', 401);
await request('/api/admin/session', 401);
await request('/api/admin/access-codes', 401);

console.log(`Production smoke checks passed for ${baseUrl}`);
