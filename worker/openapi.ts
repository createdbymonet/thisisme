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
    "/api/testimonials": {
      get: {
        summary: "List approved testimonials",
        description: "Returns only approved testimonials with server-applied name privacy rules.",
        responses: {
          "200": {
            description: "Public approved testimonials.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    testimonials: {
                      type: "array",
                      items: { $ref: "#/components/schemas/PublicTestimonial" },
                    },
                  },
                  required: ["testimonials"],
                  additionalProperties: false,
                },
              },
            },
          },
          "500": { $ref: "#/components/responses/InternalServerError" },
        },
      },
      post: {
        summary: "Submit a testimonial",
        description: "Valid submissions are encrypted and stored for moderation with pending status.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TestimonialSubmission" },
            },
          },
        },
        responses: {
          "201": {
            description: "The testimonial was submitted for review.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { submitted: { type: "boolean", const: true } },
                  required: ["submitted"],
                  additionalProperties: false,
                },
              },
            },
          },
          "400": { $ref: "#/components/responses/InvalidTestimonial" },
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
      TestimonialSubmission: {
        type: "object",
        properties: {
          authorName: { type: "string", minLength: 2, maxLength: 100 },
          relationship: { type: "string", minLength: 2, maxLength: 120 },
          comment: { type: "string", minLength: 10, maxLength: 2000 },
          displayPreference: { type: "string", enum: ["full_name", "partial_name", "anonymous"] },
        },
        required: ["authorName", "relationship", "comment", "displayPreference"],
        additionalProperties: false,
      },
      PublicTestimonial: {
        type: "object",
        properties: {
          authorName: { oneOf: [{ type: "string" }, { type: "null" }] },
          isAnonymous: { type: "boolean" },
          relationship: { type: "string" },
          comment: { type: "string" },
        },
        required: ["authorName", "isAnonymous", "relationship", "comment"],
        additionalProperties: false,
      },
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
      InvalidTestimonial: {
        description: "The testimonial submission is invalid.",
        content: {
          "application/json": { schema: { $ref: "#/components/schemas/Error" } },
        },
      },
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
