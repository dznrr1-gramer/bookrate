# Task 23 — Mengimplementasikan rating dan review

**Tujuan:** Memungkinkan User membuat dan mengelola satu review per buku.

**Prasyarat:** Task 14–16 dan Task 20.

**Pekerjaan:**
- Implementasikan create, update, dan delete review berisi rating 1–5 dan teks.
- Batasi perubahan/penghapusan pada pemilik review atau admin sesuai policy.
- Buat sorting terbaru, rating, dan like serta paginasi untuk review.

**Kriteria penerimaan:**
- Satu user tidak dapat memiliki review ganda pada buku yang sama.
- Semua mutation memvalidasi input dan memeriksa izin di server.
- Review tampil pada detail buku dan profil dengan escaping konten.

**Verifikasi:** Uji CRUD, duplikasi, rating di luar rentang, unauthorized, dan akses lintas pemilik.
