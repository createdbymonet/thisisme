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
    "/api/admin/login": {
      post: {
        summary: "Authenticate an administrator",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { credential: { type: "string", minLength: 16, maxLength: 512 } }, required: ["credential"], additionalProperties: false } } } },
        responses: { "200": { description: "Authenticated; sets the admin session cookie." }, "400": { $ref: "#/components/responses/InvalidRequest" }, "401": { $ref: "#/components/responses/AdminUnauthorized" } },
      },
    },
    "/api/admin/session": {
      get: { summary: "Check the admin session", security: [{ adminSession: [] }], responses: { "200": { description: "The admin session is valid." }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
    },
    "/api/admin/logout": {
      post: { summary: "End the admin session", security: [{ adminSession: [] }], responses: { "200": { description: "The server session and cookie were cleared." }, "400": { $ref: "#/components/responses/InvalidRequest" } } },
    },
    "/api/admin/access-codes": {
      get: { summary: "List access codes", security: [{ adminSession: [] }], responses: { "200": { description: "Decrypted company names and safe access-code metadata." }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
      post: { summary: "Issue a company access code", security: [{ adminSession: [] }], requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { companyName: { type: "string", minLength: 2, maxLength: 160 }, expiresAt: { type: "string", format: "date-time" } }, required: ["companyName"], additionalProperties: false } } } }, responses: { "201": { description: "The plaintext access code is returned once." }, "400": { $ref: "#/components/responses/InvalidRequest" }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
    },
    "/api/admin/access-codes/{id}/reissue": {
      post: { summary: "Reissue an access code", security: [{ adminSession: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }], responses: { "200": { description: "A new plaintext code is returned once; the prior code is invalid." }, "400": { $ref: "#/components/responses/InvalidRequest" }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
    },
    "/api/admin/access-codes/{id}": {
      patch: { summary: "Update access-code activation and expiration", security: [{ adminSession: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }], responses: { "200": { description: "Access-code settings updated." }, "400": { $ref: "#/components/responses/InvalidRequest" }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
    },
    "/api/admin/testimonials": {
      get: { summary: "List testimonials for moderation", security: [{ adminSession: [] }], responses: { "200": { description: "Deliberate decrypted moderation models." }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
    },
    "/api/admin/testimonials/{id}/{decision}": {
      post: { summary: "Approve or reject a pending testimonial", security: [{ adminSession: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }, { name: "decision", in: "path", required: true, schema: { type: "string", enum: ["approve", "reject"] } }], responses: { "200": { description: "The testimonial was reviewed." }, "400": { $ref: "#/components/responses/InvalidRequest" }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
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
    "/api/analytics/events": {
      post: {
        summary: "Record an authorized company analytics event",
        description: "Accepts only allowlisted normalized events; company and session context are derived from protected authorization.",
        requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { eventType: { type: "string", enum: ["page_view", "section_view", "engagement"] }, pageKey: { type: "string", enum: ["home", "recommend", "access", "private"] }, sectionKey: { type: "string", enum: ["hero", "skills", "experience", "projects", "about", "testimonials", "contact", "protected-profile"] }, durationMs: { type: "integer", minimum: 0, maximum: 300000 } }, required: ["eventType", "pageKey"], additionalProperties: false } } } },
        responses: { "204": { description: "Accepted, or safely ignored without authorized company context." }, "400": { $ref: "#/components/responses/InvalidRequest" } },
      },
    },
    "/api/admin/analytics/summary": {
      get: { summary: "Get aggregate company analytics", security: [{ adminSession: [] }], responses: { "200": { description: "Aggregate session, view, download, and estimated-engagement metrics." }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
    },
    "/api/admin/analytics/companies": {
      get: { summary: "List company analytics aggregates", security: [{ adminSession: [] }], responses: { "200": { description: "Company-level aggregate analytics with decrypted display names." }, "401": { $ref: "#/components/responses/AdminUnauthorized" } } },
    },
    "/api/admin/analytics/companies/{companyCode}": {
      get: { summary: "Get one company's analytics aggregates", security: [{ adminSession: [] }], parameters: [{ name: "companyCode", in: "path", required: true, schema: { type: "string", format: "uuid" } }], responses: { "200": { description: "Page, section, duration, private-profile, and resume aggregates." }, "401": { $ref: "#/components/responses/AdminUnauthorized" }, "404": { description: "No analytics exist for the company." } } },
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
    "/api/private/resume": {
      get: {
        summary: "View or download the authorized resume",
        description: "Requires the short-lived protected-profile session cookie.",
        security: [{ protectedProfileSession: [] }],
        parameters: [{ name: "download", in: "query", required: false, schema: { type: "boolean", default: false } }],
        responses: {
          "200": { description: "The resume PDF, returned inline by default or as an attachment when download=true.", content: { "application/pdf": {} } },
          "401": { $ref: "#/components/responses/AuthorizationRequired" },
          "404": { description: "The resume is unavailable." },
          "503": { description: "Resume storage is not configured for this environment." },
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
      adminSession: {
        type: "apiKey",
        in: "cookie",
        name: "__Host-thisisme_admin",
        description: "Short-lived opaque administrator session.",
      },
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
      AdminUnauthorized: {
        description: "A valid administrator session is required.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
      InvalidRequest: {
        description: "The request is invalid or failed origin validation.",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
      },
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
