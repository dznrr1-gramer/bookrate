"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CatalogData, HomepageBook } from "@bookrate/types";
import { Button, Feedback, Rating, SiteFooter, SiteHeader } from "@bookrate/ui";
import { apiClient } from "../../lib/api";

interface CatalogFilters {
  search: string;
  category: string;
  genre: string;
  minRating: string;
  sort: string;
  direction: string;
}

const coverPalettes = [
  "from-sky-950 via-blue-800 to-cyan-700",
  "from-amber-900 via-orange-800 to-rose-700",
  "from-emerald-950 via-teal-800 to-lime-800",
  "from-stone-950 via-neutral-800 to-orange-800",
  "from-red-950 via-rose-900 to-orange-800",
  "from-indigo-950 via-violet-900 to-fuchsia-800",
];

function readFilters(query: string): CatalogFilters {
  const params = new URLSearchParams(query);
  return {
    search: params.get("search") ?? params.get("q") ?? "",
    category: params.get("category") ?? "",
    genre: params.get("genre") ?? "",
    minRating: params.get("minRating") ?? "",
    sort: params.get("sort") ?? "newest",
    direction: params.get("direction") ?? "desc",
  };
}

function toApiQuery(query: string) {
  const source = new URLSearchParams(query);
  const params = new URLSearchParams();
  const search = source.get("search") ?? source.get("q");
  if (search?.trim()) {
    params.set("search", search);
  }
  for (const key of [
    "category",
    "genre",
    "minRating",
    "sort",
    "direction",
    "page",
    "pageSize",
  ]) {
    const value = source.get(key);
    if (value !== null && value !== "") {
      params.set(key, value);
    }
  }
  return params;
}

function pageHref(query: string, page: number) {
  const params = toApiQuery(query);
  params.set("page", String(page));
  return `/books?${params.toString()}`;
}

function CatalogBookCard({ book }: { book: HomepageBook }) {
  const coverIndex =
    [...book.id].reduce((sum, character) => sum + character.charCodeAt(0), 0) %
    coverPalettes.length;

  return (
    <article className="min-w-0">
      <Link
        aria-label={`Lihat detail buku ${book.title}`}
        className="ui-focus-ring relative block rounded-xl"
        href={`/books/${encodeURIComponent(book.slug)}`}
      >
        <div
          aria-label={`Sampul buku ${book.title}`}
          className={`flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br ${coverPalettes[coverIndex]} p-4 text-white shadow-lg`}
          role="img"
        >
          <span className="text-[9px] font-semibold tracking-[0.24em] text-white/85">
            BOOKRATE EDITION
          </span>
          <span className="line-clamp-4 font-serif text-lg font-bold leading-tight">
            {book.title}
          </span>
          <span className="line-clamp-1 text-[9px] font-medium tracking-wide">
            {book.authors.join(", ") || "Penulis tidak diketahui"}
          </span>
        </div>
      </Link>
      <div className="mt-3 flex items-start justify-between gap-2">
        <Link
          className="ui-focus-ring min-w-0 truncate rounded-sm text-sm font-semibold text-ink hover:text-forest"
          href={`/books/${encodeURIComponent(book.slug)}`}
        >
          {book.title}
        </Link>
        {book.rating !== null ? (
          <Rating value={book.rating} reviewCount={book.reviewCount} />
        ) : null}
      </div>
      <p className="mt-1 truncate text-xs text-muted">
        {book.authors.join(", ") || "Penulis tidak diketahui"}
      </p>
      <p className="mt-1 text-[11px] text-muted">
        {book.reviewCount} ulasan
        {book.categories.length ? ` · ${book.categories.join(", ")}` : ""}
      </p>
    </article>
  );
}

