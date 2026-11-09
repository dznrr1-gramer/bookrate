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

**Verifikasi:** Uji kombinasi filter, sorting, pagination, query kosong, dan query invalid dengan test data.
