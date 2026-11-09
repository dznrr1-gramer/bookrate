# Task 13 — Membuat seed data

**Tujuan:** Menyediakan data development yang konsisten untuk membangun dan menguji fitur.

**Prasyarat:** Task 11–12.

**Pekerjaan:**
- Buat seed idempotent untuk genre/kategori, penulis/penerbit, buku, user contoh, review, dan reading list.
- Sediakan admin development hanya melalui konfigurasi lokal yang aman.
- Jangan menanam credential production atau data personal nyata.

**Kriteria penerimaan:**
- Seed dapat dijalankan berulang tanpa membuat duplikasi.
- Dataset mencakup kasus UI utama seperti buku tanpa review dan buku dengan beberapa review.
- Cara menjalankan seed terdokumentasi.

**Verifikasi:** Jalankan seed dua kali dan periksa jumlah serta relasi record.

## Implementasi

- Seed idempotent memakai upsert dan kunci stabil untuk 4 Author, 4 Publisher, kategori/genre, 5 Book, 2 pembaca contoh, 3 Review, 2 Favorite, dan 3 ReadingList.
- Dataset mencakup dua review untuk `Laut Bercerita` serta buku tanpa review.
- User development memakai email `.invalid` dan nama sintetis; tidak ada data personal nyata atau credential default.
- Admin development hanya dibuat jika `SEED_ADMIN_EMAIL` dan `SEED_ADMIN_PASSWORD` tersedia di `.env` lokal. Password minimum 12 karakter di-hash memakai scrypt; seed menolak `NODE_ENV=production`.
- Menjalankan seed tersedia lewat `bun run --filter @bookrate/database db:seed`; TypeScript seed dan konfigurasi Prisma masuk dalam typecheck database.

## Verifikasi

- Seed dijalankan dua kali dengan sukses.
- Jumlah setelah dua kali jalan tetap: 5 buku, 2 pembaca, 3 review, 2 favorite, 3 reading list, 2 kategori, 4 genre, 4 penulis, dan 4 penerbit.
- Data contoh memakai relasi yang valid; upsert tidak menggandakan record.
- Admin development sementara dibuat dengan kredensial acak dalam environment proses, hash scrypt berhasil diverifikasi, lalu akun uji dihapus.
- Seed ditolak saat `NODE_ENV=production`.
