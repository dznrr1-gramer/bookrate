# Task 27 — Mengimplementasikan buku favorit

**Tujuan:** Memungkinkan User menyimpan dan menghapus favorit.

**Prasyarat:** Task 14–16 dan Task 20.

**Pekerjaan:**
- Implementasikan add/remove favorite dengan aksi toggle yang aman.
- Tampilkan daftar favorit pada dashboard pengguna.
- Gunakan relasi unik user-buku dan state UI yang terhubung ke data server.

**Kriteria penerimaan:**
- Buku tidak dapat difavoritkan ganda oleh user yang sama.
- Hanya pemilik favorit yang dapat menghapusnya.
- Guest diminta login tanpa menyebabkan mutation.

**Verifikasi:** Uji add/remove berulang, akun berbeda, Guest, dan daftar kosong.
