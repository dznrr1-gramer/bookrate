# Task 18 — Membangun homepage

**Tujuan:** Membuat halaman publik sebagai pintu masuk discovery BookRate.

**Prasyarat:** Task 17 dan sumber data katalog minimal Task 11–13.

**Pekerjaan:**
- Bangun hero/CTA, search, featured, popular, highest-rated, recently added, kategori/genre, rekomendasi, statistik, review terbaru, dan footer.
- Hubungkan section ke query/service; gunakan fallback yang jelas bila belum ada data personal.
- Pastikan cover dan tautan menuju detail buku.

**Kriteria penerimaan:**
- Semua section utama PRD hadir dengan empty/loading/error state yang tepat.
- Search mengarahkan ke katalog dengan query yang dipertahankan.
- Guest dapat menggunakan halaman responsif.

**Verifikasi:** Uji render dengan seed data dan tanpa data; cek tautan serta responsivitas.

## Status implementasi

- API menyediakan `GET /api/v1/homepage` yang mengambil pilihan populer, rating tertinggi, buku terbaru, kategori/genre, ulasan terbaru, dan statistik dari PostgreSQL melalui Prisma.
- Homepage web mengambil data melalui API client; loading, kegagalan API dengan tombol retry, dan hasil kosong ditampilkan secara eksplisit. Rekomendasi Guest memakai daftar populer dan menjelaskan bahwa rekomendasi personal memerlukan aktivitas pengguna.
- Search mengirim query sebagai `/?q=...#katalog` dan mempertahankannya pada URL/input. Kartu buku dan kategori menautkan ke `/books` atau `/books/:slug`; halaman katalog dan detailnya dikerjakan pada Task 19–20.
- API diuji terhadap PostgreSQL lokal berisi seed data: 5 buku, 2 pembaca, 3 ulasan. Verifikasi browser menunjukkan data homepage tampil dan state tanpa data tampil saat API mengembalikan koleksi kosong.
- Verifikasi: 16 test API dan 6 test web lulus; lint, typecheck, production build monorepo, serta Prettier check untuk file task ini lulus. Uji browser pada 390 px dan 1365 px tidak menunjukkan horizontal overflow; pencarian `Laut` tersimpan di URL dan menampilkan 1 hasil. Pencarian kini diarahkan ke rute katalog `/books` yang dibangun pada Task 19.
- Tautan buku menuju detail `/books/:slug` kini aktif setelah Task 20. Navigasi dari homepage ke katalog dan detail tersedia, sementara state data, pencarian, serta responsivitas telah diverifikasi.

**Status: Selesai.**
