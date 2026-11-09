"use client";

import { useMemo, useState } from "react";

const books = [
  {
    title: "Laut Bercerita",
    author: "Leila S. Chudori",
    genre: "Fiksi",
    rating: "4.8",
    reviews: 284,
    palette: "from-sky-950 via-blue-800 to-cyan-500",
    mark: "LAUT\nBERCERITA",
    accent: "✳",
  },
  {
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    genre: "Pengembangan diri",
    rating: "4.7",
    reviews: 196,
    palette: "from-amber-200 via-orange-300 to-rose-400",
    mark: "FILOSOFI\nTERAS",
    accent: "◉",
  },
  {
    title: "Bumi",
    author: "Tere Liye",
    genre: "Fantasi",
    rating: "4.9",
    reviews: 342,
    palette: "from-emerald-950 via-teal-700 to-lime-400",
    mark: "BUMI",
    accent: "◌",
  },
  {
    title: "Pulang",
    author: "Tere Liye",
    genre: "Fiksi",
    rating: "4.6",
    reviews: 158,
    palette: "from-stone-800 via-neutral-700 to-orange-300",
    mark: "PULANG",
    accent: "⌂",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Pengembangan diri",
    rating: "4.8",
    reviews: 421,
    palette: "from-red-700 via-rose-600 to-orange-300",
    mark: "ATOMIC\nHABITS",
    accent: "✳",
  },
  {
    title: "Perahu Kertas",
    author: "Dee Lestari",
    genre: "Romansa",
    rating: "4.5",
    reviews: 129,
    palette: "from-indigo-950 via-violet-700 to-fuchsia-300",
    mark: "PERAHU\nKERTAS",
    accent: "⌁",
  },
];

const categories = ["Semua", "Fiksi", "Romansa", "Fantasi", "Pengembangan diri"];

