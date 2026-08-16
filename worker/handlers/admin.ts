import appSettings from "../../appsettings.json" with { type: "json" };
import { issueAccessCode, listAccessCodes, listAdminTestimonials, moderateTestimonial, reissueAccessCode, updateAccessCode } from "../data/adminRepository.js";
import type { ApplicationEnv } from "../environment.js";
import { adminSessionCookie, clearAdminSessionCookie, createAdminSession, hasValidOrigin, invalidateAdminSession, requireAdminSession, verifyAdminCredential } from "../security/adminSession.js";
import { getAnalyticsSummary, getCompanyAnalytics } from "../data/analyticsRepository.js";

const HEADERS = { "Cache-Control": "no-store" };
const unauthorized = () => Response.json({ error: "Authorization required." }, { status: 401, headers: HEADERS });
const invalid = () => Response.json({ error: "Invalid request." }, { status: 400, headers: HEADERS });
const failed = () => Response.json({ error: "Unable to complete request." }, { status: 500, headers: HEADERS });

function safeErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return { errorName: "UnknownError", errorMessage: "A non-Error value was thrown." };
  }

  return {
    errorName: error.name,
    errorMessage: error.message,
    ...(error.stack ? { stack: error.stack } : {}),
  };
}

async function json(request: Request) {
  if (Number(request.headers.get("Content-Length") ?? 0) > 8_192) return null;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 8_192) return null;
    return JSON.parse(text) as unknown;
  } catch { return null; }
}

const ID = "([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})";

export async function handleAdminLogin(request: Request, env: ApplicationEnv) {
  if (!hasValidOrigin(request)) return invalid();
  const body = await json(request);
  const credential = typeof body === "object" && body !== null && !Array.isArray(body) && Object.keys(body).length === 1 && "credential" in body ? body.credential : null;
  const verified = typeof credential === "string" && credential.length >= 16 && credential.length <= 512 && await verifyAdminCredential(credential, env.ADMIN_AUTH_SECRET);
  if (!verified) {
    return Response.json({ error: "Unable to authenticate." }, { status: 401, headers: HEADERS });
  }
  try {
    const lifetime = appSettings.admin.sessionLifetimeMinutes;
    const token = await createAdminSession(env.DB, lifetime);
    return Response.json({ authenticated: true }, { headers: { ...HEADERS, "Set-Cookie": adminSessionCookie(token, lifetime * 60) } });
  } catch {
    console.error(JSON.stringify({ message: "Admin login failed", path: "/api/admin/login" }));
    return Response.json({ error: "Unable to authenticate." }, { status: 401, headers: HEADERS });
  }
}

export async function handleAdminSession(request: Request, env: ApplicationEnv) {
  return await requireAdminSession(request, env.DB)
    ? Response.json({ authenticated: true }, { headers: HEADERS })
    : unauthorized();
}

export async function handleAdminLogout(request: Request, env: ApplicationEnv) {
  if (!hasValidOrigin(request)) return invalid();
  await invalidateAdminSession(request, env.DB);
  return Response.json({ authenticated: false }, { headers: { ...HEADERS, "Set-Cookie": clearAdminSessionCookie() } });
}

export async function handleAdminApi(request: Request, env: ApplicationEnv, path: string) {
  if (!await requireAdminSession(request, env.DB)) return unauthorized();
  if (request.method !== "GET" && !hasValidOrigin(request)) return invalid();
  const operation = request.method === "POST" && path === "/api/admin/access-codes"
    ? "admin-access-code-create"
    : "admin-request";
  try {
    if (request.method === "GET" && path === "/api/admin/access-codes") return Response.json({ accessCodes: await listAccessCodes(env.DB, env.PRIVATE_DATA_ENCRYPTION_KEY) }, { headers: HEADERS });
    if (request.method === "POST" && path === "/api/admin/access-codes") {
      const body = await json(request);
      if (typeof body !== "object" || body === null || Array.isArray(body) || typeof (body as Record<string, unknown>).companyName !== "string") return invalid();
      const record = body as Record<string, unknown>;
      if (Object.keys(record).some((key) => key !== "companyName" && key !== "expiresAt")) return invalid();
      const companyName = (record.companyName as string).trim();
      const expiresAt = typeof record.expiresAt === "string" ? record.expiresAt : undefined;
      if (companyName.length < 2 || companyName.length > 160 || (expiresAt && !Number.isFinite(Date.parse(expiresAt)))) return invalid();
      return Response.json(await issueAccessCode(env.DB, env.PRIVATE_DATA_ENCRYPTION_KEY, companyName, expiresAt), { status: 201, headers: HEADERS });
    }
    const reissue = path.match(new RegExp(`^/api/admin/access-codes/${ID}/reissue$`, "u"));
    if (request.method === "POST" && reissue) {
      const accessCode = await reissueAccessCode(env.DB, reissue[1]);
      return accessCode ? Response.json({ accessCode }, { headers: HEADERS }) : invalid();
    }
    const update = path.match(new RegExp(`^/api/admin/access-codes/${ID}$`, "u"));
    if (request.method === "PATCH" && update) {
      const body = await json(request);
      if (typeof body !== "object" || body === null || Array.isArray(body)) return invalid();
      const record = body as Record<string, unknown>;
      if (Object.keys(record).some((key) => key !== "isActive" && key !== "expiresAt")) return invalid();
      if (typeof record.isActive !== "boolean" || typeof record.expiresAt !== "string" || !Number.isFinite(Date.parse(record.expiresAt))) return invalid();
      return await updateAccessCode(env.DB, update[1], record.isActive, record.expiresAt) ? Response.json({ updated: true }, { headers: HEADERS }) : invalid();
    }
    if (request.method === "GET" && path === "/api/admin/testimonials") return Response.json({ testimonials: await listAdminTestimonials(env.DB, env.PRIVATE_DATA_ENCRYPTION_KEY) }, { headers: HEADERS });
    if (request.method === "GET" && path === "/api/admin/analytics/summary") return Response.json(await getAnalyticsSummary(env.DB), { headers: HEADERS });
    if (request.method === "GET" && path === "/api/admin/analytics/companies") return Response.json({ companies: await getCompanyAnalytics(env.DB, env.PRIVATE_DATA_ENCRYPTION_KEY) }, { headers: HEADERS });
    const companyAnalytics = path.match(/^\/api\/admin\/analytics\/companies\/([0-9a-f-]+)$/u);
    if (request.method === "GET" && companyAnalytics) {
      const companies = await getCompanyAnalytics(env.DB, env.PRIVATE_DATA_ENCRYPTION_KEY, companyAnalytics[1]);
      return companies[0] ? Response.json({ company: companies[0] }, { headers: HEADERS }) : new Response(null, { status: 404, headers: HEADERS });
    }
    const review = path.match(new RegExp(`^/api/admin/testimonials/${ID}/(approve|reject)$`, "u"));
    if (request.method === "POST" && review) {
      const updated = await moderateTestimonial(env.DB, review[1], review[2] === "approve" ? "approved" : "rejected");
      return updated ? Response.json({ updated: true }, { headers: HEADERS }) : invalid();
    }
    return new Response(null, { status: 404, headers: HEADERS });
  } catch (error) {
    console.error(JSON.stringify({
      message: "Admin request failed",
      path,
      operation,
      ...safeErrorDetails(error),
    }));
    return failed();
  }
}
