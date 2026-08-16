import { getSetting } from "../config/settings.js";
import { EVENT_TYPES, PAGE_KEYS, recordAnalyticsEvent, SECTION_KEYS, type AnalyticsEvent } from "../data/analyticsRepository.js";
import type { ApplicationEnv } from "../environment.js";
import { readSessionToken } from "../security/session.js";

const HEADERS = { "Cache-Control": "no-store" };

function validEvent(value: unknown): value is AnalyticsEvent {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some((key) => !["eventType", "pageKey", "sectionKey", "durationMs"].includes(key))) return false;
  if (typeof record.eventType !== "string" || !EVENT_TYPES.includes(record.eventType as AnalyticsEvent["eventType"])) return false;
  if (record.eventType === "private_profile_view" || record.eventType === "resume_download") return false;
  const pageKey = record.pageKey ?? null;
  const sectionKey = record.sectionKey ?? null;
  const durationMs = record.durationMs ?? null;
  if (pageKey !== null && (typeof pageKey !== "string" || !PAGE_KEYS.includes(pageKey as AnalyticsEvent["pageKey"] & string))) return false;
  if (sectionKey !== null && (typeof sectionKey !== "string" || !SECTION_KEYS.includes(sectionKey as AnalyticsEvent["sectionKey"] & string))) return false;
  if (durationMs !== null && (typeof durationMs !== "number" || !Number.isInteger(durationMs) || durationMs < 0 || durationMs > 300_000)) return false;
  return (record.eventType === "page_view" && pageKey !== null && sectionKey === null && durationMs === null)
    || (record.eventType === "section_view" && pageKey !== null && sectionKey !== null && durationMs === null)
    || (record.eventType === "engagement" && pageKey !== null && sectionKey === null && durationMs !== null);
}

export async function handleAnalyticsEvent(request: Request, env: ApplicationEnv) {
  const token = readSessionToken(request);
  if (!token) return new Response(null, { status: 204, headers: HEADERS });
  if (await getSetting("analytics.enabled", env) !== true) return new Response(null, { status: 204, headers: HEADERS });
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > 4_096) return Response.json({ error: "Invalid analytics event." }, { status: 400, headers: HEADERS });
    const body: unknown = JSON.parse(text);
    if (!validEvent(body)) return Response.json({ error: "Invalid analytics event." }, { status: 400, headers: HEADERS });
    await recordAnalyticsEvent(env.DB, token, {
      eventType: body.eventType,
      pageKey: body.pageKey ?? null,
      sectionKey: body.sectionKey ?? null,
      durationMs: body.durationMs ?? null,
    });
    return new Response(null, { status: 204, headers: HEADERS });
  } catch { return Response.json({ error: "Invalid analytics event." }, { status: 400, headers: HEADERS }); }
}
