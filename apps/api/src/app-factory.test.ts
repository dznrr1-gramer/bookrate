import "reflect-metadata";
import { afterEach, describe, expect, setDefaultTimeout, test } from "bun:test";
import type { INestApplication } from "@nestjs/common";
import { createApiApplication } from "./app-factory";

const config = {
  DATABASE_URL: "postgresql://test:test@localhost:5432/bookrate",
  API_PORT: 0,
  WEB_ORIGIN: "http://localhost:3000",
  AUTH_JWT_SECRET: "test-secret-that-is-long-enough-for-jwt",
};

setDefaultTimeout(30_000);

describe("BookRate API bootstrap", () => {
  let app: INestApplication | undefined;
  let baseUrl: string;

  afterEach(async () => {
    await app?.close();
    app = undefined;
  });

  async function startApp() {
    app = await createApiApplication(config, { logger: false });
    await app.listen(0, "127.0.0.1");
    const address = app.getHttpServer().address();
    if (!address || typeof address === "string") {
      throw new Error("The test API server did not bind to a TCP port.");
    }
    baseUrl = `http://127.0.0.1:${address.port}/api/v1`;
  }

  test("serves a versioned health endpoint and OpenAPI document", async () => {
    await startApp();

    const healthResponse = await fetch(`${baseUrl}/health`);
    expect(healthResponse.status).toBe(200);
    expect(await healthResponse.json()).toEqual({ status: "ok" });

    const openApiResponse = await fetch(`${baseUrl}/docs/openapi.json`);
    expect(openApiResponse.status).toBe(200);
    const openApi = (await openApiResponse.json()) as {
      openapi: string;
      paths: Record<string, unknown>;
    };
    expect(openApi.openapi).toStartWith("3.");
    expect(openApi.paths["/api/v1/health"]).toBeDefined();
  });

  test("validates request bodies and returns a consistent error envelope", async () => {
    await startApp();

    const response = await fetch(`${baseUrl}/validation/reviews`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        bookId: "book-1",
        rating: 6,
        content: "",
      }),
    });
    expect(response.status).toBe(400);

    const payload = (await response.json()) as {
      statusCode: number;
      error: { code: string; message: string; issues: unknown[] };
      path: string;
      timestamp: string;
    };
    expect(payload.statusCode).toBe(400);
    expect(payload.error.code).toBe("VALIDATION_FAILED");
    expect(payload.error.issues.length).toBeGreaterThan(0);
    expect(payload.path).toBe("/api/v1/validation/reviews");
    expect(Number.isNaN(Date.parse(payload.timestamp))).toBe(false);
  });

  test("allows the configured CORS origin and rejects other origins", async () => {
    await startApp();

    const allowedResponse = await fetch(`${baseUrl}/health`, {
      headers: { origin: config.WEB_ORIGIN },
    });
    expect(allowedResponse.headers.get("access-control-allow-origin")).toBe(
      config.WEB_ORIGIN,
    );
    expect(
      allowedResponse.headers.get("access-control-allow-credentials"),
    ).toBe("true");

    const rejectedResponse = await fetch(`${baseUrl}/health`, {
      headers: { origin: "http://attacker.example.invalid" },
    });
    expect(
      rejectedResponse.headers.get("access-control-allow-origin"),
    ).toBeNull();
  });

  test("requires the configured origin for state-changing auth requests", async () => {
    await startApp();

    const missingOrigin = await fetch(`${baseUrl}/auth/logout`, {
      method: "POST",
    });
    expect(missingOrigin.status).toBe(403);

    const allowedOrigin = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: {
        origin: config.WEB_ORIGIN,
        "content-type": "application/json",
      },
      body: JSON.stringify({ email: "invalid", password: "" }),
    });
    expect(allowedOrigin.status).toBe(400);
    expect(allowedOrigin.headers.get("access-control-allow-origin")).toBe(
      config.WEB_ORIGIN,
    );
    expect(allowedOrigin.headers.get("access-control-allow-credentials")).toBe(
      "true",
    );
  });

  test("omits development-only validation routes and docs in production", async () => {
    app = await createApiApplication(config, {
      logger: false,
      isProduction: true,
    });
    await app.listen(0, "127.0.0.1");
    const address = app.getHttpServer().address();
    if (!address || typeof address === "string") {
      throw new Error("The test API server did not bind to a TCP port.");
    }
    baseUrl = `http://127.0.0.1:${address.port}/api/v1`;

    expect((await fetch(`${baseUrl}/validation/reviews`)).status).toBe(404);
    expect((await fetch(`${baseUrl}/docs/openapi.json`)).status).toBe(404);

    const refreshResponse = await fetch(`${baseUrl}/auth/refresh`, {
      method: "POST",
      headers: { origin: config.WEB_ORIGIN },
    });
    expect(refreshResponse.status).toBe(401);
    expect(refreshResponse.headers.get("set-cookie")).toContain("Secure");
    expect(refreshResponse.headers.get("set-cookie")).toContain("HttpOnly");
    expect(refreshResponse.headers.get("set-cookie")).toContain("SameSite=Lax");
  });

  test("requires an explicit JWT secret for production startup", async () => {
    await expect(
      createApiApplication(
        { ...config, AUTH_JWT_SECRET: undefined },
        { logger: false, isProduction: true },
      ),
    ).rejects.toThrow("AUTH_JWT_SECRET is required in production.");
  });
});
