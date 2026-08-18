import { openApiDocument } from "./openapi.js";
import type { ApplicationEnv } from "./environment.js";
import { handleAccessValidation, handlePrivateProfile, handlePrivateResume } from "./handlers/protectedAccess.js";
import { handleApprovedTestimonials, handleTestimonialSubmission } from "./handlers/testimonials.js";
import { handleAdminApi, handleAdminLogin, handleAdminLogout, handleAdminSession } from "./handlers/admin.js";
import { handleAnalyticsEvent } from "./handlers/analytics.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
			await env.DB.prepare("SELECT 1 FROM _infrastructure_health LIMIT 1").all();
      return Response.json({ status: "ok" });
    }

    if (request.method === "GET" && url.pathname === "/api/openapi.json") {
      return Response.json(openApiDocument);
    }

    if (request.method === "POST" && url.pathname === "/api/access/validate") {
      return handleAccessValidation(request, env);
    }

    if (request.method === "GET" && url.pathname === "/api/private-profile") {
      return handlePrivateProfile(request, env);
    }

    if (request.method === "GET" && url.pathname === "/api/private/resume") {
      return handlePrivateResume(request, env);
    }

    if (request.method === "GET" && url.pathname === "/api/testimonials") {
      return handleApprovedTestimonials(env);
    }

    if (request.method === "POST" && url.pathname === "/api/testimonials") {
      return handleTestimonialSubmission(request, env);
    }

    if (request.method === "POST" && url.pathname === "/api/analytics/events") return handleAnalyticsEvent(request, env);

    if (request.method === "POST" && url.pathname === "/api/admin/login") return handleAdminLogin(request, env);
    if (request.method === "GET" && url.pathname === "/api/admin/session") return handleAdminSession(request, env);
    if (request.method === "POST" && url.pathname === "/api/admin/logout") return handleAdminLogout(request, env);
    if (url.pathname.startsWith("/api/admin/")) return handleAdminApi(request, env, url.pathname);
		return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<ApplicationEnv>;
