import { Inject, Injectable } from "@nestjs/common";
import type {
  HomepageBook,
  HomepageData,
  HomepageReview,
  HomepageTaxonomy,
} from "@bookrate/types";
import type { PrismaClient } from "@bookrate/database";
import { PRISMA_CLIENT } from "../auth/auth.tokens";

export const HOMEPAGE_REPOSITORY = Symbol("HOMEPAGE_REPOSITORY");

export interface HomepageRepository {
  getHomepageData(): Promise<HomepageData>;
}

const bookSummarySelect = {
  id: true,
  slug: true,
  title: true,
  coverImage: true,
  publishedYear: true,
  authors: { select: { name: true } },
  categories: { select: { name: true } },
  genres: { select: { name: true } },
  _count: { select: { reviews: true } },
} as const;

function toHomepageBook(
  book: {
    id: string;
    slug: string;
    title: string;
    coverImage: string | null;
    publishedYear: number | null;
    authors: { name: string }[];
    categories: { name: string }[];
    genres: { name: string }[];
    _count: { reviews: number };
  },
  rating: number | null = null,
  reviewCount = book._count.reviews,
): HomepageBook {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    authors: book.authors.map((author) => author.name),
    categories: book.categories.map((category) => category.name),
    genres: book.genres.map((genre) => genre.name),
    coverImage: book.coverImage,
    publishedYear: book.publishedYear,
    rating,
    reviewCount,
  };
}

function toTaxonomy(item: {
  name: string;
  slug: string;
  _count: { books: number };
}): HomepageTaxonomy {
  return {
    name: item.name,
    slug: item.slug,
    bookCount: item._count.books,
  };
}

function toReview(review: {
  id: string;
  rating: number;
  content: string;
  createdAt: Date;
  user: { name: string | null };
  book: { title: string; slug: string };
}): HomepageReview {
  const content = review.content.trim().replace(/\s+/g, " ");
  const excerpt =
    content.length > 220 ? `${content.slice(0, 217)}...` : content;

  return {
    id: review.id,
    rating: review.rating,
    excerpt,
    createdAt: review.createdAt.toISOString(),
    readerName: review.user.name ?? "Pembaca",
    book: review.book,
  };
}

@Injectable()
export class PrismaHomepageRepository implements HomepageRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly database: PrismaClient) {}

  async getHomepageData(): Promise<HomepageData> {
    const [
      popularRows,
      ratingGroups,
      recentlyAddedRows,
      categoryRows,
      genreRows,
      reviewRows,
      bookCount,
      readerCount,
      reviewCount,
    ] = await Promise.all([
      this.database.book.findMany({
        where: { reviews: { some: {} } },
        orderBy: [{ reviews: { _count: "desc" } }, { title: "asc" }],
        take: 6,
        select: bookSummarySelect,
      }),
      this.database.review.groupBy({
        by: ["bookId"],
        _avg: { rating: true },
        _count: { rating: true },
        orderBy: [{ _avg: { rating: "desc" } }, { _count: { rating: "desc" } }],
        take: 6,
      }),
      this.database.book.findMany({
        orderBy: [{ createdAt: "desc" }, { title: "asc" }],
        take: 6,
        select: bookSummarySelect,
      }),
      this.database.category.findMany({
        orderBy: [{ books: { _count: "desc" } }, { name: "asc" }],
        take: 8,
        select: {
          name: true,
          slug: true,
          _count: { select: { books: true } },
        },
      }),
      this.database.genre.findMany({
        orderBy: [{ books: { _count: "desc" } }, { name: "asc" }],
        take: 8,
        select: {
          name: true,
          slug: true,
          _count: { select: { books: true } },
        },
      }),
      this.database.review.findMany({
        orderBy: [{ createdAt: "desc" }, { id: "asc" }],
        take: 4,
        select: {
          id: true,
          rating: true,
          content: true,
          createdAt: true,
          user: { select: { name: true } },
          book: { select: { title: true, slug: true } },
        },
      }),
      this.database.book.count(),
      this.database.user.count(),
      this.database.review.count(),
    ]);

    const ratedBooks = await this.database.book.findMany({
      where: { id: { in: ratingGroups.map((group) => group.bookId) } },
      select: bookSummarySelect,
    });
    const ratedBooksById = new Map(
      ratedBooks.map((book) => [book.id, book] as const),
    );
    const highestRatedBooks = ratingGroups.flatMap((group) => {
      const book = ratedBooksById.get(group.bookId);
      return book
        ? [toHomepageBook(book, group._avg.rating, group._count.rating)]
        : [];
    });
    const popularBooks = popularRows.map((book) => toHomepageBook(book));

    return {
      featuredBook: popularBooks[0] ?? null,
      popularBooks,
      highestRatedBooks,
      recentlyAddedBooks: recentlyAddedRows.map((book) => toHomepageBook(book)),
      recommendedBooks: popularBooks,
      categories: categoryRows.map(toTaxonomy),
      genres: genreRows.map(toTaxonomy),
      recentReviews: reviewRows.map(toReview),
      stats: { books: bookCount, readers: readerCount, reviews: reviewCount },
    };
  }
}
