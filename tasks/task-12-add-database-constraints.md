# Task 12 — Menambahkan constraint dan indeks

**Tujuan:** Menjaga integritas data dan mendukung query utama katalog serta dashboard.

**Prasyarat:** Task 11.

**Pekerjaan:**
- Tambahkan unique constraint untuk email, slug, ISBN bila tersedia, pasangan review user-book, favorit user-book, like user-review, dan reading-list user-book.
- Tambahkan indeks pencarian/lookup berdasarkan kebutuhan query.
- Terapkan constraint melalui migrasi, bukan hanya validasi UI.

**Kriteria penerimaan:**
- Database mencegah duplikasi relasi personal.
- Indeks mempunyai alasan berdasarkan query yang digunakan.
- Migrasi aman terhadap data yang sudah ada di development.

**Verifikasi:** Terapkan migrasi dan uji constraint dengan percobaan insert duplikat.

## Implementasi

- Constraint unik pada email, slug Book/Category/Genre, ISBN dan Google Books Volume ID opsional, identitas provider, session token, serta pasangan user-book/user-review yang memerlukan deduplikasi.
- Indeks katalog dan dashboard pada title/author, publisher, review per book dan waktu/rating, review per user dan waktu, like per review, favorite per user dan waktu/book, serta reading list per user dan status/book.
- Migrasi `20261107030459_add_constraints_and_indexes` dibuat dari schema terhadap database development yang sudah tervalidasi kosong, lalu diterapkan menggunakan `db:deploy`.

## Verifikasi

- `bun run --filter @bookrate/database db:validate`: lulus.
- `bun run --filter @bookrate/database db:deploy`: migrasi berhasil diterapkan.
- Percobaan insert duplikat melalui Prisma Client ditolak PostgreSQL untuk email, slug buku/kategori/genre, ISBN, Google Books Volume ID, Account provider, session token, review user-book, favorite user-book, reading-list user-book, dan like user-review.
- Data pengujian dibersihkan setelah verifikasi; database development tidak berisi record uji.

`prisma migrate dev` meminta konfirmasi interaktif ketika mendeteksi unique constraint baru dan menolak berjalan di runner non-interaktif. Karena itu SQL versioned dibuat dengan `prisma migrate diff` setelah memastikan database kosong, lalu diterapkan lewat `prisma migrate deploy`. Untuk penggunaan development interaktif biasa, tetap gunakan `db:migrate`.
