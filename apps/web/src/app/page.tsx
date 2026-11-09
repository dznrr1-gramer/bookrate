"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { HomepageBook, HomepageData } from "@bookrate/types";
import {
  Button,
  Feedback,
  Field,
  Rating,
  SiteFooter,
  SiteHeader,
} from "@bookrate/ui";
import { apiClient } from "../lib/api";

const coverPalettes = [
  "from-sky-950 via-blue-800 to-cyan-700",
  "from-amber-900 via-orange-800 to-rose-700",
  "from-emerald-950 via-teal-800 to-lime-800",
  "from-stone-950 via-neutral-800 to-orange-800",
  "from-red-950 via-rose-900 to-orange-800",
  "from-indigo-950 via-violet-900 to-fuchsia-800",
];
const coverAccents = ["✳", "◉", "◌", "⌂", "✦", "⌁"];

function subscribeToSearchQuery(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => window.removeEventListener("popstate", onChange);
}

function getSearchQuerySnapshot() {
  return new URL(window.location.href).searchParams.get("q") ?? "";
}

function getServerSearchQuerySnapshot() {
  return "";
}

function getCoverIndex(book: HomepageBook) {
  return (
    [...book.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) %
    coverPalettes.length
  );
}

function BookCover({
  book,
  large = false,
}: {
  book: HomepageBook;
  large?: boolean;
}) {
  const coverIndex = getCoverIndex(book);

  return (
    <div
      aria-label={`Sampul buku ${book.title}`}
      className={`relative isolate flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br ${coverPalettes[coverIndex]} p-4 text-white shadow-lg ${large ? "max-w-[220px] p-6 sm:max-w-[250px]" : ""}`}
      role="img"
    >
      <span
        aria-hidden="true"
        className="absolute -right-7 -top-8 -z-10 text-[140px] leading-none text-white/15"
      >
        {coverAccents[coverIndex]}
      </span>
      <span className="text-[9px] font-semibold tracking-[0.24em] text-white/85">
        BOOKRATE EDITION
      </span>
      <span
        className={`whitespace-pre-line font-serif font-bold leading-[0.95] tracking-wide drop-shadow-sm ${large ? "text-3xl sm:text-4xl" : "text-lg"}`}
      >
        {book.title.toLocaleUpperCase("id")}
      </span>
      <span className="line-clamp-1 text-[9px] font-medium tracking-[0.18em] text-white/90">
        {book.authors.join(", ").toLocaleUpperCase("id")}
      </span>
    </div>
  );
}

function BookCard({ book }: { book: HomepageBook }) {
  return (
    <article className="group min-w-0">
      <a
        aria-label={`Lihat detail buku ${book.title}`}
        className="ui-focus-ring relative block rounded-xl"
        href={`/books/${encodeURIComponent(book.slug)}`}
      >
        <BookCover book={book} />
      </a>
      <div className="mt-3 flex items-start justify-between gap-2">
        <a
          className="ui-focus-ring min-w-0 truncate rounded-sm text-sm font-semibold text-ink hover:text-forest"
          href={`/books/${encodeURIComponent(book.slug)}`}
        >
          {book.title}
        </a>
        {book.rating !== null ? <Rating value={book.rating} /> : null}
      </div>
      <p className="mt-1 truncate text-xs text-muted">
        {book.authors.join(", ") || "Penulis tidak diketahui"}
      </p>
      <p className="mt-1 text-[11px] text-muted">
        {book.reviewCount} ulasan
        {book.genres.length ? ` · ${book.genres.slice(0, 2).join(", ")}` : ""}
      </p>
    </article>
  );
}

