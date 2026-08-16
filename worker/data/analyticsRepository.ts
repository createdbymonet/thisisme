import { decryptText } from "../security/crypto.js";
import { hashSessionToken } from "../security/session.js";

export const EVENT_TYPES = ["page_view", "section_view", "private_profile_view", "resume_download", "engagement"] as const;
export const PAGE_KEYS = ["home", "recommend", "access", "private"] as const;
export const SECTION_KEYS = ["hero", "skills", "experience", "projects", "about", "testimonials", "contact", "protected-profile"] as const;
export type AnalyticsEventType = typeof EVENT_TYPES[number];
export type PageKey = typeof PAGE_KEYS[number];
export type SectionKey = typeof SECTION_KEYS[number];

type ProtectedContext = { company_code: string; analytics_session_id: string | null };

export type AnalyticsEvent = {
  eventType: AnalyticsEventType;
  pageKey: PageKey | null;
  sectionKey: SectionKey | null;
  durationMs: number | null;
};

async function analyticsSession(db: D1Database, protectedToken: string) {
  const protectedHash = await hashSessionToken(protectedToken);
  let context = await db.prepare(`SELECT company_code, analytics_session_id
    FROM protected_profile_sessions
    WHERE session_id_hash = ? AND datetime(expires_at) > datetime('now')`
  ).bind(protectedHash).first<ProtectedContext>();
  if (!context) return null;
  if (context.analytics_session_id) return context.analytics_session_id;

  const id = crypto.randomUUID();
  await db.batch([
    db.prepare("INSERT INTO analytics_sessions (id, company_code) VALUES (?, ?)").bind(id, context.company_code),
    db.prepare(`UPDATE protected_profile_sessions SET analytics_session_id = ?
      WHERE session_id_hash = ? AND analytics_session_id IS NULL`).bind(id, protectedHash),
  ]);
  context = await db.prepare("SELECT company_code, analytics_session_id FROM protected_profile_sessions WHERE session_id_hash = ?")
    .bind(protectedHash).first<ProtectedContext>();
  return context?.analytics_session_id ?? null;
}

export async function recordAnalyticsEvent(db: D1Database, protectedToken: string, event: AnalyticsEvent) {
  const sessionId = await analyticsSession(db, protectedToken);
  if (!sessionId) return false;
  await db.batch([
    db.prepare(`INSERT INTO analytics_events
      (id, analytics_session_id, event_type, page_key, section_key, duration_ms)
      VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(crypto.randomUUID(), sessionId, event.eventType, event.pageKey, event.sectionKey, event.durationMs),
    db.prepare("UPDATE analytics_sessions SET last_activity_at = CURRENT_TIMESTAMP WHERE id = ?").bind(sessionId),
  ]);
  return true;
}

type SummaryRow = { session_count: number; company_count: number; page_views: number; private_views: number; resume_downloads: number; engagement_ms: number };
export async function getAnalyticsSummary(db: D1Database) {
  const row = await db.prepare(`SELECT
    (SELECT COUNT(*) FROM analytics_sessions) session_count,
    (SELECT COUNT(DISTINCT company_code) FROM analytics_sessions) company_count,
    SUM(CASE WHEN event_type = 'page_view' THEN 1 ELSE 0 END) page_views,
    SUM(CASE WHEN event_type = 'private_profile_view' THEN 1 ELSE 0 END) private_views,
    SUM(CASE WHEN event_type = 'resume_download' THEN 1 ELSE 0 END) resume_downloads,
    SUM(CASE WHEN event_type = 'engagement' THEN duration_ms ELSE 0 END) engagement_ms
    FROM analytics_events`).first<SummaryRow>();
  return { sessionCount: row?.session_count ?? 0, companyCount: row?.company_count ?? 0, pageViews: row?.page_views ?? 0, privateProfileViews: row?.private_views ?? 0, resumeDownloads: row?.resume_downloads ?? 0, estimatedEngagementMs: row?.engagement_ms ?? 0 };
}

type CompanyRow = { company_code: string; company_name_ciphertext: string; company_name_iv: string; encryption_version: number; session_count: number; last_activity: string; engagement_ms: number; private_views: number; resume_downloads: number };
type CountRow = { company_code: string; key: string; count: number };
export async function getCompanyAnalytics(db: D1Database, key: string, companyCode?: string) {
  const filter = companyCode ? "WHERE c.company_code = ?" : "";
  const statement = db.prepare(`SELECT c.company_code, c.company_name_ciphertext, c.company_name_iv, c.encryption_version,
    COUNT(DISTINCT s.id) session_count, MAX(s.last_activity_at) last_activity,
    COALESCE(SUM(CASE WHEN e.event_type = 'engagement' THEN e.duration_ms ELSE 0 END), 0) engagement_ms,
    SUM(CASE WHEN e.event_type = 'private_profile_view' THEN 1 ELSE 0 END) private_views,
    SUM(CASE WHEN e.event_type = 'resume_download' THEN 1 ELSE 0 END) resume_downloads
    FROM companies c JOIN analytics_sessions s ON s.company_code = c.company_code
    LEFT JOIN analytics_events e ON e.analytics_session_id = s.id ${filter}
    GROUP BY c.company_code ORDER BY last_activity DESC`);
  const { results } = companyCode ? await statement.bind(companyCode).all<CompanyRow>() : await statement.all<CompanyRow>();
  const pageStatement = db.prepare(`SELECT s.company_code, e.page_key key, COUNT(*) count FROM analytics_events e
    JOIN analytics_sessions s ON s.id = e.analytics_session_id
    WHERE e.event_type = 'page_view' AND (? IS NULL OR s.company_code = ?) GROUP BY s.company_code, e.page_key`).bind(companyCode ?? null, companyCode ?? null);
  const sectionStatement = db.prepare(`SELECT s.company_code, e.section_key key, COUNT(*) count FROM analytics_events e
    JOIN analytics_sessions s ON s.id = e.analytics_session_id
    WHERE e.event_type = 'section_view' AND (? IS NULL OR s.company_code = ?) GROUP BY s.company_code, e.section_key`).bind(companyCode ?? null, companyCode ?? null);
  const [pages, sections] = await db.batch<CountRow>([pageStatement, sectionStatement]);
  return Promise.all(results.map(async (row) => ({
    companyCode: row.company_code,
    companyName: await decryptText({ ciphertext: row.company_name_ciphertext, iv: row.company_name_iv, encryptionVersion: row.encryption_version }, key),
    sessionCount: row.session_count,
    lastActivity: row.last_activity,
    pageViews: Object.fromEntries(pages.results.filter((item) => item.company_code === row.company_code).map((item) => [item.key, item.count])),
    sectionViews: Object.fromEntries(sections.results.filter((item) => item.company_code === row.company_code).map((item) => [item.key, item.count])),
    estimatedEngagementMs: row.engagement_ms,
    privateProfileViews: row.private_views,
    resumeDownloads: row.resume_downloads,
  })));
}
