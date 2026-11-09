import { describe, expect, test } from "bun:test";
import type { HomepageData } from "@bookrate/types";
import { HomepageService } from "./homepage.service";

const emptyHomepage: HomepageData = {
  featuredBook: null,
  popularBooks: [],
  highestRatedBooks: [],
  recentlyAddedBooks: [],
  recommendedBooks: [],
  categories: [],
  genres: [],
  recentReviews: [],
  stats: { books: 0, readers: 0, reviews: 0 },
};

describe("HomepageService", () => {
  test("returns public discovery data from its repository", async () => {
    const repository = {
      getHomepageData: async () => ({
        ...emptyHomepage,
        featuredBook: {
          id: "book-1",
          slug: "laut-bercerita",
          title: "Laut Bercerita",
          authors: ["Leila S. Chudori"],
          categories: ["Fiksi"],
          genres: ["Novel"],
          coverImage: null,
          publishedYear: 2017,
          rating: 4.8,
          reviewCount: 2,
        },
        popularBooks: [],
        stats: { books: 1, readers: 2, reviews: 2 },
      }),
    };
    const service = new HomepageService(repository);

    await expect(service.getHomepageData()).resolves.toMatchObject({
      featuredBook: { slug: "laut-bercerita" },
      stats: { books: 1, readers: 2, reviews: 2 },
    });
  });

  test("preserves empty database results for the UI to present explicitly", async () => {
    const service = new HomepageService({
      getHomepageData: async () => emptyHomepage,
    });

    await expect(service.getHomepageData()).resolves.toEqual(emptyHomepage);
  });
});
