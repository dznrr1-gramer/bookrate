# Task 09 — Menyiapkan PostgreSQL lokal

**Tujuan:** Menyediakan database lokal sebagai persistence utama BookRate.

**Prasyarat:** Task 07.

**Pekerjaan:**
- Dokumentasikan cara menjalankan PostgreSQL lokal menggunakan tooling yang dipilih tim.
- Atur connection string melalui environment dan jelaskan langkah membuat database development.
- Jangan mengganti PostgreSQL dengan layanan database cloud.

**Kriteria penerimaan:**
- Developer dapat menjalankan dan menghubungkan database lokal.
- Credential development tidak disimpan dalam source.
- Dokumentasi membedakan database development dari production.

**Verifikasi:** Hubungkan client PostgreSQL lokal dan jalankan query pemeriksaan sederhana.

## Implementasi

- PostgreSQL 18 lokal terdeteksi pada Windows dan service menerima koneksi di `localhost:5432`.
- README menjelaskan pembuatan role/database development, konfigurasi `.env` yang diabaikan Git, query verifikasi, serta pemisahan dari production.
- `.env.example` memuat URL PostgreSQL localhost dengan placeholder kredensial; ganti nilainya hanya di `.env`.

## Status verifikasi

- `pg_isready -h localhost -p 5432`: lulus.
- Koneksi administrator PostgreSQL lokal: lulus.
- Database `bookrate` dan role aplikasi `bookrate_dev` berhasil dibuat.
- Query SQL menggunakan role aplikasi menghasilkan database `bookrate` dan user `bookrate_dev`.
- `.env` lokal berisi URL koneksi development dan dikonfirmasi diabaikan Git; password tidak disimpan di repository.

### Selesai Task 09

PostgreSQL lokal siap dipakai aplikasi melalui `DATABASE_URL`. Kredensial development dibuat hanya di `.env` lokal; dokumentasi membedakan database development dan production.
