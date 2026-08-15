import { openApiDocument } from "./openapi.js";

export default {
  fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return Response.json({ status: "ok" });
    }

    if (request.method === "GET" && url.pathname === "/api/openapi.json") {
      return Response.json(openApiDocument);
    }
		return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
