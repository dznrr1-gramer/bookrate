import { describe, expect, test } from "bun:test";
import type { PrismaClient } from "@bookrate/database";
import { PrismaBookDetailRepository } from "./book-detail.repository";

const book = {
  id: "book-1",
  slug: "laut-bercerita",
  title: "Laut Bercerita",
  description: "Cerita tentang persahabatan dan kehilangan.",
  isbn: null,
  publishedYear: 2017,
  pageCount: 379,
  language: "id",
  coverImage: null,
  authors: [{ name: "Leila S. Chudori" }],
  publisher: { name: "Kepustakaan Populer Gramedia" },
  categories: [{ id: "category-fiction", name: "Fiksi", slug: "fiksi" }],
  genres: [
    {
      id: "genre-historical",
      name: "Historical Fiction",
      slug: "historical-fiction",
    },
  ],
};

const relatedBook = {
  id: "book-2",
  slug: "pulang",
  title: "Pulang",
  coverImage: null,
  publishedYear: 2015,
  authors: [{ name: "Tere Liye" }],
  categories: [{ name: "Fiksi" }],
  genres: [{ name: "Historical Fiction" }],
  _count: { reviews: 1 },
};

describe("PrismaBookDetailRepository", () => {
  test("returns metadata, paginated reviews, aggregates, and related books", async () => {
    let reviewQuery: unknown;
    let relatedQuery: unknown;
    const database = {
      book: {
        findUnique: async () => book,
        findMany: async (args: unknown) => {
          relatedQuery = args;
          return [relatedBook];
        },
      },
      review: {
        aggregate: async () => ({
          _avg: { rating: 4.5 },
          _count: { rating: 2 },
        }),
        count: async () => 2,
        findMany: async (args: unknown) => {
          reviewQuery = args;
          return [
            {
              id: "review-2",
              rating: 5,
              content: "Kisah yang berkesan.",
              createdAt: new Date("2026-01-02T03:04:05.000Z"),
              user: { name: "Ayu Pembaca" },
              _count: { likes: 3 },
            },
          ];
        },
        groupBy: async () => [
          {
            bookId: relatedBook.id,
            _avg: { rating: 3.5 },
            _count: { rating: 1 },
          },
        ],
      },
    };
    const repository = new PrismaBookDetailRepository(
      database as unknown as PrismaClient,
    );

    const result = await repository.getBookDetail("laut-bercerita", {
      sort: "likes",
      direction: "desc",
      page: 2,
      pageSize: 1,
    });

    expect(result).toMatchObject({
      book: {
        title: "Laut Bercerita",
        description: "Cerita tentang persahabatan dan kehilangan.",
        publisher: "Kepustakaan Populer Gramedia",
        rating: 4.5,
        reviewCount: 2,
        categories: [{ slug: "fiksi" }],
        genres: [{ slug: "historical-fiction" }],
      },
      reviews: [
        {
          rating: 5,
          readerName: "Ayu Pembaca",
          likeCount: 3,
        },
      ],
      relatedBooks: [{ slug: "pulang", rating: 3.5, reviewCount: 1 }],
      pagination: { page: 2, pageSize: 1, total: 2, totalPages: 2 },
    });
    expect(reviewQuery).toMatchObject({
      skip: 1,
      take: 1,
      orderBy: [
        { likes: { _count: "desc" } },
        { createdAt: "desc" },
        { id: "asc" },
      ],
    });
    expect(relatedQuery).toMatchObject({
      where: {
        id: { not: "book-1" },
        OR: [
          { categories: { some: { id: { in: ["category-fiction"] } } } },
          { genres: { some: { id: { in: ["genre-historical"] } } } },
        ],
      },
      take: 4,
    });
  });

  test("preserves missing metadata and does not invent related books", async () => {
    let relatedQueryCount = 0;
    const database = {
      book: {
        findUnique: async () => ({
          id: "minimal-book",
          slug: "minimal-book",
          title: "Minimal Book",
          description: null,
          isbn: null,
          publishedYear: null,
          pageCount: null,
          language: null,
          coverImage: null,
          authors: [],
          publisher: null,
          categories: [],
          genres: [],
        }),
        findMany: async () => {
          relatedQueryCount += 1;
          return [];
        },
      },
      review: {
        aggregate: async () => ({
          _avg: { rating: null },
          _count: { rating: 0 },
        }),
        count: async () => 0,
        findMany: async () => [],
        groupBy: async () => [],
      },
    };
    const repository = new PrismaBookDetailRepository(
      database as unknown as PrismaClient,
    );

    const result = await repository.getBookDetail("minimal-book", {
      sort: "newest",
      direction: "desc",
      page: 1,
      pageSize: 20,
    });

    expect(result).toMatchObject({
      book: {
        description: null,
        isbn: null,
        publishedYear: null,
        pageCount: null,
        language: null,
        coverImage: null,
        authors: [],
        publisher: null,
        rating: null,
        reviewCount: 0,
      },
      reviews: [],
      relatedBooks: [],
      pagination: { total: 0, totalPages: 0 },
    });
    expect(relatedQueryCount).toBe(0);
  });
});
