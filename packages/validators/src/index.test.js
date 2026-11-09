import { describe, expect, test } from "bun:test";
import {
  bookCreateSchema,
  bookUpdateSchema,
  catalogQuerySchema,
  categoryCreateSchema,
  favoriteInputSchema,
  genreCreateSchema,
  loginInputSchema,
  profileUpdateSchema,
  readingListInputSchema,
  registerInputSchema,
  reviewCreateSchema,
  reviewQuerySchema,
  reviewUpdateSchema,
} from "./index";

describe("authentication and profile schemas", () => {
  test("normalizes registration fields and accepts password boundaries", () => {
    expect(
      registerInputSchema.parse({
        name: "  Ayu  ",
        email: " Ayu@Example.invalid ",
        password: "a-secure-pass",
      }),
    ).toEqual({
      name: "Ayu",
      email: "ayu@example.invalid",
      password: "a-secure-pass",
    });
    expect(
      registerInputSchema.safeParse({
        name: "A",
        email: "a@example.invalid",
        password: "a".repeat(12),
      }).success,
    ).toBe(true);
    expect(
      registerInputSchema.safeParse({
        name: "A",
        email: "a@example.invalid",
        password: "short",
      }).success,
    ).toBe(false);
    expect(
      registerInputSchema.safeParse({
        name: "A",
        email: "not-an-email",
        password: "a-secure-pass",
      }).success,
    ).toBe(false);
  });

  test("allows existing shorter passwords at login but rejects empty credentials", () => {
    expect(
      loginInputSchema.safeParse({
        email: "ayu@example.invalid",
        password: "legacy",
      }).success,
    ).toBe(true);
    expect(
      loginInputSchema.safeParse({
        email: "ayu@example.invalid",
        password: "",
      }).success,
    ).toBe(false);
  });

  test("requires a non-empty profile update and accepts only HTTP image URLs", () => {
    expect(profileUpdateSchema.safeParse({}).success).toBe(false);
    expect(
      profileUpdateSchema.safeParse({ image: "javascript:alert(1)" }).success,
    ).toBe(false);
    expect(
      profileUpdateSchema.parse({
        image: "https://example.invalid/avatar.png",
      }),
    ).toEqual({
      image: "https://example.invalid/avatar.png",
    });
    expect(profileUpdateSchema.parse({ bio: null })).toEqual({ bio: null });
  });
});

describe("catalog and taxonomy schemas", () => {
  test("validates book metadata, normalizes ISBN, and applies collection defaults", () => {
    expect(
      bookCreateSchema.parse({
        title: "Laut Bercerita",
        slug: "laut-bercerita",
        isbn: "978-1-4028-9462-6",
        coverImage: "https://example.invalid/cover.jpg",
      }),
    ).toMatchObject({
      title: "Laut Bercerita",
      slug: "laut-bercerita",
      isbn: "9781402894626",
      authorIds: [],
      categoryIds: [],
      genreIds: [],
    });
    expect(
      bookCreateSchema.safeParse({
        title: "Book",
        slug: "book",
        isbn: "123",
      }).success,
    ).toBe(false);
    expect(
      bookCreateSchema.safeParse({
        title: "Book",
        slug: "not a slug",
        pageCount: 0,
      }).success,
    ).toBe(false);
  });

  test("requires at least one valid field for book updates", () => {
    expect(bookUpdateSchema.safeParse({}).success).toBe(false);
    expect(bookUpdateSchema.safeParse({ pageCount: 100_001 }).success).toBe(
      false,
    );
    expect(bookUpdateSchema.safeParse({ title: "Updated title" }).success).toBe(
      true,
    );
  });

  test("validates category and genre names, slugs, and descriptions", () => {
    expect(
      categoryCreateSchema.safeParse({
        name: "Fiksi",
        slug: "fiksi",
        description: "Cerita rekaan",
      }).success,
    ).toBe(true);
    expect(
      genreCreateSchema.safeParse({
        name: "Fiksi ilmiah",
        slug: "fiksi-ilmiah",
      }).success,
    ).toBe(true);
    expect(
      categoryCreateSchema.safeParse({ name: "Invalid", slug: "Upper Case" })
        .success,
    ).toBe(false);
  });

  test("coerces and bounds catalog and review pagination filters", () => {
    expect(
      catalogQuerySchema.parse({
        page: "2",
        pageSize: "50",
        minRating: "4",
        category: "fiksi",
      }),
    ).toMatchObject({
      page: 2,
      pageSize: 50,
      minRating: 4,
      sort: "newest",
      direction: "desc",
    });
    expect(catalogQuerySchema.safeParse({ minRating: "6" }).success).toBe(
      false,
    );
    expect(catalogQuerySchema.safeParse({ pageSize: "101" }).success).toBe(
      false,
    );
    expect(reviewQuerySchema.parse({ sort: "likes", page: "1" }).pageSize).toBe(
      20,
    );
    expect(reviewQuerySchema.safeParse({ sort: "popular" }).success).toBe(
      false,
    );
  });
});

describe("reading and review schemas", () => {
  test("restricts review ratings to whole stars from one through five", () => {
    for (const rating of [1, 5]) {
      expect(
        reviewCreateSchema.safeParse({
          bookId: "book-1",
          rating,
          content: "A thoughtful read.",
        }).success,
      ).toBe(true);
    }

    for (const rating of [0, 6, 2.5]) {
      expect(
        reviewCreateSchema.safeParse({
          bookId: "book-1",
          rating,
          content: "A thoughtful read.",
        }).success,
      ).toBe(false);
    }

    expect(
      reviewCreateSchema.safeParse({
        bookId: "book-1",
        rating: 5,
        content: "   ",
      }).success,
    ).toBe(false);
    expect(reviewUpdateSchema.safeParse({}).success).toBe(false);
  });

  test("accepts only supported reading statuses and favorite inputs", () => {
    for (const status of ["WANT_TO_READ", "CURRENTLY_READING", "READ"]) {
      expect(
        readingListInputSchema.safeParse({ bookId: "book-1", status }).success,
      ).toBe(true);
    }
    expect(
      readingListInputSchema.safeParse({
        bookId: "book-1",
        status: "GUEST",
      }).success,
    ).toBe(false);
    expect(favoriteInputSchema.safeParse({ bookId: "book-1" }).success).toBe(
      true,
    );
    expect(favoriteInputSchema.safeParse({ bookId: "" }).success).toBe(false);
  });
});