function BookCover({
  book,
  large = false,
}: {
  book: (typeof books)[number];
  large?: boolean;
}) {
  return (
    <div
      className={`relative isolate flex aspect-[3/4] w-full flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br ${book.palette} p-4 text-white shadow-lg ${large ? "max-w-[220px] p-6 sm:max-w-[250px]" : ""}`}
      aria-label={`Sampul buku ${book.title}`}
    >
      <span className="absolute -right-7 -top-8 -z-10 text-[140px] leading-none text-white/15">
        {book.accent}
      </span>
      <span className="text-[9px] font-semibold tracking-[0.24em] text-white/75">
        BOOKRATE EDITION
      </span>
      <span className={`whitespace-pre-line font-serif font-bold leading-[0.95] tracking-wide ${large ? "text-3xl sm:text-4xl" : "text-lg"}`}>
        {book.mark}
      </span>
      <span className="text-[9px] font-medium tracking-[0.18em] text-white/80">
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
    <main className="min-h-screen bg-[#faf9f6] text-[#24241f]">
      <header className="border-b border-stone-200/80 bg-[#faf9f6]">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="#" className="flex items-center gap-2.5" aria-label="BookRate beranda">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#214c3b] font-serif text-xl text-white">
              b
            </span>
            <span className="text-xl font-semibold tracking-tight">bookrate</span>
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-stone-600 md:flex">
            <a className="text-[#214c3b]" href="#katalog">Jelajahi</a>
            <a className="transition hover:text-[#214c3b]" href="#pilihan">Pilihan editor</a>
            <a className="transition hover:text-[#214c3b]" href="#tentang">Tentang</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#masuk" className="hidden px-3 py-2 text-sm font-medium text-stone-700 sm:inline">
              Masuk
            </a>
            <a
              href="#daftar"
              className="rounded-full bg-[#214c3b] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#173a2c]"
            >
              Gabung gratis
            </a>
          </div>
        </div>
      </header>

      <section id="tentang" className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pb-24 md:pt-20">
        <div className="max-w-xl">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6e0d8] bg-[#eef3ee] px-3 py-1.5 text-xs font-semibold tracking-wide text-[#315b46]">
            <span className="size-1.5 rounded-full bg-[#5c8d6a]" />
            RUANG BACA MILIK BERSAMA
          </p>
          <h1 className="font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl md:text-[68px]">
            Setiap buku punya <span className="text-[#60836c] italic">cerita.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-stone-600 sm:text-lg sm:leading-8">
            Temukan bacaan berikutnya dari rekomendasi pembaca, bagikan ulasanmu,
            dan simpan semua perjalanan membaca di satu tempat.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href="#katalog" className="rounded-full bg-[#214c3b] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#173a2c]">
              Temukan buku <span aria-hidden="true">→</span>
            </a>
            <span className="text-sm text-stone-500">Baca. Nilai. Ceritakan.</span>
          </div>
          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2">
              {["bg-[#dcae91]", "bg-[#879b83]", "bg-[#c58d78]", "bg-[#d8bd76]"].map((color, index) => (
                <span key={index} className={`flex size-8 items-center justify-center rounded-full border-2 border-[#faf9f6] ${color} text-[10px] font-bold text-white`}>
                  {["A", "N", "D", "R"][index]}
                </span>
              ))}
            </div>
            <p className="text-xs text-stone-500">
              <span className="font-semibold text-stone-800">2.400+</span> pembaca sudah bergabung
            </p>
          </div>
        </div>
        <div id="pilihan" className="relative mx-auto flex w-full max-w-lg items-center justify-center py-4">
          <div className="absolute inset-5 rounded-[45%] bg-[#e8ede4] blur-2xl" />
          <div className="relative flex w-full items-center justify-center gap-4 sm:gap-6">
            <div className="mt-12 w-[31%] rotate-[-8deg]">
              <BookCover book={books[1]} />
            </div>
            <div className="z-10 w-[39%] rotate-[2deg]">
              <BookCover book={books[0]} large />
            </div>
            <div className="mt-10 w-[31%] rotate-[9deg]">
              <BookCover book={books[2]} />
            </div>
          </div>
          <div className="absolute bottom-1 left-0 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-lg sm:bottom-4">
            <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400">Pilihan pembaca</p>
            <p className="mt-1 text-sm font-semibold">Laut Bercerita</p>
            <p className="mt-0.5 text-xs text-stone-500">★ 4.8 <span className="text-stone-300">·</span> 284 ulasan</p>
          </div>
          <div className="absolute right-0 top-3 rounded-2xl border border-stone-200 bg-white/95 px-4 py-3 shadow-lg sm:right-2">
            <p className="text-sm font-bold text-[#315b46]">+ 12</p>
            <p className="text-[10px] text-stone-500">buku baru minggu ini</p>
          </div>
        </div>
      </section>

      <section id="katalog" className="border-t border-stone-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#63816b]">DARI KOMUNITAS</p>
              <h2 className="mt-3 font-serif text-3xl tracking-tight sm:text-4xl">Cari bacaan yang pas.</h2>
              <p className="mt-2 text-sm text-stone-500">Buku yang sedang dibicarakan para pembaca.</p>
            </div>
            <label className="flex w-full items-center gap-3 rounded-full border border-stone-200 bg-[#faf9f6] px-4 py-3 md:max-w-sm">
              <svg aria-hidden="true" className="size-4 shrink-0 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.2 4.2" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari judul, penulis, atau genre..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-stone-400"
                aria-label="Cari buku"
              />
            </label>
          </div>

          <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={category === item}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${category === item ? "bg-[#214c3b] text-white" : "border border-stone-200 bg-white text-stone-600 hover:border-[#9ab09d] hover:text-[#214c3b]"}`}
              >
                {item}
              </button>
            ))}
          </div>

          {filteredBooks.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-6">
              {filteredBooks.map((book) => (
                <article key={book.title} className="group min-w-0">
                  <div className="relative">
                    <BookCover book={book} />
                    <button
                      type="button"
                      aria-label={`Simpan ${book.title} ke daftar bacaan`}
                      className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/90 text-stone-600 shadow-sm transition hover:text-rose-600"
                    >
                      ♡
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{book.title}</p>
                    <span className="shrink-0 text-xs font-semibold text-[#9a7431]">★ {book.rating}</span>
                  </div>
                  <p className="mt-1 truncate text-xs text-stone-500">{book.author}</p>
                  <p className="mt-1 text-[11px] text-stone-400">{book.reviews} ulasan</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-10 rounded-2xl bg-[#faf9f6] p-8 text-center text-sm text-stone-500">
              Buku tidak ditemukan. Coba kata kunci atau kategori lain.
            </p>
          )}
          <div className="mt-10 text-center">
            <a href="#katalog" className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 transition hover:border-[#214c3b] hover:text-[#214c3b]">
              Jelajahi semua buku <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 bg-[#faf9f6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <a href="#" className="font-semibold tracking-tight text-stone-700">bookrate</a>
          <p>Tempat cerita tentang buku bertemu.</p>
          <p>© 2026 BookRate</p>
        </div>
      </footer>
    </main>
  );
}