export default function CatalogClient({
  initialQuery,
}: {
  initialQuery: string;
}) {
  const [filters, setFilters] = useState(() => readFilters(initialQuery));
  const [catalog, setCatalog] = useState<CatalogData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    apiClient
      .catalog(toApiQuery(initialQuery), controller.signal)
      .then(setCatalog)
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setLoadError(
          error instanceof Error
            ? error.message
            : "Katalog tidak dapat dimuat.",
        );
      });

    return () => controller.abort();
  }, [initialQuery, retryCount]);

  const query = toApiQuery(initialQuery);
  const currentPage = Number(query.get("page") ?? "1");
  const totalPages = catalog?.pagination.totalPages ?? 0;
  const isOutOfRange =
    Boolean(catalog?.pagination.total) && currentPage > totalPages;

  return (
    <div className="min-h-screen bg-page text-ink">
      <a
        className="ui-focus-ring sr-only fixed left-4 top-4 z-50 rounded-lg bg-surface px-4 py-3 text-sm font-semibold text-forest focus:not-sr-only"
        href="#konten-utama"
      >
        Lewati ke konten utama
      </a>
      <SiteHeader />
      <main
        className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 sm:py-14"
        id="konten-utama"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
          KATALOG BOOKRATE
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight sm:text-5xl">
          Jelajahi buku
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
          Cari judul, penulis, atau ISBN, lalu persempit pilihan dengan
          kategori, genre, dan rating pembaca.
        </p>

        <form
          action="/books"
          className="mt-8 grid gap-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2 lg:grid-cols-4"
          method="get"
        >
          <label className="flex flex-col gap-2 text-sm font-medium text-ink sm:col-span-2">
            Cari buku
            <input
              autoComplete="off"
              className="ui-focus-ring min-h-11 rounded-xl border border-border bg-page px-3 text-sm font-normal"
              name="search"
              placeholder="Judul, penulis, atau ISBN"
              type="search"
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  search: event.target.value,
                }))
              }
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Kategori
            <select
              className="ui-focus-ring min-h-11 rounded-xl border border-border bg-page px-3 text-sm font-normal"
              name="category"
              value={filters.category}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  category: event.target.value,
                }))
              }
            >
              <option value="">Semua kategori</option>
              {filters.category &&
              !catalog?.categories.some(
                (category) => category.slug === filters.category,
              ) ? (
                <option value={filters.category}>{filters.category}</option>
              ) : null}
              {catalog?.categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Genre
            <select
              className="ui-focus-ring min-h-11 rounded-xl border border-border bg-page px-3 text-sm font-normal"
              name="genre"
              value={filters.genre}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  genre: event.target.value,
                }))
              }
            >
              <option value="">Semua genre</option>
              {filters.genre &&
              !catalog?.genres.some((genre) => genre.slug === filters.genre) ? (
                <option value={filters.genre}>{filters.genre}</option>
              ) : null}
              {catalog?.genres.map((genre) => (
                <option key={genre.slug} value={genre.slug}>
                  {genre.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Rating minimum
            <select
              className="ui-focus-ring min-h-11 rounded-xl border border-border bg-page px-3 text-sm font-normal"
              name="minRating"
              value={filters.minRating}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  minRating: event.target.value,
                }))
              }
            >
              <option value="">Semua rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}+ dari 5
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Urutkan
            <select
              className="ui-focus-ring min-h-11 rounded-xl border border-border bg-page px-3 text-sm font-normal"
              name="sort"
              value={filters.sort}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  sort: event.target.value,
                }))
              }
            >
              <option value="newest">Terbaru</option>
              <option value="popular">Paling populer</option>
              <option value="rating">Rating tertinggi</option>
              <option value="title">Judul</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-ink">
            Arah urutan
            <select
              className="ui-focus-ring min-h-11 rounded-xl border border-border bg-page px-3 text-sm font-normal"
              name="direction"
              value={filters.direction}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  direction: event.target.value,
                }))
              }
            >
              <option value="desc">Menurun</option>
              <option value="asc">Menaik</option>
            </select>
          </label>
          <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-4">
            <Button type="submit">Terapkan filter</Button>
            <Link
              className="ui-focus-ring rounded-full px-4 py-3 text-sm font-semibold text-forest hover:bg-surface-muted"
              href="/books"
            >
              Hapus filter
            </Link>
          </div>
        </form>

        {loadError ? (
          <div className="mt-8">
            <Feedback
              description={loadError}
              status="error"
              title="Katalog tidak dapat dimuat"
            />
            <div className="mt-4 text-center">
              <Button
                onClick={() => {
                  setLoadError(null);
                  setRetryCount((count) => count + 1);
                }}
              >
                Coba lagi
              </Button>
            </div>
          </div>
        ) : catalog ? (
          <>
            <div className="mt-8 flex flex-wrap items-baseline justify-between gap-3">
              <p aria-live="polite" className="text-sm text-muted">
                {catalog.pagination.total.toLocaleString("id-ID")} buku
                ditemukan
              </p>
              {catalog.pagination.total > 0 ? (
                <p className="text-sm text-muted">
                  Halaman {catalog.pagination.page} dari {totalPages}
                </p>
              ) : null}
            </div>
            {catalog.items.length ? (
              <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-5">
                {catalog.items.map((book) => (
                  <CatalogBookCard book={book} key={book.id} />
                ))}
              </div>
            ) : isOutOfRange ? (
              <div className="mt-6">
                <Feedback
                  description="Halaman ini berada di luar hasil yang tersedia."
                  status="empty"
                  title="Halaman tidak tersedia"
                />
                <div className="mt-4 text-center">
                  <Link
                    className="ui-focus-ring rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-forest-dark"
                    href={pageHref(initialQuery, totalPages)}
                  >
                    Ke halaman terakhir
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <Feedback
                  description="Coba ubah kata kunci atau hapus sebagian filter."
                  status="empty"
                  title="Buku tidak ditemukan"
                />
              </div>
            )}
            {totalPages > 1 && !isOutOfRange ? (
              <nav
                aria-label="Navigasi halaman katalog"
                className="mt-10 flex items-center justify-center gap-4"
              >
                {currentPage > 1 ? (
                  <Link
                    className="ui-focus-ring rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hover:border-sage"
                    href={pageHref(initialQuery, currentPage - 1)}
                  >
                    Sebelumnya
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted opacity-60"
                  >
                    Sebelumnya
                  </span>
                )}
                <span aria-current="page" className="text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                {currentPage < totalPages ? (
                  <Link
                    className="ui-focus-ring rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink hover:border-sage"
                    href={pageHref(initialQuery, currentPage + 1)}
                  >
                    Berikutnya
                  </Link>
                ) : (
                  <span
                    aria-disabled="true"
                    className="rounded-full border border-border px-4 py-2 text-sm text-muted opacity-60"
                  >
                    Berikutnya
                  </span>
                )}
              </nav>
            ) : null}
          </>
        ) : (
          <div className="mt-8">
            <Feedback status="loading" title="Memuat katalog..." />
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
