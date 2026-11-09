import { describe, expect, test } from "bun:test";
import { BookDetailService } from "./book-detail.service";

const emptyDetail = {
  book: {
    id: "book-1",
    slug: "laut-bercerita",
    title: "Laut Bercerita",
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
    rating: null,
    reviewCount: 0,
  },
  reviews: [],
  relatedBooks: [],
  pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
};

describe("BookDetailService", () => {
  test("returns detail data from its repository", async () => {
    const service = new BookDetailService({
      getBookDetail: async () => emptyDetail,
    });

    await expect(
      service.getBookDetail("laut-bercerita", {
        sort: "newest",
        direction: "desc",
        page: 1,
        pageSize: 20,
      }),
    ).resolves.toEqual(emptyDetail);
  });

  test("raises a not-found response for an unknown slug", async () => {
    const service = new BookDetailService({
      getBookDetail: async () => null,
    });

    await expect(
      service.getBookDetail("missing-book", {
        sort: "newest",
        direction: "desc",
        page: 1,
        pageSize: 20,
      }),
    ).rejects.toMatchObject({
      status: 404,
      response: {
        code: "BOOK_NOT_FOUND",
      },
    });
  });
});
