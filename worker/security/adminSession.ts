import { createSessionToken, hashSessionToken } from "./session.js";

export const ADMIN_SESSION_COOKIE_NAME = "__Host-thisisme_admin";

function readCookie(request: Request) {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const cookie of header.split(";")) {
    const [name, ...parts] = cookie.trim().split("=");
    if (name === ADMIN_SESSION_COOKIE_NAME) return parts.join("=") || null;
  }
  return null;
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

export async function verifyAdminCredential(submitted: string, configured?: string) {
  if (!configured) return false;
  return crypto.subtle.timingSafeEqual(await digest(submitted), await digest(configured));
}

export async function createAdminSession(db: D1Database, lifetimeMinutes: number) {
  const token = createSessionToken();
  const tokenHash = await hashSessionToken(token);
  const expiresAt = new Date(Date.now() + lifetimeMinutes * 60_000).toISOString();
  await db.batch([
    db.prepare("INSERT INTO admin_sessions (session_token_hash, expires_at) VALUES (?, ?)").bind(tokenHash, expiresAt),
    db.prepare("DELETE FROM admin_sessions WHERE datetime(expires_at) <= datetime('now')"),
  ]);
  return token;
}

export async function requireAdminSession(request: Request, db: D1Database) {
  const token = readCookie(request);
  if (!token) return false;
  const hash = await hashSessionToken(token);
  return Boolean(await db.prepare(`
    SELECT session_token_hash FROM admin_sessions
    WHERE session_token_hash = ? AND datetime(expires_at) > datetime('now')
  `).bind(hash).first());
}

export async function invalidateAdminSession(request: Request, db: D1Database) {
  const token = readCookie(request);
  if (token) await db.prepare("DELETE FROM admin_sessions WHERE session_token_hash = ?").bind(await hashSessionToken(token)).run();
}

export function adminSessionCookie(token: string, maxAgeSeconds: number) {
  return `${ADMIN_SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

export function clearAdminSessionCookie() {
  return `${ADMIN_SESSION_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function hasValidOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  return origin !== null && origin === new URL(request.url).origin;
}
