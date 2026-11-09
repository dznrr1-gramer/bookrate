# Task 10 — Mengonfigurasi Prisma

**Tujuan:** Menyiapkan Prisma di `packages/database` untuk mengakses PostgreSQL.

**Prasyarat:** Task 05, 07, dan 09.

**Pekerjaan:**
- Tambahkan schema Prisma, generator client, datasource PostgreSQL, dan script migrasi.
- Ekspor Prisma Client dengan pola yang aman untuk Next.js development.
- Pastikan command terkait dijalankan dengan Bun dari root/workspace.

**Kriteria penerimaan:**
- Prisma Client berhasil di-generate.
- Migrasi awal dapat terhubung ke PostgreSQL lokal.
- Database package tidak bergantung pada Supabase/Firebase/Neon.

**Verifikasi:** Jalankan generate dan status/migrasi Prisma pada database lokal.

## Implementasi

- Prisma CLI dan client versi 6.19.0 ditambahkan ke `packages/database`.
- `prisma/schema.prisma` menggunakan PostgreSQL dan `DATABASE_URL`; `prisma.config.ts` memuat `.env` dari root monorepo untuk command workspace.
- Prisma Client diekspor sebagai singleton yang aman terhadap hot reload saat development.
- Script workspace menyediakan `db:generate`, `db:migrate`, `db:deploy`, `db:status`, dan typecheck yang meng-generate client.
- Migrasi awal `init` membuat model dasar `User`; domain schema dilanjutkan pada Task 11.
- Role database development lokal memiliki izin `CREATEDB` untuk shadow database Prisma Migrate. Izin ini khusus development, tidak untuk production.

## Verifikasi

- `bun run --filter @bookrate/database db:generate`: lulus.
- `bun run --filter @bookrate/database db:migrate -- --name init`: migrasi berhasil dibuat dan diterapkan ke PostgreSQL lokal.
- `bun run --filter @bookrate/database db:status`: lulus; database up to date.
- `bun run --filter @bookrate/database typecheck`: lulus, termasuk generate client.
- Query `SELECT current_database(), current_user` melalui Prisma Client: lulus sebagai `bookrate_dev`.
- `.env` tetap berada di luar Git; Prisma memuatnya melalui konfigurasi workspace tanpa menaruh kredensial di schema atau migration.

### Selesai Task 10

Prisma Client dan migrasi awal siap; Task 11 dapat melanjutkan desain model domain di atas fondasi ini.
