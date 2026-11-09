import { describe, expect, test } from "bun:test";
import type { PrismaClient } from "@bookrate/database";
import { PrismaCatalogRepository } from "./catalog.repository";

const book = {
  id: "book-1",
  slug: "laut-bercerita",
  title: "Laut Bercerita",
  coverImage: null,
  publishedYear: 2017,
  authors: [{ name: "Leila S. Chudori" }],
  categories: [{ name: "Fiksi" }],
  genres: [{ name: "Novel" }],
  _count: { reviews: 2 },
};

describe("PrismaCatalogRepository", () => {
  test("combines search, taxonomy, and average-rating filters before rating pagination", async () => {
    const calls: unknown[] = [];
    const matchingRating = {
      bookId: book.id,
      _avg: { rating: 4.5 },
      _count: { rating: 2 },
    };
    const database = {
      category: { findMany: async () => [] },
      genre: { findMany: async () => [] },
      review: {
        groupBy: async (args: unknown) => {
          calls.push(args);
          return [matchingRating];
        },
      },
      book: {
        count: async () => 1,
        findMany: async () => [book],
      },
    };
    const repository = new PrismaCatalogRepository(
      database as unknown as PrismaClient,
    );

    const result = await repository.getCatalog({
      search: "Laut",
      category: "fiksi",
      genre: "novel",
      minRating: 4,
      sort: "rating",
      direction: "desc",
      page: 1,
      pageSize: 2,
    });

    expect(result.items).toMatchObject([
      {
        id: book.id,
        rating: 4.5,
        reviewCount: 2,
        categories: ["Fiksi"],
        genres: ["Novel"],
      },
    ]);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 2,
      total: 1,
      totalPages: 1,
    });
    expect(calls[0]).toMatchObject({
      where: {
        book: {
          AND: [
            {
              OR: [
                { title: { contains: "Laut", mode: "insensitive" } },
                {
                  authors: {
                    some: {
                      name: { contains: "Laut", mode: "insensitive" },
                    },
                  },
                },
                { isbn: { contains: "LAUT" } },
              ],
            },
            { categories: { some: { slug: "fiksi" } } },
            { genres: { some: { slug: "novel" } } },
          ],
        },
      },
      having: { rating: { _avg: { gte: 4 } } },
    });
    expect(calls[1]).toMatchObject({
      skip: 0,
      take: 1,
      orderBy: [
        { _avg: { rating: "desc" } },
        { _count: { rating: "desc" } },
        { bookId: "asc" },
      ],
    });
  });

  test("uses database pagination and stable popular ordering", async () => {
    let findManyArgs: unknown;
    const database = {
      category: { findMany: async () => [] },
      genre: { findMany: async () => [] },
      review: { groupBy: async () => [] },
      book: {
        count: async () => 3,
        findMany: async (args: unknown) => {
          findManyArgs = args;
          return [];
        },
      },
    };
    const repository = new PrismaCatalogRepository(
      database as unknown as PrismaClient,
    );

    const result = await repository.getCatalog({
      sort: "popular",
      direction: "desc",
      page: 2,
      pageSize: 2,
    });

    expect(result.items).toEqual([]);
    expect(result.pagination).toMatchObject({
      page: 2,
      pageSize: 2,
      total: 3,
      totalPages: 2,
    });
    expect(findManyArgs).toMatchObject({
      skip: 2,
      take: 2,
      orderBy: [
        { reviews: { _count: "desc" } },
        { title: "asc" },
        { id: "asc" },
      ],
    });
  });

  test("normalizes separators in ISBN search queries", async () => {
    let findManyArgs: unknown;
    const database = {
      category: { findMany: async () => [] },
      genre: { findMany: async () => [] },
      review: { groupBy: async () => [] },
      book: {
        count: async () => 0,
        findMany: async (args: unknown) => {
          findManyArgs = args;
          return [];
        },
      },
    };
    const repository = new PrismaCatalogRepository(
      database as unknown as PrismaClient,
    );

    await repository.getCatalog({
      search: "978-1-4028-9462-6",
      sort: "newest",
      direction: "desc",
      page: 1,
      pageSize: 20,
    });

    expect(findManyArgs).toMatchObject({
      where: {
        AND: [
          {
            OR: [
              {
                title: {
                  contains: "978-1-4028-9462-6",
                  mode: "insensitive",
                },
              },
              {
                authors: {
                  some: {
                    name: {
                      contains: "978-1-4028-9462-6",
                      mode: "insensitive",
                    },
                  },
                },
              },
              { isbn: { contains: "9781402894626" } },
            ],
          },
        ],
      },
    });
  });
});
