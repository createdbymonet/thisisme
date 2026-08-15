export default {
  fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/api/health") {
      return Response.json({ status: "ok" });
    }
		return new Response(null, { status: 404 });
  },
} satisfies ExportedHandler<Env>;
