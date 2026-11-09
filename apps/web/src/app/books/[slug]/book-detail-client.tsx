"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { BookDetailData } from "@bookrate/types";
import { ApiClientError, apiClient } from "../../../lib/api";
import { Button, Feedback, Rating, SiteFooter, SiteHeader } from "@bookrate/ui";

interface ReviewFilters {
  sort: string;
  direction: string;
}

function readFilters(query: string): ReviewFilters {
  const params = new URLSearchParams(query);
  return {
    sort: params.get("sort") ?? "newest",
    direction: params.get("direction") ?? "desc",
  };
}

function toReviewQuery(query: string) {
  const source = new URLSearchParams(query);
  const params = new URLSearchParams();
  for (const key of ["sort", "direction", "page", "pageSize"]) {
    const value = source.get(key);
    if (value !== null && value !== "") {
      params.set(key, value);
    }
  }
  return params;
}

function reviewPageHref(query: string, page: number) {
  const params = toReviewQuery(query);
  params.set("page", String(page));
  return `?${params.toString()}#reviews`;
}

function BookCover({
  title,
  authors,
  coverImage,
  large = false,
}: {
  title: string;
  authors: string[];
  coverImage: string | null;
  large?: boolean;
}) {
  if (coverImage) {
    return (
      <Image
        alt={`Sampul buku ${title}`}
        className={`aspect-[3/4] w-full rounded-2xl object-cover shadow-lg ${large ? "max-w-[320px]" : ""}`}
        height={480}
        src={coverImage}
        unoptimized
        width={360}
      />
    );
  }

  return (
    <div
      aria-label={`Sampul buku ${title}`}
      className={`flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-forest via-emerald-900 to-teal-700 p-5 text-white shadow-lg ${large ? "max-w-[320px] p-7" : ""}`}
      role="img"
    >
      <span className="text-[9px] font-semibold tracking-[0.24em] text-white/85">
        BOOKRATE EDITION
      </span>
      <span
        className={`line-clamp-5 font-serif font-bold leading-tight ${large ? "text-3xl sm:text-4xl" : "text-lg"}`}
      >
        {title}
      </span>
      <span className="line-clamp-2 text-xs font-medium tracking-wide">
        {authors.join(", ") || "Penulis tidak tersedia"}
      </span>
    </div>
  );
}

function languageName(language: string | null) {
  if (!language) {
    return "Tidak tersedia";
  }
  if (language.toLocaleLowerCase("id") === "id") {
    return "Bahasa Indonesia";
  }
  return language;
}