function BookShelf({
  title,
  description,
  books,
}: {
  title: string;
  description: string;
  books: HomepageBook[];
}) {
  const headingId = `${title.toLocaleLowerCase("id").replace(/[^a-z0-9]+/g, "-")}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14"
    >
      <div className="mb-6">
        <h2
          className="font-serif text-3xl tracking-tight sm:text-4xl"
          id={headingId}
        >
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted">{description}</p>
      </div>
      {books.length ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
          {books.map((book) => (
            <BookCard book={book} key={book.id} />
          ))}
        </div>
      ) : (
        <Feedback
          description="Buku akan muncul di sini setelah tersedia di katalog."
          status="empty"
          title="Belum ada buku"
        />
      )}
    </section>
  );
}

export default function Home() {
  const [homepage, setHomepage] = useState<HomepageData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const searchQuery = useSyncExternalStore(
    subscribeToSearchQuery,
    getSearchQuerySnapshot,
    getServerSearchQuerySnapshot,
  );
  const [queryOverride, setQueryOverride] = useState<string | null>(null);
  const query = queryOverride ?? searchQuery;
  const [genre, setGenre] = useState("Semua");

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .homepage(controller.signal)
      .then(setHomepage)
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setLoadError(
          error instanceof Error
            ? error.message
            : "Konten homepage tidak dapat dimuat.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [retryCount]);

  const searchableBooks = useMemo(() => {
    if (!homepage) {
      return [];
    }

    const booksById = new Map<string, HomepageBook>();
    [
      ...homepage.popularBooks,
      ...homepage.highestRatedBooks,
      ...homepage.recentlyAddedBooks,
      ...homepage.recommendedBooks,
    ].forEach((book) => booksById.set(book.id, book));
    return [...booksById.values()];
  }, [homepage]);

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");
    return searchableBooks.filter((book) => {
      const matchesGenre =
        genre === "Semua" ||
        book.genres.includes(genre) ||
        book.categories.includes(genre);
      const matchesQuery =
        !normalizedQuery ||
        `${book.title} ${book.authors.join(" ")} ${book.genres.join(" ")} ${book.categories.join(" ")}`
          .toLocaleLowerCase("id")
          .includes(normalizedQuery);
      return matchesGenre && matchesQuery;
    });
  }, [genre, query, searchableBooks]);

  const featuredBooks = homepage?.popularBooks.slice(0, 3) ?? [];
  const retryHomepage = () => {
    setIsLoading(true);
    setLoadError(null);
    setRetryCount((count) => count + 1);
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <a
        className="ui-focus-ring sr-only fixed left-4 top-4 z-50 rounded-lg bg-surface px-4 py-3 text-sm font-semibold text-forest focus:not-sr-only"
        href="#konten-utama"
      >
        Lewati ke konten utama
      </a>
      <SiteHeader />

      <main id="konten-utama">
        <section
          aria-labelledby="hero-heading"
          className="mx-auto grid min-w-0 max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pb-24 md:pt-20"
          id="tentang"
        >
          <div className="max-w-xl">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-sage bg-surface-muted px-3 py-1.5 text-xs font-semibold tracking-wide text-forest">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-forest"
              />
              RUANG BACA MILIK BERSAMA
            </p>
            <h1
              className="font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl md:text-[68px]"
              id="hero-heading"
            >
              Setiap buku punya{" "}
              <span className="text-forest italic">cerita.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
              Temukan bacaan berikutnya dari rekomendasi pembaca, bagikan
              ulasanmu, dan simpan semua perjalanan membaca di satu tempat.
            </p>
            <form
              action="/#katalog"
              className="mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
              method="get"
            >
              <Field
                aria-label="Cari buku"
                autoComplete="off"
                id="homepage-search"
                label="Cari judul, penulis, atau ISBN"
                name="q"
                onChange={(event) => setQueryOverride(event.target.value)}
                placeholder="Cari judul, penulis, atau genre..."
                type="search"
                value={query}
              />
              <Button className="shrink-0" type="submit">
                Temukan buku <span aria-hidden="true">→</span>
              </Button>
            </form>
            <p className="mt-3 text-sm text-muted">Baca. Nilai. Ceritakan.</p>
          </div>

          <div
            aria-label="Buku pilihan pembaca"
            className="relative mx-auto flex w-full min-w-0 max-w-lg items-center justify-center py-4"
            id="pilihan"
          >
            <div
              aria-hidden="true"
              className="absolute inset-5 rounded-[45%] bg-sage/40 blur-2xl"
            />
            {isLoading ? (
              <div className="relative w-full">
                <Feedback status="loading" title="Memuat pilihan buku..." />
              </div>
            ) : featuredBooks.length ? (
              <>
                <div className="relative flex w-full min-w-0 items-center justify-center gap-2 sm:gap-6">
                  {featuredBooks.map((book, index) => (
                    <a
                      aria-label={`Lihat detail buku ${book.title}`}
                      className={`ui-focus-ring relative block w-[27%] rounded-xl ${index === 0 ? "mt-12 rotate-[-8deg]" : index === 1 ? "z-10 w-[36%] rotate-[2deg]" : "mt-10 rotate-[9deg]"}`}
                      href={`/books/${encodeURIComponent(book.slug)}`}
                      key={book.id}
                    >
                      <BookCover book={book} large={index === 1} />
                    </a>
                  ))}
                </div>
                {homepage?.featuredBook ? (
                  <div className="absolute bottom-1 left-0 max-w-[70%] rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lg sm:bottom-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                      Pilihan pembaca
                    </p>
                    <a
                      className="ui-focus-ring mt-1 block truncate rounded-sm text-sm font-semibold text-ink hover:text-forest"
                      href={`/books/${encodeURIComponent(homepage.featuredBook.slug)}`}
                    >
                      {homepage.featuredBook.title}
                    </a>
                    <p className="mt-0.5 text-xs text-muted">
                      {homepage.featuredBook.reviewCount} ulasan
                    </p>
                  </div>
                ) : null}
                <p className="absolute right-0 top-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 text-xs font-semibold text-forest shadow-lg sm:right-2">
                  {homepage?.stats.books ?? 0} buku untuk dijelajahi
                </p>
              </>
            ) : (
              <div className="relative w-full">
                <Feedback
                  description="Coba lagi nanti untuk melihat pilihan pembaca."
                  status="empty"
                  title="Belum ada pilihan buku"
                />
              </div>
            )}
          </div>
        </section>

        {loadError ? (
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Feedback
              description={loadError}
              status="error"
              title="Homepage tidak dapat dimuat"
            />
            <div className="mt-4 text-center">
              <Button onClick={retryHomepage}>Coba lagi</Button>
            </div>
          </div>
        ) : null}

        <section
          aria-labelledby="catalog-heading"
          className="border-y border-border bg-surface"
          id="katalog"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
                DARI KOMUNITAS
              </p>
              <h2
                className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl"
                id="catalog-heading"
              >
                Cari bacaan yang pas.
              </h2>
              <p className="mt-2 text-sm text-muted">
                Buku yang sedang dibicarakan para pembaca.
              </p>
            </div>

            <div
              aria-label="Filter berdasarkan kategori dan genre"
              className="mt-8 flex gap-2 overflow-x-auto pb-2"
              role="group"
            >
              <Button
                aria-pressed={genre === "Semua"}
                className="min-h-10 shrink-0 px-4 py-2 text-xs"
                onClick={() => setGenre("Semua")}
                variant={genre === "Semua" ? "primary" : "secondary"}
              >
                Semua
              </Button>
              {homepage?.genres.map((item) => (
                <Button
                  aria-pressed={genre === item.name}
                  className="min-h-10 shrink-0 px-4 py-2 text-xs"
                  key={item.slug}
                  onClick={() => setGenre(item.name)}
                  variant={genre === item.name ? "primary" : "secondary"}
                >
                  {item.name}
                </Button>
              ))}
            </div>

            {isLoading ? (
              <div className="mt-6">
                <Feedback status="loading" title="Memuat katalog..." />
              </div>
            ) : loadError ? null : filteredBooks.length ? (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
                {filteredBooks.slice(0, 6).map((book) => (
                  <BookCard book={book} key={book.id} />
                ))}
              </div>
            ) : (
              <div className="mt-6">
                <Feedback
                  description="Coba kata kunci atau kategori lain."
                  status="empty"
                  title="Buku tidak ditemukan"
                />
              </div>
            )}
            <div className="mt-10 text-center">
              <a
                className="ui-focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-sage hover:text-forest"
                href={`/books?q=${encodeURIComponent(query)}`}
              >
                Jelajahi semua buku <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <Feedback status="loading" title="Memuat rekomendasi..." />
          </div>
        ) : loadError ? null : homepage ? (
          <>
            <BookShelf
              books={homepage.popularBooks}
              description="Pilihan yang paling banyak mendapat ulasan dari komunitas."
              title="Populer di BookRate"
            />
            <div className="border-y border-border bg-surface">
              <BookShelf
                books={homepage.highestRatedBooks}
                description="Buku dengan rating tertinggi dari pembaca."
                title="Rating tertinggi"
              />
            </div>
            <BookShelf
              books={homepage.recentlyAddedBooks}
              description="Jelajahi buku yang baru masuk ke katalog."
              title="Baru ditambahkan"
            />
            <section
              aria-labelledby="categories-heading"
              className="border-y border-border bg-surface"
            >
              <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
                <h2
                  className="font-serif text-3xl tracking-tight sm:text-4xl"
                  id="categories-heading"
                >
                  Jelajahi kategori
                </h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {homepage.categories.map((category) => (
                    <a
                      className="ui-focus-ring rounded-2xl border border-border bg-page p-5 transition-colors hover:border-sage"
                      href={`/books?category=${encodeURIComponent(category.slug)}`}
                      key={category.slug}
                    >
                      <span className="block font-semibold text-ink">
                        {category.name}
                      </span>
                      <span className="mt-1 block text-sm text-muted">
                        {category.bookCount} buku
                      </span>
                    </a>
                  ))}
                </div>
                {!homepage.categories.length ? (
                  <div className="mt-6">
                    <Feedback
                      description="Kategori akan tampil setelah katalog memiliki data."
                      status="empty"
                      title="Belum ada kategori"
                    />
                  </div>
                ) : null}
              </div>
            </section>
            <BookShelf
              books={homepage.recommendedBooks}
              description="Untuk pengunjung, kami mulai dari buku yang sedang diminati komunitas. Rekomendasi personal akan tersedia setelah Anda memiliki aktivitas membaca."
              title="Pilihan untukmu"
            />
            <section
              aria-labelledby="stats-heading"
              className="bg-forest text-white"
            >
              <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14">
                <h2
                  className="font-serif text-3xl tracking-tight sm:text-4xl"
                  id="stats-heading"
                >
                  Komunitas yang terus bertumbuh
                </h2>
                <dl className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {[
                    ["Buku", homepage.stats.books],
                    ["Pembaca", homepage.stats.readers],
                    ["Ulasan", homepage.stats.reviews],
                  ].map(([label, value]) => (
                    <div className="border-l border-white/30 pl-4" key={label}>
                      <dt className="text-sm text-white/80">{label}</dt>
                      <dd className="mt-1 text-3xl font-semibold">
                        {Number(value).toLocaleString("id-ID")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>
            <section
              aria-labelledby="reviews-heading"
              className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14"
            >
              <div className="mb-6">
                <h2
                  className="font-serif text-3xl tracking-tight sm:text-4xl"
                  id="reviews-heading"
                >
                  Cerita terbaru dari pembaca
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Ulasan terbaru dari komunitas BookRate.
                </p>
              </div>
              {homepage.recentReviews.length ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {homepage.recentReviews.map((review) => (
                    <article
                      className="rounded-2xl border border-border bg-surface p-5"
                      key={review.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-ink">
                            {review.readerName}
                          </p>
                          <p className="mt-1 text-sm text-muted">
                            untuk{" "}
                            <a
                              className="ui-focus-ring rounded-sm font-medium text-forest hover:underline"
                              href={`/books/${encodeURIComponent(review.book.slug)}`}
                            >
                              {review.book.title}
                            </a>
                          </p>
                        </div>
                        <Rating value={review.rating} />
                      </div>
                      <p className="mt-4 text-sm leading-6 text-muted">
                        {review.excerpt}
                      </p>
                      <time
                        className="mt-4 block text-xs text-muted"
                        dateTime={review.createdAt}
                      >
                        {new Date(review.createdAt).toLocaleDateString("id-ID")}
                      </time>
                    </article>
                  ))}
                </div>
              ) : (
                <Feedback
                  description="Jadilah pembaca pertama yang membagikan cerita."
                  status="empty"
                  title="Belum ada ulasan terbaru"
                />
              )}
            </section>
          </>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
