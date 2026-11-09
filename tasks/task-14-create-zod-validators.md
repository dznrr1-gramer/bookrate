# Task 14 — Membuat schema validasi Zod

**Tujuan:** Menyediakan validasi input bersama untuk form dan operasi server.

**Prasyarat:** Task 05 dan keputusan domain Task 11.

**Pekerjaan:**
- Buat schema untuk register/login, profil, buku, kategori/genre, review, favorite, reading list, dan parameter katalog.
- Batasi nilai rating 1–5 dan status bacaan ke enum yang disepakati.
- Ekspor tipe input dari schema; validasi juga wajib pada server.

**Kriteria penerimaan:**
- Batas panjang/format sesuai aturan produk dan error dapat dipakai UI.
- Schema tidak menerima nilai di luar domain.
- Tidak ada validasi keamanan yang hanya dilakukan client-side.

**Verifikasi:** Tambahkan unit test kasus valid, invalid, batas minimum/maksimum, lalu jalankan Turborepo test.

## Implementasi

- Zod ditambahkan sebagai dependency langsung pada `@bookrate/validators`; package menyediakan `test` dan `typecheck`.
- Schema dan tipe hasil inferensi tersedia untuk register/login, update profil/buku/kategori/genre/review, create buku/taksonomi/review, favorite, reading list, serta query katalog/review.
- Rating hanya menerima integer 1–5; reading status hanya menerima tiga nilai domain.
- Validasi mencakup panjang teks, format email/slug/ISBN/URL HTTP(S), metadata buku, pagination, sorting, dan object key yang tidak dikenal.
- API belum ada pada repository ini. Package validator dapat digunakan langsung dari server; ketika API dibuat, setiap body/query harus diparse di server dan tidak mengandalkan validasi browser.

## Verifikasi

- `bun run --filter @bookrate/validators test`: 9 test lulus, termasuk input valid, invalid, serta batas minimum/maksimum.
- `bun run --filter @bookrate/validators typecheck`: lulus.
- `bun run test`: dijalankan untuk memverifikasi workflow Turborepo seluruh workspace.
