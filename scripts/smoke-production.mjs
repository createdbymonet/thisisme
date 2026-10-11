const baseUrl = process.env.DEPLOY_URL;

const isProductionUrl = typeof baseUrl === 'string' && /^https:\/\/[a-z0-9.-]+\.workers\.dev$/u.test(baseUrl);
const isAllowedLocalUrl = process.env.ALLOW_LOCALHOST === 'true'
  && typeof baseUrl === 'string'
  && /^http:\/\/(?:127\.0\.0\.1|localhost):\d+$/u.test(baseUrl);

if (!isProductionUrl && !isAllowedLocalUrl) {
  throw new Error('DEPLOY_URL must be a Cloudflare workers.dev URL');
}

async function request(path, expectedStatus = 200, options = {}) {
  const response = await fetch(new URL(path, baseUrl), { redirect: 'error', ...options });
  if (response.status !== expectedStatus) {
    throw new Error(`${path} returned ${response.status}; expected ${expectedStatus}`);
  }
  console.log(`${path}: ${response.status}`);
  return response;
}

for (const path of ['/', '/docs']) {
  const response = await request(path);
  const html = await response.text();
  if (!html.includes('<div id="root"></div>')) throw new Error(`${path} did not return the frontend application`);
  if (!html.includes('name="robots" content="noindex, nofollow"')) throw new Error(`${path} lost noindex, nofollow metadata`);
}

// A newly deployed Worker can briefly return errors while its version propagates.
async function waitForHealthyWorker() {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    try {
      const health = await (await request('/api/health', 200, {
        signal: AbortSignal.timeout(10000),
      })).json();
      if (health.status !== 'ok') throw new Error('/api/health returned an unexpected body');
      return;
    } catch (error) {
      if (attempt === 6) throw error;
      console.log(`Worker health check failed (attempt ${attempt}/6); retrying in 3 seconds.`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

await waitForHealthyWorker();

const openApi = await (await request('/api/openapi.json')).json();
if (typeof openApi !== 'object' || openApi === null || !('openapi' in openApi)) {
  throw new Error('/api/openapi.json did not return an OpenAPI document');
}

await request('/api/testimonials', 404);
await request('/api/testimonials', 404, { method: 'POST' });

await request('/api/private-profile', 404);
await request('/api/private/resume', 404);
await request('/api/private/resume?download=true', 404);
await request('/api/admin/session', 404);
await request('/api/access/validate', 404, { method: 'POST' });

console.log(`Production smoke checks passed for ${baseUrl}`);
