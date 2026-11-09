# Task 19 — Membangun katalog dan pencarian

**Tujuan:** Memungkinkan Guest/User menemukan buku dengan query dan filter.

**Prasyarat:** Task 10–14 dan Task 17.

**Pekerjaan:**
- Buat katalog dengan search judul/penulis/ISBN, filter kategori/genre/rating minimum, sorting popularitas/rating/terbaru/judul, dan pagination.
- Simpan filter/sort/page di URL agar dapat dibagikan dan digunakan tombol back.
- Validasi parameter server dan gunakan query Prisma terpaginasikan.

**Kriteria penerimaan:**
- Filter dapat dikombinasikan dan hasil konsisten dengan URL.
- Input invalid ditangani dengan aman.
- Halaman hasil kosong dan pagination batas akhir ditampilkan dengan benar.

## Status implementasi

- Endpoint publik `GET /api/v1/books` memvalidasi parameter katalog dengan `catalogQuerySchema` dan menjalankan pencarian terpaginasikan melalui Prisma.
- Pencarian mencakup judul, nama penulis, dan ISBN; filter kategori, genre, dan rating rata-rata minimum dapat dikombinasikan.
- Sorting mendukung popularitas, rating rata-rata, tanggal terbaru, dan judul dengan urutan stabil untuk hasil yang setara.
- Halaman `/books` mengambil hasil API, menyediakan filter dan pagination berbasis URL, serta menampilkan loading, error, hasil kosong, dan tautan ke halaman terakhir jika nomor halaman melewati batas.
- Navigasi Jelajahi dan pencarian homepage kini mengarah ke katalog; filter dan sorting tetap ada di URL untuk dibagikan dan digunakan tombol Back.

## Verifikasi

- Lulus: 20 test API, 9 test web, 5 test UI; typecheck API/web/UI/database; lint API/web; dan production build monorepo.
- Prettier check terfokus untuk file task ini lulus.
- Dengan seed PostgreSQL lokal: pencarian judul `Laut` dan penulis `Leila`, kombinasi kategori+genre+rating minimum, sorting rating/judul/popularitas, hasil tanpa kecocokan, dan halaman di luar batas diuji. Parameter rating invalid mendapat HTTP 400; halaman yang tidak tersedia menampilkan tautan ke halaman terakhir.
- Browser diuji pada lebar 390 px dan 1365 px tanpa horizontal overflow. Filter tersimpan pada URL, hasil kembali ke filter sebelumnya dengan tombol Back, dan submit filter kosong tetap menampilkan 5 buku.
