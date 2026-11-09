import { afterEach, describe, expect, test } from "bun:test";
import { apiClient, apiRequest } from "./api";

const originalFetch = globalThis.fetch;
const originalApiUrl = process.env.NEXT_PUBLIC_API_URL;

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalApiUrl === undefined) {
    delete process.env.NEXT_PUBLIC_API_URL;
  } else {
    process.env.NEXT_PUBLIC_API_URL = originalApiUrl;
  }
});

describe("web API client", () => {
  test("calls the configured API without sending ambient credentials", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api/v1";
    globalThis.fetch = async (input, init) => {
      expect(String(input)).toBe("http://localhost:4000/api/v1/health");
      expect(init.credentials).toBe("omit");
      return Response.json({ status: "ok" });
    };

    expect(await apiClient.health()).toEqual({ status: "ok" });
  });

  test("loads public homepage data without ambient credentials", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api/v1";
    globalThis.fetch = async (input, init) => {
      expect(String(input)).toBe("http://localhost:4000/api/v1/homepage");
      expect(init.credentials).toBe("omit");
      return Response.json({
        featuredBook: null,
        popularBooks: [],
        highestRatedBooks: [],
        recentlyAddedBooks: [],
        recommendedBooks: [],
        categories: [],
        genres: [],
        recentReviews: [],
        stats: { books: 0, readers: 0, reviews: 0 },
      });
    };

    await expect(apiClient.homepage()).resolves.toMatchObject({
      featuredBook: null,
      stats: { books: 0 },
    });
  });

  test("sends catalog filters as query parameters without ambient credentials", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api/v1";
    globalThis.fetch = async (input, init) => {
      expect(String(input)).toBe(
        "http://localhost:4000/api/v1/books?search=Laut&category=fiksi&minRating=4&page=2",
      );
      expect(init.credentials).toBe("omit");
      return Response.json({
        items: [],
        categories: [],
        genres: [],
        pagination: { page: 2, pageSize: 20, total: 0, totalPages: 0 },
      });

      test("encodes book slugs and forwards review pagination", async () => {
        process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api/v1";
        globalThis.fetch = async (input, init) => {
          expect(String(input)).toBe(
            "http://localhost:4000/api/v1/books/laut-bercerita?sort=rating&page=2",
          );
          expect(init.credentials).toBe("omit");
          return Response.json({
            book: {
              id: "book-1",
              slug: "laut-bercerita",
              title: "Laut Bercerita",
            },
            reviews: [],
            relatedBooks: [],
            pagination: { page: 2, pageSize: 20, total: 0, totalPages: 0 },
          });
        };

        await expect(
          apiClient.bookDetail(
            "laut-bercerita",
            new URLSearchParams("sort=rating&page=2"),
          ),
        ).resolves.toMatchObject({
          book: { slug: "laut-bercerita" },
          pagination: { page: 2 },
        });
      });
    };

    await expect(
      apiClient.catalog(
        new URLSearchParams("search=Laut&category=fiksi&minRating=4&page=2"),
      ),
    ).resolves.toMatchObject({ pagination: { page: 2, total: 0 } });
  });

  test("includes browser cookies only for explicit authentication requests", async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000/api/v1";
    globalThis.fetch = async (input, init) => {
      expect(String(input)).toBe("http://localhost:4000/api/v1/auth/login");
      expect(init.credentials).toBe("include");
      expect(init.method).toBe("POST");
      expect(JSON.parse(init.body)).toEqual({
        email: "reader@example.invalid",
        password: "a-secure-password",
      });
      return Response.json({
        user: { id: "reader-1", email: "reader@example.invalid", role: "USER" },
      });
    };

    await expect(
      apiClient.auth.login({
        email: "reader@example.invalid",
        password: "a-secure-password",
      }),
    ).resolves.toMatchObject({ user: { id: "reader-1" } });
  });

  test("surfaces API errors without hiding the status or error code", async () => {
    globalThis.fetch = async () =>
      Response.json(
        { error: { code: "VALIDATION_FAILED", message: "Invalid request." } },
        { status: 400 },
      );

    await expect(apiRequest("health")).rejects.toMatchObject({
      name: "ApiClientError",
      status: 400,
      code: "VALIDATION_FAILED",
      message: "Invalid request.",
    });
  });

  test("does not allow request paths to escape the configured API base URL", async () => {
    await expect(apiRequest("../health")).rejects.toThrow(
      "API request path must remain under the configured API base URL.",
    );
  });
});
