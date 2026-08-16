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
    "/api/access/validate": {
      post: {
        summary: "Validate a protected-profile access code",
        description: "Creates a short-lived, HttpOnly authorization session cookie when the code is valid.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  accessCode: { type: "string", minLength: 12, maxLength: 256 },
                },
                required: ["accessCode"],
                additionalProperties: false,
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Access authorized. A secure session cookie is set.",
            headers: {
              "Set-Cookie": {
                description: "Short-lived HttpOnly, Secure, SameSite=Lax session cookie.",
                schema: { type: "string" },
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { authorized: { type: "boolean", const: true } },
                  required: ["authorized"],
                  additionalProperties: false,
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/UnauthorizedAccessCode" },
          "500": { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },
    "/api/private-profile": {
      get: {
        summary: "Get the authorized protected profile",
        description: "Requires the short-lived protected-profile session cookie.",
        security: [{ protectedProfileSession: [] }],
        responses: {
          "200": {
            description: "The decrypted protected profile, or null when no profile has been configured.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    profile: {
                      oneOf: [
                        { $ref: "#/components/schemas/PrivateProfile" },
                        { type: "null" },
                      ],
                    },
                  },
                  required: ["profile"],
                  additionalProperties: false,
                },
              },
            },
          },
          "401": { $ref: "#/components/responses/AuthorizationRequired" },
          "500": { $ref: "#/components/responses/InternalServerError" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      protectedProfileSession: {
        type: "apiKey",
        in: "cookie",
        name: "__Host-thisisme_session",
        description: "Opaque server-issued protected-profile session.",
      },
    },
    schemas: {
      PrivateProfile: {
        type: "object",
        properties: {
          legalName: { type: "string" },
          employment: { type: "array", items: { type: "string" } },
          education: { type: "array", items: { type: "string" } },
          certifications: { type: "array", items: { type: "string" } },
          resume: { oneOf: [{ type: "string" }, { type: "null" }] },
        },
        required: ["legalName", "employment", "education", "certifications", "resume"],
        additionalProperties: false,
      },
      Error: {
        type: "object",
        properties: { error: { type: "string" } },
        required: ["error"],
        additionalProperties: false,
      },
    },
    responses: {
      UnauthorizedAccessCode: {
        description: "The access code is invalid or expired.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Error" } },
        },
      },
      AuthorizationRequired: {
        description: "A valid protected-profile session is required.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Error" } },
        },
      },
      InternalServerError: {
        description: "The request could not be completed.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Error" } },
        },
      },
    },
  },
} as const;
