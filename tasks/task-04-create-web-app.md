# Task 04 — Membuat aplikasi web

**Tujuan:** Membuat aplikasi BookRate dengan Next.js App Router di `apps/web`.

**Prasyarat:** Task 03.

**Pekerjaan:**
- Inisialisasi Next.js dengan TypeScript dan App Router.
- Siapkan Tailwind CSS, halaman awal sederhana, serta script dev/build/lint/typecheck.
- Pastikan dependency dikelola melalui Bun workspace.

**Kriteria penerimaan:**
- Aplikasi dapat dijalankan dari root monorepo.
- Route awal dirender dan konfigurasi TypeScript berjalan.
- Tidak ada konfigurasi framework yang menduplikasi package root tanpa alasan.

**Verifikasi:** Jalankan dev server dan build aplikasi dengan script Bun/Turborepo terkait.

## Hasil

- `apps/web` dibuat sebagai Bun workspace Next.js App Router dengan TypeScript, Tailwind CSS, dan ESLint.
- Halaman awal BookRate berbahasa Indonesia menampilkan identitas dan pengantar produk; ini hanya fondasi, bukan implementasi homepage penuh yang menjadi task terpisah.
- Script workspace menyediakan `dev`, `build`, `lint`, dan `typecheck`. TypeScript mewarisi opsi bersama dari `@bookrate/config/tsconfig/base.json`; konfigurasi `.gitignore` aplikasi hanya memuat file spesifik Next.js.
- Metadata dasar menyebut BookRate. Font memakai stack sistem agar build tidak bergantung pada unduhan font saat build.
- Verifikasi berhasil: `bun install`; `bun run lint --filter=web`; `bun run typecheck --filter=web`; `bun run build --filter=web`; dev server dari root mengembalikan HTTP 200 dan teks halaman awal yang diharapkan.
