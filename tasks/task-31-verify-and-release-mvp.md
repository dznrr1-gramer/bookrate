# Task 31 — Memverifikasi dan menyiapkan rilis MVP

**Tujuan:** Memastikan seluruh alur MVP sesuai PRD dan siap dijalankan developer.

**Prasyarat:** Task 01–30.

**Pekerjaan:**
- Tambahkan/jalankan integration atau end-to-end test untuk discovery lokal dan Google Books API, impor metadata, auth, review, reading list, favorit, dashboard, dan admin.
- Jalankan Turborepo lint, typecheck, test, dan production build.
- Periksa security/RBAC, aksesibilitas, responsive UI, error/empty states, migrasi, seed, dan dokumentasi setup.
- Gunakan Superpowers verification/code review jika tersedia; lakukan proses setara jika tidak.

**Kriteria penerimaan:**
- Semua pemeriksaan wajib lulus; kegagalan yang belum terselesaikan dicatat jelas, bukan diabaikan.
- Developer baru dapat menyiapkan PostgreSQL lokal, mengisi environment, migrasi, seed, dan menjalankan aplikasi dari dokumentasi.
- Tidak ada secret dalam repository dan tidak ada ketergantungan database cloud.

**Verifikasi:** Jalankan seluruh command release dari root Bun/Turborepo dan ikuti setup lokal dari keadaan repository bersih.
