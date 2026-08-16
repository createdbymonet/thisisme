import { openApiDocument } from "./openapi.js";
import type { ApplicationEnv } from "./environment.js";
import { handleAccessValidation, handlePrivateProfile } from "./handlers/protectedAccess.js";
import { handleApprovedTestimonials, handleTestimonialSubmission } from "./handlers/testimonials.js";

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

    if (request.method === "GET" && url.pathname === "/api/testimonials") {
      return handleApprovedTestimonials(env);
    }

    if (request.method === "POST" && url.pathname === "/api/testimonials") {
      return handleTestimonialSubmission(request, env);
    }
		return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<ApplicationEnv>;
