import { openApiDocument } from "./openapi.js";

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
		return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
