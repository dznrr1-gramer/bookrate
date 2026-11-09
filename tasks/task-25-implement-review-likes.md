# Task 25 — Mengimplementasikan like review

**Tujuan:** Memungkinkan User menyukai atau membatalkan suka pada review.

**Prasyarat:** Task 16 dan 23.

**Pekerjaan:**
- Implementasikan like/unlike dengan relasi unik user-review.
- Tampilkan status like pengguna aktif dan jumlah like.
- Terapkan otorisasi dan update yang tahan terhadap request berulang.

**Kriteria penerimaan:**
- User tidak dapat membuat like duplikat.
- Unlike hanya menghapus like milik user aktif.
- Sorting berdasarkan like menggunakan jumlah yang konsisten.

**Verifikasi:** Uji like/unlike berulang, concurrent duplicate, Guest, dan dua user berbeda.