function BookDetailView({
  data,
  initialQuery,
}: {
  data: BookDetailData;
  initialQuery: string;
}) {
  const { book, reviews, relatedBooks, pagination } = data;
  const query = toReviewQuery(initialQuery);
  const currentPage = Number(query.get("page") ?? "1");
  const totalPages = pagination.totalPages;
  const reviewPageOutOfRange =
    Boolean(pagination.total) && currentPage > totalPages;

  return (
    <>
      <section
        aria-labelledby="book-title"
        className="grid gap-8 md:grid-cols-[minmax(220px,320px)_1fr] md:gap-12"
      >
        <div className="mx-auto w-full max-w-[320px]">
          <BookCover
            authors={book.authors}
            coverImage={book.coverImage}
            large
            title={book.title}
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest">
            DETAIL BUKU
          </p>
          <h1
            className="mt-3 break-words font-serif text-4xl tracking-tight sm:text-5xl"
            id="book-title"
          >
            {book.title}
          </h1>
          <p className="mt-3 text-lg text-muted">
            {book.authors.length
              ? book.authors.join(", ")
              : "Penulis tidak tersedia"}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            {book.rating !== null ? (
              <Rating value={book.rating} reviewCount={book.reviewCount} />
            ) : (
              <span className="text-sm text-muted">Belum ada rating</span>
            )}
            <a
              className="ui-focus-ring rounded-sm text-sm font-medium text-forest hover:underline"
              href="#reviews"
            >
              {book.reviewCount} ulasan
            </a>
          </div>

          <dl className="mt-8 grid gap-x-6 gap-y-4 rounded-2xl border border-border bg-surface p-5 sm:grid-cols-2">
            {[
              ["Penerbit", book.publisher ?? "Tidak tersedia"],
              ["Tahun terbit", book.publishedYear ?? "Tidak tersedia"],
              ["ISBN", book.isbn ?? "Tidak tersedia"],
              [
                "Jumlah halaman",
                book.pageCount !== null
                  ? `${book.pageCount} halaman`
                  : "Tidak tersedia",
              ],
              ["Bahasa", languageName(book.language)],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-xs font-medium uppercase tracking-wide text-muted">
                  {label}
                </dt>
                <dd className="mt-1 break-words text-sm font-medium text-ink">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="description-heading" className="mt-8">
            <h2
              className="font-serif text-2xl tracking-tight"
              id="description-heading"
            >
              Tentang buku
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-muted">
              {book.description ?? "Deskripsi belum tersedia."}
            </p>
          </section>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <TaxonomyLinks
              heading="Kategori"
              items={book.categories}
              emptyText="Kategori belum tersedia."
              parameter="category"
            />
            <TaxonomyLinks
              heading="Genre"
              items={book.genres}
              emptyText="Genre belum tersedia."
              parameter="genre"
            />
          </div>
        </div>
      </section>

      <section
        aria-labelledby="reviews-heading"
        className="mt-16 border-t border-border pt-10"
        id="reviews"
      >
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2
              className="font-serif text-3xl tracking-tight"
              id="reviews-heading"
            >
              Ulasan pembaca
            </h2>
            <p className="mt-2 text-sm text-muted">
              {pagination.total.toLocaleString("id-ID")} ulasan untuk buku ini.
            </p>
          </div>
          <form
            action={`/books/${encodeURIComponent(book.slug)}`}
            className="flex flex-wrap items-end gap-3"
            method="get"
          >
            <label className="flex flex-col gap-1 text-xs font-medium text-ink">
              Urutkan ulasan
              <select
                className="ui-focus-ring min-h-10 rounded-xl border border-border bg-surface px-3 text-sm"
                defaultValue={readFilters(initialQuery).sort}
                name="sort"
              >
                <option value="newest">Terbaru</option>
                <option value="rating">Rating</option>
                <option value="likes">Paling disukai</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-ink">
              Arah
              <select
                className="ui-focus-ring min-h-10 rounded-xl border border-border bg-surface px-3 text-sm"
                defaultValue={readFilters(initialQuery).direction}
                name="direction"
              >
                <option value="desc">Menurun</option>
                <option value="asc">Menaik</option>
              </select>
            </label>
            <Button className="min-h-10 px-4 py-2 text-xs" type="submit">
              Urutkan
            </Button>
          </form>
        </div>

        {reviews.length ? (
          <div className="mt-6 grid gap-4">
            {reviews.map((review) => (
              <article
                aria-label={`Ulasan oleh ${review.readerName}`}
                className="rounded-2xl border border-border bg-surface p-5"
                key={review.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink">
                      {review.readerName}
                    </p>
                    <time
                      className="mt-1 block text-xs text-muted"
                      dateTime={review.createdAt}
                    >
                      {new Date(review.createdAt).toLocaleDateString("id-ID")}
                    </time>
                  </div>
                  <Rating value={review.rating} />
                </div>
                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted">
                  {review.content}
                </p>
                <p className="mt-4 text-xs text-muted">
                  {review.likeCount} suka
                </p>
              </article>
            ))}
          </div>
        ) : reviewPageOutOfRange ? (
          <div className="mt-6">
            <Feedback
              description="Pilih halaman terakhir yang masih memiliki ulasan."
              status="empty"
              title="Halaman ulasan tidak tersedia"
            />
            <div className="mt-4 text-center">
              <Link
                className="ui-focus-ring rounded-full bg-forest px-5 py-3 text-sm font-semibold text-white hover:bg-forest-dark"
                href={reviewPageHref(initialQuery, totalPages)}
              >
                Ke halaman terakhir
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <Feedback
              description="Ulasan pembaca akan muncul di sini."
              status="empty"
              title="Belum ada ulasan"
            />
          </div>
        )}

        {totalPages > 1 && !reviewPageOutOfRange ? (
          <nav
            aria-label="Navigasi halaman ulasan"
            className="mt-8 flex items-center justify-center gap-4"
          >
            {currentPage > 1 ? (
              <Link
                className="ui-focus-ring rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink"
                href={reviewPageHref(initialQuery, currentPage - 1)}
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
                className="ui-focus-ring rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink"
                href={reviewPageHref(initialQuery, currentPage + 1)}
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
      </section>

      <section
        aria-labelledby="related-heading"
        className="mt-16 border-t border-border pt-10"
      >
        <h2 className="font-serif text-3xl tracking-tight" id="related-heading">
          Buku terkait
        </h2>
        {relatedBooks.length ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {relatedBooks.map((related) => (
              <article className="min-w-0" key={related.id}>
                <Link
                  aria-label={`Lihat detail buku ${related.title}`}
                  className="ui-focus-ring block rounded-xl"
                  href={`/books/${encodeURIComponent(related.slug)}`}
                >
                  <BookCover
                    authors={related.authors}
                    coverImage={related.coverImage}
                    title={related.title}
                  />
                </Link>
                <Link
                  className="ui-focus-ring mt-3 block truncate rounded-sm text-sm font-semibold text-ink hover:text-forest"
                  href={`/books/${encodeURIComponent(related.slug)}`}
                >
                  {related.title}
                </Link>
                <p className="mt-1 truncate text-xs text-muted">
                  {related.authors.join(", ") || "Penulis tidak tersedia"}
                </p>
                {related.rating !== null ? (
                  <div className="mt-1">
                    <Rating value={related.rating} />
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6">
            <Feedback
              description="Buku terkait akan muncul setelah katalog bertambah."
              status="empty"
              title="Belum ada rekomendasi"
            />
          </div>
        )}
      </section>
    </>
  );
}

function TaxonomyLinks({
  heading,
  items,
  emptyText,
  parameter,
}: {
  heading: string;
  items: BookDetailData["book"]["categories"];
  emptyText: string;
  parameter: "category" | "genre";
}) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">
        {heading}
      </h2>
      {items.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {items.map((item) => (
            <Link
              className="ui-focus-ring rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-forest hover:border-sage"
              href={`/books?${parameter}=${encodeURIComponent(item.slug)}`}
              key={item.slug}
            >
              {item.name}
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted">{emptyText}</p>
      )}
    </div>
  );
}

export default function BookDetailClient({
  slug,
  initialQuery,
}: {
  slug: string;
  initialQuery: string;
}) {
  const [detail, setDetail] = useState<BookDetailData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    apiClient
      .bookDetail(slug, toReviewQuery(initialQuery), controller.signal)
      .then(setDetail)
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        if (error instanceof ApiClientError && error.status === 404) {
          setNotFound(true);
          return;
        }
        setLoadError(
          error instanceof Error
            ? error.message
            : "Detail buku tidak dapat dimuat.",
        );
      });

    return () => controller.abort();
  }, [initialQuery, retryCount, slug]);

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
        <Link
          className="ui-focus-ring mb-8 inline-flex rounded-sm text-sm font-medium text-forest hover:underline"
          href="/books"
        >
          ← Kembali ke katalog
        </Link>
        {notFound ? (
          <Feedback
            description="Buku yang kamu cari tidak ada atau sudah dihapus."
            status="empty"
            title="Buku tidak ditemukan"
          />
        ) : loadError ? (
          <div>
            <Feedback
              description={loadError}
              status="error"
              title="Detail buku tidak dapat dimuat"
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
        ) : detail ? (
          <BookDetailView data={detail} initialQuery={initialQuery} />
        ) : (
          <Feedback status="loading" title="Memuat detail buku..." />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
