import { describe, expect, test } from "bun:test";
import { parseServerEnv } from "./env";

describe("parseServerEnv", () => {
  test("parses a local PostgreSQL URL and applies safe local defaults", () => {
    expect(
      parseServerEnv({
        DATABASE_URL: "postgresql://user:password@localhost:5432/bookrate",
      }),
    ).toEqual({
      DATABASE_URL: "postgresql://user:password@localhost:5432/bookrate",
      API_PORT: 4000,
      WEB_ORIGIN: "http://localhost:3000",
    });
  });

  test("parses explicitly configured server values", () => {
    expect(
      parseServerEnv({
        DATABASE_URL: "postgres://user:password@localhost:5432/bookrate",
        API_PORT: "4300",
        WEB_ORIGIN: "http://localhost:3200",
        GOOGLE_BOOKS_API_KEY: "local-placeholder",
      }),
    ).toEqual({
      DATABASE_URL: "postgres://user:password@localhost:5432/bookrate",
      API_PORT: 4300,
      WEB_ORIGIN: "http://localhost:3200",
      GOOGLE_BOOKS_API_KEY: "local-placeholder",
    });
  });

  test("requires a strong JWT secret in production", () => {
    expect(() =>
      parseServerEnv({
        DATABASE_URL: "postgresql://localhost/bookrate",
        NODE_ENV: "production",
      }),
    ).toThrow("AUTH_JWT_SECRET");
    expect(() =>
      parseServerEnv({
        DATABASE_URL: "postgresql://localhost/bookrate",
        AUTH_JWT_SECRET: "too-short",
      }),
    ).toThrow("AUTH_JWT_SECRET");

    const secret = "a".repeat(32);
    expect(
      parseServerEnv({
        DATABASE_URL: "postgresql://localhost/bookrate",
        AUTH_JWT_SECRET: secret,
      }).AUTH_JWT_SECRET,
    ).toBe(secret);
  });

  test("reports a missing required variable without echoing environment values", () => {
    expect(() => parseServerEnv({})).toThrow(
      "Invalid server environment: DATABASE_URL:",
    );
    try {
      parseServerEnv({
        DATABASE_URL: "postgresql://user:private-password@localhost/bookrate",
        API_PORT: "not-a-port",
      });
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      expect(error.message).not.toContain("private-password");
      expect(error.message).toContain("API_PORT");
    }
  });

  test("rejects non-PostgreSQL URLs and invalid ports", () => {
    expect(() =>
      parseServerEnv({
        DATABASE_URL: "https://example.com/database",
      }),
    ).toThrow("Must be a PostgreSQL connection URL");
    expect(() =>
      parseServerEnv({
        DATABASE_URL: "postgresql://localhost/bookrate",
        API_PORT: "70000",
      }),
    ).toThrow("API_PORT");
  });

  test("requires WEB_ORIGIN to be an origin without a path", () => {
    expect(() =>
      parseServerEnv({
        DATABASE_URL: "postgresql://localhost/bookrate",
        WEB_ORIGIN: "http://localhost:3000/path",
      }),
    ).toThrow("WEB_ORIGIN");
    expect(() =>
      parseServerEnv({
        DATABASE_URL: "postgresql://localhost/bookrate",
        WEB_ORIGIN: "not-an-origin",
      }),
    ).toThrow("WEB_ORIGIN");
  });
});
