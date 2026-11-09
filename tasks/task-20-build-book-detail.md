# Task 20 — Membangun detail buku

**Tujuan:** Menampilkan informasi lengkap buku beserta rating dan review komunitas.

**Prasyarat:** Task 19.

**Pekerjaan:**
- Buat route detail berdasarkan slug.
- Tampilkan cover, judul, author, publisher, tahun, ISBN, halaman, bahasa, deskripsi, kategori/genre, rating, dan jumlah review.
- Tambahkan daftar review terpaginasikan dan rekomendasi buku terkait.

**Kriteria penerimaan:**
- Metadata ditampilkan sesuai data yang tersedia tanpa placeholder menyesatkan.
- Buku yang tidak ada menampilkan not-found state.
- Tautan menuju kategori dan review bekerja.

**Verifikasi:** Uji data lengkap/minimal, slug tidak ada, dan navigasi ke fitur personal.

## Status implementasi

- API `GET /api/v1/books/:slug` mengembalikan metadata, kategori/genre, agregat rating, ulasan terpaginasikan, serta rekomendasi buku terkait. Slug dan parameter ulasan divalidasi; buku yang tidak ditemukan menghasilkan 404.
- Halaman `/books/:slug` menampilkan metadata yang tersedia dan menyebutkan metadata yang kosong secara eksplisit, dengan state loading/error/not-found, tautan kategori/genre dan ulasan, pagination serta pengurutan ulasan, dan buku terkait.
- Verifikasi test: 24 test API, 10 test web, dan 9 test validator lulus. Typecheck dan lint API/web serta build API lulus.
- Uji API dengan seed PostgreSQL: detail Laut Bercerita menghasilkan HTTP 200 (rating 4.5, 2 ulasan, 3 buku terkait); slug tak dikenal menghasilkan HTTP 404; `page=0` menghasilkan HTTP 400.
- Uji browser: detail tampil dengan metadata dan rekomendasi; slug tak dikenal menampilkan state “Buku tidak ditemukan”; halaman kedua ulasan dan tautan kategori bekerja. Pada lebar 390 px tidak ada horizontal overflow.
- Production build monorepo lulus; rute `/books/[slug]` tercantum di hasil build Next.js.

**Status: Selesai.**
