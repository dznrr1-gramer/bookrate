# Task 26 — Mengimplementasikan reading list

**Tujuan:** Memberi User daftar buku dengan status membaca.

**Prasyarat:** Task 14–16 dan Task 20.

**Pekerjaan:**
- Implementasikan tambah, ubah status, hapus, dan filter daftar buku.
- Gunakan status `WANT_TO_READ`, `CURRENTLY_READING`, dan `READ`.
- Kaitkan setiap entry ke user dan buku; sediakan komponen perubahan status yang jelas.

**Kriteria penerimaan:**
- Setiap pasangan user-buku hanya memiliki satu entry.
- Hanya pemilik entry yang dapat mengubah/menghapusnya.
- Perubahan status tercermin pada dashboard dan daftar terkait.

**Verifikasi:** Uji seluruh transisi status, duplicate, unauthorized, serta filter per status.
