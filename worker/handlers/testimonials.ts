import appSettings from "../../appsettings.json" with { type: "json" };
import {
  createTestimonial,
  DISPLAY_PREFERENCES,
  getApprovedTestimonials,
  type TestimonialSubmission,
} from "../data/testimonialRepository.js";
import type { ApplicationEnv } from "../environment.js";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };
const INVALID_REQUEST = { error: "Invalid testimonial submission." };
const EXPECTED_KEYS = ["authorName", "relationship", "comment", "displayPreference"];

function isSubmission(value: unknown): value is TestimonialSubmission {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  const record = value as Record<string, unknown>;
  if (Object.keys(record).some((key) => !EXPECTED_KEYS.includes(key))) return false;

  return typeof record.authorName === "string"
    && record.authorName.trim().length >= 2
    && record.authorName.trim().length <= 100
    && typeof record.relationship === "string"
    && record.relationship.trim().length >= 2
    && record.relationship.trim().length <= 120
    && typeof record.comment === "string"
    && record.comment.trim().length >= 10
    && record.comment.trim().length <= 2_000
    && typeof record.displayPreference === "string"
    && DISPLAY_PREFERENCES.includes(record.displayPreference as typeof DISPLAY_PREFERENCES[number]);
}

export async function handleTestimonialSubmission(request: Request, env: ApplicationEnv) {
  try {
    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (contentLength > 8_192) {
      return Response.json(INVALID_REQUEST, { status: 400, headers: NO_STORE_HEADERS });
    }

    const requestText = await request.text();
    if (new TextEncoder().encode(requestText).byteLength > 8_192) {
      return Response.json(INVALID_REQUEST, { status: 400, headers: NO_STORE_HEADERS });
    }

    let body: unknown;
    try {
      body = JSON.parse(requestText);
    } catch {
      return Response.json(INVALID_REQUEST, { status: 400, headers: NO_STORE_HEADERS });
    }
    if (!isSubmission(body)) {
      return Response.json(INVALID_REQUEST, { status: 400, headers: NO_STORE_HEADERS });
    }

    await createTestimonial(
      env.DB,
      env.PRIVATE_DATA_ENCRYPTION_KEY,
      appSettings.security.encryptionVersion,
      {
        authorName: body.authorName.trim(),
        relationship: body.relationship.trim(),
        comment: body.comment.trim(),
        displayPreference: body.displayPreference,
      },
    );
    return Response.json({ submitted: true }, { status: 201, headers: NO_STORE_HEADERS });
  } catch {
    console.error(JSON.stringify({ message: "Testimonial submission failed", path: "/api/testimonials" }));
    return Response.json({ error: "Internal server error." }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function handleApprovedTestimonials(env: ApplicationEnv) {
  try {
    const testimonials = await getApprovedTestimonials(env.DB, env.PRIVATE_DATA_ENCRYPTION_KEY);
    return Response.json({ testimonials }, { headers: NO_STORE_HEADERS });
  } catch {
    console.error(JSON.stringify({ message: "Approved testimonial retrieval failed", path: "/api/testimonials" }));
    return Response.json({ error: "Internal server error." }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
