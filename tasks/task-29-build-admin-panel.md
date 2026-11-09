# Task 29 — Membangun admin panel

**Tujuan:** Menyediakan operasi administratif untuk mengelola konten dan komunitas.

**Prasyarat:** Task 16–20 dan Task 23–24.

**Pekerjaan:**
- Buat dashboard admin untuk CRUD buku, penulis/penerbit, kategori/genre, manajemen akun, moderasi review, dan konten homepage.
- Gunakan Zod untuk form dan otorisasi Admin pada setiap server mutation.
- Catat aksi administratif penting sesuai rancangan audit yang proporsional.

**Kriteria penerimaan:**
- Semua route dan mutation admin menolak Guest/User.
- Admin dapat mengelola data sesuai scope PRD dengan feedback berhasil/gagal yang jelas.
- Tindakan destruktif memerlukan konfirmasi dan tidak meninggalkan relasi rusak.

**Verifikasi:** Uji izin tiga role dan CRUD/moderasi pada dataset development.
