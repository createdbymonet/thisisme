import appSettings from "../../appsettings.json" with { type: "json" };
import { createAccessCode, hashAccessCode } from "../security/accessCode.js";
import { decryptText, encryptText } from "../security/crypto.js";
import type { DisplayPreference } from "./testimonialRepository.js";

type AccessCodeRow = {
  id: string;
  company_name_ciphertext: string;
  company_name_iv: string;
  encryption_version: number;
  is_active: 0 | 1;
  expires_at: string;
  created_at: string;
  last_used_at: string | null;
  use_count: number;
};

type AdminTestimonialRow = {
  id: string;
  author_name_ciphertext: string;
  author_name_iv: string;
  relationship_ciphertext: string;
  relationship_iv: string;
  comment_ciphertext: string;
  comment_iv: string;
  display_preference: DisplayPreference;
  status: "pending" | "approved" | "rejected";
  encryption_version: number;
  submitted_at: string;
  reviewed_at: string | null;
};

export async function listAccessCodes(db: D1Database, key: string) {
  const { results } = await db.prepare(`
    SELECT ac.id, c.company_name_ciphertext, c.company_name_iv, c.encryption_version,
      ac.is_active, ac.expires_at, ac.created_at, ac.last_used_at, ac.use_count
    FROM access_codes ac INNER JOIN companies c ON c.company_code = ac.company_code
    ORDER BY ac.created_at DESC
  `).all<AccessCodeRow>();
  return Promise.all(results.map(async (row) => ({
    accessCodeId: row.id,
    companyName: await decryptText({ ciphertext: row.company_name_ciphertext, iv: row.company_name_iv, encryptionVersion: row.encryption_version }, key),
    isActive: row.is_active === 1,
    expiresAt: row.expires_at,
    createdAt: row.created_at,
    lastUsedAt: row.last_used_at,
    useCount: row.use_count,
  })));
}

export async function issueAccessCode(db: D1Database, key: string, companyName: string, expiresAt?: string) {
  const version = appSettings.security.encryptionVersion;
  const encrypted = await encryptText(companyName, key, version);
  const accessCode = createAccessCode();
  const expiration = expiresAt ?? new Date(Date.now() + appSettings.accessCode.defaultExpirationDays * 86_400_000).toISOString();
  const companyCode = crypto.randomUUID();
  const accessCodeId = crypto.randomUUID();
  await db.batch([
    db.prepare(`INSERT INTO companies
      (company_code, company_name_ciphertext, company_name_iv, encryption_version)
      VALUES (?, ?, ?, ?)`
    ).bind(companyCode, encrypted.ciphertext, encrypted.iv, version),
    db.prepare(`INSERT INTO access_codes (id, company_code, code_hash, expires_at)
      VALUES (?, ?, ?, ?)`
    ).bind(accessCodeId, companyCode, await hashAccessCode(accessCode), expiration),
  ]);
  return { accessCodeId, accessCode };
}

export async function reissueAccessCode(db: D1Database, id: string) {
  const accessCode = createAccessCode();
  const expiresAt = new Date(Date.now() + appSettings.accessCode.defaultExpirationDays * 86_400_000).toISOString();
  const result = await db.prepare(`UPDATE access_codes
    SET code_hash = ?, expires_at = ?, is_active = 1, last_used_at = NULL, use_count = 0
    WHERE id = ?`
  ).bind(await hashAccessCode(accessCode), expiresAt, id).run();
  return result.meta.changes === 1 ? accessCode : null;
}

export async function updateAccessCode(db: D1Database, id: string, isActive: boolean, expiresAt: string) {
  const result = await db.prepare("UPDATE access_codes SET is_active = ?, expires_at = ? WHERE id = ?")
    .bind(isActive ? 1 : 0, expiresAt, id).run();
  return result.meta.changes === 1;
}

export async function listAdminTestimonials(db: D1Database, key: string) {
  const { results } = await db.prepare(`SELECT * FROM testimonials ORDER BY submitted_at DESC`).all<AdminTestimonialRow>();
  return Promise.all(results.map(async (row) => {
    const value = (ciphertext: string, iv: string) => ({ ciphertext, iv, encryptionVersion: row.encryption_version });
    const [authorName, relationship, comment] = await Promise.all([
      decryptText(value(row.author_name_ciphertext, row.author_name_iv), key),
      decryptText(value(row.relationship_ciphertext, row.relationship_iv), key),
      decryptText(value(row.comment_ciphertext, row.comment_iv), key),
    ]);
    return { id: row.id, authorName, relationship, comment, displayPreference: row.display_preference, status: row.status, submittedAt: row.submitted_at, reviewedAt: row.reviewed_at };
  }));
}

export async function moderateTestimonial(db: D1Database, id: string, status: "approved" | "rejected") {
  const result = await db.prepare(`UPDATE testimonials SET status = ?, reviewed_at = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'pending'`).bind(status, id).run();
  return result.meta.changes === 1;
}
