import { getSetting } from "../config/settings.js";
import { getPrivateProfile } from "../data/privateProfileRepository.js";
import { authorizeSession, validateAccessCode } from "../data/protectedAccessRepository.js";
import type { ApplicationEnv } from "../environment.js";
import { createSessionCookie, readSessionToken } from "../security/session.js";
import { recordAnalyticsEvent } from "../data/analyticsRepository.js";

const UNAUTHORIZED_RESPONSE = { error: "Invalid or expired access code." };
const SESSION_REQUIRED_RESPONSE = { error: "Authorization required." };
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function jsonError(body: { error: string }, status: number) {
  return Response.json(body, { status, headers: NO_STORE_HEADERS });
}

function logFailure(path: string) {
  console.error(JSON.stringify({ message: "Protected access request failed", path }));
}

export async function handleAccessValidation(request: Request, env: ApplicationEnv) {
  try {
    const contentLength = Number(request.headers.get("Content-Length") ?? 0);
    if (contentLength > 4_096) {
      return jsonError(UNAUTHORIZED_RESPONSE, 401);
    }

    const body: unknown = await request.json();
    const accessCode = typeof body === "object" && body !== null && "accessCode" in body
      ? body.accessCode
      : null;

    if (typeof accessCode !== "string" || accessCode.length < 12 || accessCode.length > 256) {
      return jsonError(UNAUTHORIZED_RESPONSE, 401);
    }

    const configuredLifetime = await getSetting("protectedProfile.sessionLifetimeMinutes", env);
    const sessionLifetimeMinutes = typeof configuredLifetime === "number"
      && configuredLifetime >= 1
      && configuredLifetime <= 1_440
      ? configuredLifetime
      : 30;
    const sessionToken = await validateAccessCode(
      env.DB,
      accessCode,
      sessionLifetimeMinutes,
      await getSetting("analytics.enabled", env) === true,
    );

    if (!sessionToken) {
      return jsonError(UNAUTHORIZED_RESPONSE, 401);
    }

    const maxAgeSeconds = Math.round(sessionLifetimeMinutes * 60);
    return Response.json({ authorized: true }, {
      headers: {
        ...NO_STORE_HEADERS,
        "Set-Cookie": createSessionCookie(sessionToken, maxAgeSeconds),
      },
    });
  } catch {
    logFailure(new URL(request.url).pathname);
    return jsonError({ error: "Internal server error." }, 500);
  }
}

export async function handlePrivateProfile(request: Request, env: ApplicationEnv) {
  try {
    const sessionToken = readSessionToken(request);
    if (!sessionToken || !await authorizeSession(env.DB, sessionToken)) {
      return jsonError(SESSION_REQUIRED_RESPONSE, 401);
    }

    const profile = await getPrivateProfile(env.DB, env.PRIVATE_DATA_ENCRYPTION_KEY);
    if (profile && await getSetting("analytics.enabled", env) === true) {
      try {
        await recordAnalyticsEvent(env.DB, sessionToken, { eventType: "private_profile_view", pageKey: "private", sectionKey: null, durationMs: null });
      } catch {
        // Analytics must not prevent an authorized profile response.
      }
    }
    return Response.json({ profile }, { headers: NO_STORE_HEADERS });
  } catch {
    logFailure(new URL(request.url).pathname);
    return jsonError({ error: "Internal server error." }, 500);
  }
}
