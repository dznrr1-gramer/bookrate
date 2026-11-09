"use client";

import { BookmarkPlus } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Button,
  Feedback,
  Field,
  Rating,
  SiteFooter,
  SiteHeader,
} from "@bookrate/ui";

const books = [
  {
    title: "Laut Bercerita",
    author: "Leila S. Chudori",
    genre: "Fiksi",
    rating: 4.8,
    reviews: 284,
    palette: "from-sky-950 via-blue-800 to-cyan-500",
    mark: "LAUT\nBERCERITA",
    accent: "✳",
  },
  {
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    genre: "Pengembangan diri",
    rating: 4.7,
    reviews: 196,
    palette: "from-amber-700 via-orange-600 to-rose-500",
    mark: "FILOSOFI\nTERAS",
    accent: "◉",
  },
  {
    title: "Bumi",
    author: "Tere Liye",
    genre: "Fantasi",
    rating: 4.9,
    reviews: 342,
    palette: "from-emerald-950 via-teal-700 to-lime-700",
    mark: "BUMI",
    accent: "◌",
  },
  {
    title: "Pulang",
    author: "Tere Liye",
    genre: "Fiksi",
    rating: 4.6,
    reviews: 158,
    palette: "from-stone-950 via-neutral-800 to-orange-700",
    mark: "PULANG",
    accent: "⌂",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Pengembangan diri",
    rating: 4.8,
    reviews: 421,
    palette: "from-red-900 via-rose-800 to-orange-700",
    mark: "ATOMIC\nHABITS",
    accent: "✳",
  },
  {
    title: "Perahu Kertas",
    author: "Dee Lestari",
    genre: "Romansa",
    rating: 4.5,
    reviews: 129,
    palette: "from-indigo-950 via-violet-800 to-fuchsia-700",
    mark: "PERAHU\nKERTAS",
    accent: "⌁",
  },
];

const categories = [
  "Semua",
  "Fiksi",
  "Romansa",
  "Fantasi",
  "Pengembangan diri",
];

function BookCover({
  book,
  large = false,
}: {
  book: (typeof books)[number];
  large?: boolean;
}) {
  return (
    <div
      aria-label={`Sampul buku ${book.title}`}
      className={`relative isolate flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-xl bg-gradient-to-br ${book.palette} p-4 text-white shadow-lg ${large ? "max-w-[220px] p-6 sm:max-w-[250px]" : ""}`}
      role="img"
    >
      <span
        aria-hidden="true"
        className="absolute -right-7 -top-8 -z-10 text-[140px] leading-none text-white/15"
      >
        {book.accent}
      </span>
      <span className="text-[9px] font-semibold tracking-[0.24em] text-white/85">
        BOOKRATE EDITION
      </span>
      <span
        className={`whitespace-pre-line font-serif font-bold leading-[0.95] tracking-wide drop-shadow-sm ${large ? "text-3xl sm:text-4xl" : "text-lg"}`}
      >
        {book.mark}
      </span>
      <span className="text-[9px] font-medium tracking-[0.18em] text-white/90">
        {book.author.toUpperCase()}
      </span>
    </div>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");

  const filteredBooks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("id");
    return books.filter((book) => {
      const matchesCategory = category === "Semua" || book.genre === category;
      const matchesQuery =
        !normalizedQuery ||
        `${book.title} ${book.author} ${book.genre}`
          .toLocaleLowerCase("id")
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

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
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                className="ui-focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark"
                href="#katalog"
              >
                Temukan buku <span aria-hidden="true">→</span>
              </a>
              <span className="text-sm text-muted">
                Baca. Nilai. Ceritakan.
              </span>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div aria-hidden="true" className="flex -space-x-2">
                {[
                  "bg-[#8b5e46]",
                  "bg-[#536b54]",
                  "bg-[#8c5142]",
                  "bg-[#766029]",
                ].map((color, index) => (
                  <span
                    className={`flex size-8 items-center justify-center rounded-full border-2 border-page ${color} text-[10px] font-bold text-white`}
                    key={color}
                  >
                    {["A", "N", "D", "R"][index]}
                  </span>
                ))}
              </div>
              <p className="text-xs text-muted">
                <span className="font-semibold text-ink">2.400+</span> pembaca
                sudah bergabung
              </p>
            </div>
          </div>

          <div
            aria-label="Pilihan sampul buku pembaca"
            className="relative mx-auto flex w-full min-w-0 max-w-lg items-center justify-center py-4"
            id="pilihan"
          >
            <div
              aria-hidden="true"
              className="absolute inset-5 rounded-[45%] bg-sage/40 blur-2xl"
            />
            <div className="relative flex w-full min-w-0 items-center justify-center gap-2 sm:gap-6">
              <div className="mt-12 w-[27%] rotate-[-8deg]">
                <BookCover book={books[1]} />
              </div>
              <div className="z-10 w-[36%] rotate-[2deg]">
                <BookCover book={books[0]} large />
              </div>
              <div className="mt-10 w-[27%] rotate-[9deg]">
                <BookCover book={books[2]} />
              </div>
            </div>
            <div className="absolute bottom-1 left-0 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lg sm:bottom-4">
              <p className="text-[10px] font-medium uppercase tracking-wider text-muted">
                Pilihan pembaca
              </p>
              <p className="mt-1 text-sm font-semibold">Laut Bercerita</p>
              <div className="mt-1 flex items-center gap-2">
                <Rating value={4.8} />
                <span className="text-xs text-muted">284 ulasan</span>
              </div>
            </div>
            <div className="absolute right-0 top-3 rounded-2xl border border-border bg-surface/95 px-4 py-3 shadow-lg sm:right-2">
              <p className="text-sm font-bold text-forest">+ 12</p>
              <p className="text-[10px] text-muted">buku baru minggu ini</p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="catalog-heading"
          className="border-t border-border bg-surface"
          id="katalog"
        >
          <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
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
              <Field
                aria-label="Cari buku"
                autoComplete="off"
                id="book-search"
                label="Cari buku"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul, penulis, atau genre..."
                type="search"
                value={query}
              />
            </div>

            <div
              aria-label="Filter berdasarkan kategori"
              className="mt-8 flex gap-2 overflow-x-auto pb-2"
              role="group"
            >
              {categories.map((item) => (
                <Button
                  aria-pressed={category === item}
                  className="min-h-10 shrink-0 px-4 py-2 text-xs"
                  key={item}
                  onClick={() => setCategory(item)}
                  variant={category === item ? "primary" : "secondary"}
                >
                  {item}
                </Button>
              ))}
            </div>

            {filteredBooks.length > 0 ? (
              <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
                {filteredBooks.map((book) => (
                  <article className="group min-w-0" key={book.title}>
                    <div className="relative">
                      <BookCover book={book} />
                      <button
                        aria-label={`Simpan ${book.title} ke daftar bacaan`}
                        className="ui-focus-ring absolute right-2 top-2 flex size-10 items-center justify-center rounded-full bg-surface/95 text-muted shadow-sm transition-colors hover:text-forest"
                        type="button"
                      >
                        <BookmarkPlus aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">
                        {book.title}
                      </p>
                      <Rating value={book.rating} />
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">
                      {book.author}
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      {book.reviews} ulasan
                    </p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-10">
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
                href="#katalog"
              >
                Jelajahi semua buku <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
