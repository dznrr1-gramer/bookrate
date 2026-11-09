import { Inject, Injectable } from "@nestjs/common";
import type {
  CatalogData,
  HomepageBook,
  HomepageTaxonomy,
} from "@bookrate/types";
import type { CatalogQuery } from "@bookrate/validators";
import type { Prisma, PrismaClient } from "@bookrate/database";
import { PRISMA_CLIENT } from "../auth/auth.tokens";

export const CATALOG_REPOSITORY = Symbol("CATALOG_REPOSITORY");

export interface CatalogRepository {
  getCatalog(query: CatalogQuery): Promise<CatalogData>;
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

type BookSummary = {
  id: string;
  slug: string;
  title: string;
  coverImage: string | null;
  publishedYear: number | null;
  authors: { name: string }[];
  categories: { name: string }[];
  genres: { name: string }[];
  _count: { reviews: number };
};

function toCatalogBook(
  book: BookSummary,
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

@Injectable()
export class PrismaCatalogRepository implements CatalogRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly database: PrismaClient) {}

  async getCatalog(query: CatalogQuery): Promise<CatalogData> {
    const conditions: Prisma.BookWhereInput[] = [];
    if (query.search) {
      const isbnSearch = query.search.replace(/[\s-]/g, "").toUpperCase();
      const searchConditions: Prisma.BookWhereInput[] = [
        { title: { contains: query.search, mode: "insensitive" } },
        {
          authors: {
            some: {
              name: { contains: query.search, mode: "insensitive" },
            },
          },
        },
      ];
      if (isbnSearch) {
        searchConditions.push({ isbn: { contains: isbnSearch } });
      }
      conditions.push({
        OR: searchConditions,
      });
    }
    if (query.category) {
      conditions.push({ categories: { some: { slug: query.category } } });
    }
    if (query.genre) {
      conditions.push({ genres: { some: { slug: query.genre } } });
    }
    const baseWhere: Prisma.BookWhereInput = { AND: conditions };

    const [categories, genres, matchingRatingGroups, totalWithoutRatingFilter] =
      await Promise.all([
        this.database.category.findMany({
          orderBy: [{ name: "asc" }],
          select: {
            name: true,
            slug: true,
            _count: { select: { books: true } },
          },
        }),
        this.database.genre.findMany({
          orderBy: [{ name: "asc" }],
          select: {
            name: true,
            slug: true,
            _count: { select: { books: true } },
          },
        }),
        query.minRating === undefined
          ? Promise.resolve(null)
          : this.database.review.groupBy({
              by: ["bookId"],
              where: { book: baseWhere },
              having: { rating: { _avg: { gte: query.minRating } } },
              _avg: { rating: true },
              _count: { rating: true },
            }),
        query.minRating === undefined
          ? this.database.book.count({ where: baseWhere })
          : Promise.resolve(null),
      ]);

    const eligibleBookIds = matchingRatingGroups?.map((group) => group.bookId);
    const where: Prisma.BookWhereInput =
      eligibleBookIds === undefined
        ? baseWhere
        : { AND: [baseWhere, { id: { in: eligibleBookIds } }] };
    const total = totalWithoutRatingFilter ?? eligibleBookIds?.length ?? 0;
    const skip = (query.page - 1) * query.pageSize;

    let items: HomepageBook[];
    if (query.sort === "rating") {
      const ratedCount = await this.database.book.count({
        where: { AND: [where, { reviews: { some: {} } }] },
      });
      const ratedGroups =
        skip < ratedCount
          ? await this.database.review.groupBy({
              by: ["bookId"],
              where: { book: where },
              _avg: { rating: true },
              _count: { rating: true },
              orderBy: [
                { _avg: { rating: query.direction } },
                { _count: { rating: "desc" } },
                { bookId: "asc" },
              ],
              skip,
              take: Math.min(query.pageSize, ratedCount - skip),
            })
          : [];
      const ratedBooks = await this.getBooks(
        ratedGroups.map((group) => group.bookId),
      );
      const ratedById = new Map(
        ratedBooks.map((book) => [book.id, book] as const),
      );
      const orderedRatedBooks = ratedGroups.flatMap((group) => {
        const book = ratedById.get(group.bookId);
        return book
          ? [toCatalogBook(book, group._avg.rating, group._count.rating)]
          : [];
      });
      const unratedNeeded = query.pageSize - orderedRatedBooks.length;
      const unratedBooks =
        unratedNeeded > 0 && query.minRating === undefined
          ? await this.database.book.findMany({
              where: { AND: [baseWhere, { reviews: { none: {} } }] },
              orderBy: [{ title: "asc" }, { id: "asc" }],
              skip: Math.max(0, skip - ratedCount),
              take: unratedNeeded,
              select: bookSummarySelect,
            })
          : [];
      items = [
        ...orderedRatedBooks,
        ...unratedBooks.map((book) => toCatalogBook(book)),
      ];
    } else {
      const orderBy: Prisma.BookOrderByWithRelationInput[] =
        query.sort === "popular"
          ? [
              { reviews: { _count: query.direction } },
              { title: "asc" },
              { id: "asc" },
            ]
          : query.sort === "title"
            ? [{ title: query.direction }, { id: query.direction }]
            : [{ createdAt: query.direction }, { title: "asc" }, { id: "asc" }];
      const books = await this.database.book.findMany({
        where,
        orderBy,
        skip,
        take: query.pageSize,
        select: bookSummarySelect,
      });
      const ratingGroups = books.length
        ? await this.database.review.groupBy({
            by: ["bookId"],
            where: { bookId: { in: books.map((book) => book.id) } },
            _avg: { rating: true },
            _count: { rating: true },
          })
        : [];
      const ratingsByBookId = new Map(
        ratingGroups.map(
          (group) =>
            [
              group.bookId,
              { rating: group._avg.rating, count: group._count.rating },
            ] as const,
        ),
      );
      items = books.map((book) => {
        const aggregate = ratingsByBookId.get(book.id);
        return toCatalogBook(
          book,
          aggregate?.rating ?? null,
          aggregate?.count ?? 0,
        );
      });
    }

    return {
      items,
      categories: categories.map(toTaxonomy),
      genres: genres.map(toTaxonomy),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    };
  }

  private getBooks(ids: string[]): Promise<BookSummary[]> {
    if (!ids.length) {
      return Promise.resolve([]);
    }
    return this.database.book.findMany({
      where: { id: { in: ids } },
      select: bookSummarySelect,
    });
  }
}
