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
