import { verifyAccessCode } from "../security/accessCode.js";
import { createSessionToken, hashSessionToken } from "../security/session.js";

type AccessCodeCandidate = {
  id: string;
  company_code: string;
  code_hash: string;
};

type SessionRow = {
  company_code: string;
};

export async function validateAccessCode(
  db: D1Database,
  accessCode: string,
  sessionLifetimeMinutes: number,
) {
  const { results } = await db.prepare(`
    SELECT ac.id, ac.company_code, ac.code_hash
    FROM access_codes AS ac
    INNER JOIN companies AS c ON c.company_code = ac.company_code
    WHERE ac.is_active = 1
      AND c.is_active = 1
      AND datetime(ac.expires_at) > datetime('now')
    ORDER BY ac.id
  `).all<AccessCodeCandidate>();

  const matches = await Promise.all(results.map(async (candidate) => ({
    candidate,
    matches: await verifyAccessCode(accessCode, candidate.code_hash),
  })));
  const authorized = matches.find((result) => result.matches)?.candidate;

  if (!authorized) {
    return null;
  }

  const sessionToken = createSessionToken();
  const sessionIdHash = await hashSessionToken(sessionToken);
  const expiresAt = new Date(Date.now() + sessionLifetimeMinutes * 60_000).toISOString();

  await db.batch([
    db.prepare(`
      UPDATE access_codes
      SET last_used_at = CURRENT_TIMESTAMP,
          use_count = use_count + 1
      WHERE id = ?
    `).bind(authorized.id),
    db.prepare(`
      INSERT INTO protected_profile_sessions (session_id_hash, company_code, expires_at)
      VALUES (?, ?, ?)
    `).bind(sessionIdHash, authorized.company_code, expiresAt),
    db.prepare(`
      DELETE FROM protected_profile_sessions
      WHERE datetime(expires_at) <= datetime('now')
    `),
  ]);

  return sessionToken;
}

export async function authorizeSession(db: D1Database, sessionToken: string) {
  const sessionIdHash = await hashSessionToken(sessionToken);
  return db.prepare(`
    SELECT s.company_code
    FROM protected_profile_sessions AS s
    INNER JOIN companies AS c ON c.company_code = s.company_code
    WHERE s.session_id_hash = ?
      AND c.is_active = 1
      AND datetime(s.expires_at) > datetime('now')
  `).bind(sessionIdHash).first<SessionRow>();
}
