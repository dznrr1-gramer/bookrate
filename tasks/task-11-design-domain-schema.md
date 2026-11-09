# Task 11 — Mendesain schema domain

**Tujuan:** Memodelkan entitas dan relasi domain BookRate dalam Prisma.

**Prasyarat:** Task 01 dan 10.

**Pekerjaan:**
- Modelkan User/Auth.js Account/Session, Book, Author, Publisher, Category, Genre, Review, ReviewLike, Favorite, dan ReadingList.
- Tetapkan enum role dan status bacaan yang konsisten dengan PRD.
- Gunakan relasi eksplisit dan nullable fields hanya bila domain mengizinkan.

**Kriteria penerimaan:**
- Relasi mendukung alur katalog, review, like, favorit, dan daftar bacaan.
- Model menyimpan data minimum sesuai PRD dan tidak menduplikasi data agregat tanpa kebutuhan.
- Schema dapat divalidasi Prisma.

**Verifikasi:** Jalankan `prisma validate` dan tinjau relasi/domain bersama acceptance criteria PRD.

## Implementasi

- Memodelkan User, Account, Session, Book, Author, Publisher, Category, Genre, Review, ReviewLike, Favorite, dan ReadingList.
- Relasi User/Book/Review eksplisit; Book ke Author/Category/Genre many-to-many; Publisher opsional.
- Enum tersimpan berisi Role (`USER`, `ADMIN`) dan ReadingStatus. Guest tidak memiliki row User; role UI `GUEST` tetap merupakan konteks pengunjung.
- Account/Session menyimpan field kompatibel dengan pola adapter Auth.js; runtime autentikasi tetap mengikuti arsitektur API NestJS/Passport di PRD.
- Rating disimpan pada Review; rata-rata rating dan jumlah like dihitung dari relasi, bukan diduplikasi sebagai agregat.
- Constraint unik dan indeks query sengaja dikerjakan pada Task 12.

## Verifikasi

- `bun run --filter @bookrate/database db:validate`: lulus.
- `bun run --filter @bookrate/database db:migrate -- --name domain_schema`: migrasi berhasil diterapkan pada PostgreSQL lokal.
