export type ViewerRole = "GUEST" | "USER" | "ADMIN";

export type ReadingStatus = "WANT_TO_READ" | "CURRENTLY_READING" | "READ";

export type BookRating = 1 | 2 | 3 | 4 | 5;

export interface HomepageBook {
  id: string;
  slug: string;
  title: string;
  authors: string[];
  categories: string[];
  genres: string[];
  coverImage: string | null;
  publishedYear: number | null;
  rating: number | null;
  reviewCount: number;
}

export interface HomepageTaxonomy {
  name: string;
  slug: string;
  bookCount: number;
}

export interface HomepageReview {
  id: string;
  rating: number;
  excerpt: string;
  createdAt: string;
  readerName: string;
  book: Pick<HomepageBook, "slug" | "title">;
}

export interface HomepageData {
  featuredBook: HomepageBook | null;
  popularBooks: HomepageBook[];
  highestRatedBooks: HomepageBook[];
  recentlyAddedBooks: HomepageBook[];
  recommendedBooks: HomepageBook[];
  categories: HomepageTaxonomy[];
  genres: HomepageTaxonomy[];
  recentReviews: HomepageReview[];
  stats: {
    books: number;
    readers: number;
    reviews: number;
  };
}

export interface CatalogData {
  items: HomepageBook[];
  categories: HomepageTaxonomy[];
  genres: HomepageTaxonomy[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export interface BookDetailTaxonomy {
  name: string;
  slug: string;
}

export interface BookDetailReview {
  id: string;
  rating: number;
  content: string;
  createdAt: string;
  readerName: string;
  likeCount: number;
}

export interface BookDetailData {
  book: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    isbn: string | null;
    publishedYear: number | null;
    pageCount: number | null;
    language: string | null;
    coverImage: string | null;
    authors: string[];
    publisher: string | null;
    categories: BookDetailTaxonomy[];
    genres: BookDetailTaxonomy[];
    rating: number | null;
    reviewCount: number;
  };
  reviews: BookDetailReview[];
  relatedBooks: HomepageBook[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
