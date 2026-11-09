import { Inject, Injectable } from "@nestjs/common";
import type {
  BookDetailData,
  BookDetailReview,
  BookDetailTaxonomy,
  HomepageBook,
} from "@bookrate/types";
import type { ReviewQuery } from "@bookrate/validators";
import type { Prisma, PrismaClient } from "@bookrate/database";
import { PRISMA_CLIENT } from "../auth/auth.tokens";

export const BOOK_DETAIL_REPOSITORY = Symbol("BOOK_DETAIL_REPOSITORY");

export interface BookDetailRepository {
  getBookDetail(
    slug: string,
    query: ReviewQuery,
  ): Promise<BookDetailData | null>;
}

const bookDetailSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  isbn: true,
  publishedYear: true,
  pageCount: true,
  language: true,
  coverImage: true,
  authors: { select: { name: true } },
  publisher: { select: { name: true } },
  categories: { select: { id: true, name: true, slug: true } },
  genres: { select: { id: true, name: true, slug: true } },
} as const;

type BookDetailRecord = Prisma.BookGetPayload<{
  select: typeof bookDetailSelect;
}>;

const relatedBookSelect = {
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

type RelatedBookRecord = Prisma.BookGetPayload<{
  select: typeof relatedBookSelect;
}>;

function toTaxonomy(item: { name: string; slug: string }): BookDetailTaxonomy {
  return { name: item.name, slug: item.slug };
}

function toHomepageBook(
  book: RelatedBookRecord,
  aggregate?: { rating: number | null; count: number },
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
    rating: aggregate?.rating ?? null,
    reviewCount: aggregate?.count ?? book._count.reviews,
  };
}

function toReview(review: {
  id: string;
  rating: number;
  content: string;
  createdAt: Date;
  user: { name: string | null };
  _count: { likes: number };
}): BookDetailReview {
  return {
    id: review.id,
    rating: review.rating,
    content: review.content,
    createdAt: review.createdAt.toISOString(),
    readerName: review.user.name ?? "Pembaca",
    likeCount: review._count.likes,
  };
}

function getReviewOrder(
  query: ReviewQuery,
): Prisma.ReviewOrderByWithRelationInput[] {
  if (query.sort === "rating") {
    return [{ rating: query.direction }, { createdAt: "desc" }, { id: "asc" }];
  }
  if (query.sort === "likes") {
    return [
      { likes: { _count: query.direction } },
      { createdAt: "desc" },
      { id: "asc" },
    ];
  }
  return [{ createdAt: query.direction }, { id: "asc" }];
}

@Injectable()
export class PrismaBookDetailRepository implements BookDetailRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly database: PrismaClient) {}

  async getBookDetail(
    slug: string,
    query: ReviewQuery,
  ): Promise<BookDetailData | null> {
    const book = await this.database.book.findUnique({
      where: { slug },
      select: bookDetailSelect,
    });
    if (!book) {
      return null;
    }

    const skip = (query.page - 1) * query.pageSize;
    const [ratingAggregate, reviewCount, reviewRows, relatedBooks] =
      await Promise.all([
        this.database.review.aggregate({
          where: { bookId: book.id },
          _avg: { rating: true },
          _count: { rating: true },
        }),
        this.database.review.count({ where: { bookId: book.id } }),
        this.database.review.findMany({
          where: { bookId: book.id },
          orderBy: getReviewOrder(query),
          skip,
          take: query.pageSize,
          select: {
            id: true,
            rating: true,
            content: true,
            createdAt: true,
            user: { select: { name: true } },
            _count: { select: { likes: true } },
          },
        }),
        this.getRelatedBooks(book),
      ]);

    const relatedRatingGroups = relatedBooks.length
      ? await this.database.review.groupBy({
          by: ["bookId"],
          where: { bookId: { in: relatedBooks.map((related) => related.id) } },
          _avg: { rating: true },
          _count: { rating: true },
        })
      : [];
    const relatedRatingsById = new Map(
      relatedRatingGroups.map(
        (group) =>
          [
            group.bookId,
            { rating: group._avg.rating, count: group._count.rating },
          ] as const,
      ),
    );

    return {
      book: {
        id: book.id,
        slug: book.slug,
        title: book.title,
        description: book.description,
        isbn: book.isbn,
        publishedYear: book.publishedYear,
        pageCount: book.pageCount,
        language: book.language,
        coverImage: book.coverImage,
        authors: book.authors.map((author) => author.name),
        publisher: book.publisher?.name ?? null,
        categories: book.categories.map(toTaxonomy),
        genres: book.genres.map(toTaxonomy),
        rating: ratingAggregate._avg.rating,
        reviewCount,
      },
      reviews: reviewRows.map(toReview),
      relatedBooks: relatedBooks.map((related) =>
        toHomepageBook(related, relatedRatingsById.get(related.id)),
      ),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total: reviewCount,
        totalPages: Math.ceil(reviewCount / query.pageSize),
      },
    };
  }

  private getRelatedBooks(
    book: BookDetailRecord,
  ): Promise<RelatedBookRecord[]> {
    const taxonomyFilters: Prisma.BookWhereInput[] = [];
    if (book.categories.length) {
      taxonomyFilters.push({
        categories: {
          some: { id: { in: book.categories.map(({ id }) => id) } },
        },
      });
    }
    if (book.genres.length) {
      taxonomyFilters.push({
        genres: { some: { id: { in: book.genres.map(({ id }) => id) } } },
      });
    }
    if (!taxonomyFilters.length) {
      return Promise.resolve([]);
    }
    const where: Prisma.BookWhereInput = {
      id: { not: book.id },
      OR: taxonomyFilters,
    };

    return this.database.book.findMany({
      where,
      orderBy: [{ reviews: { _count: "desc" } }, { title: "asc" }],
      take: 4,
      select: relatedBookSelect,
    });
  }
}
