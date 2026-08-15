export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "This is me API",
    version: "1.0.0",
  },
  paths: {
    "/api/health": {
      get: {
        summary: "Check API health",
        responses: {
          "200": {
            description: "The API is available.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: {
                      type: "string",
                      const: "ok",
                    },
                  },
                  required: ["status"],
                  additionalProperties: false,
                },
                example: {
                  status: "ok",
                },
              },
            },
          },
        },
      },
    },
  },
} as const;
