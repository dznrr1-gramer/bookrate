# Task 06 — Mengatur pipeline Turborepo

**Tujuan:** Menyatukan task development dan quality di Turborepo.

**Prasyarat:** Task 03–05.

**Pekerjaan:**
- Konfigurasikan task `dev`, `build`, `lint`, `typecheck`, dan `test`.
- Nyatakan dependency antar task, input/output cache, dan task development yang persistent.
- Tambahkan script package yang diperlukan agar task root benar-benar dapat dieksekusi.

**Kriteria penerimaan:**
- Perintah Turborepo dari root menjalankan script pada workspace terkait.
- Build bergantung pada build dependency yang relevan.
- Cache tidak menyimpan output yang berisi secret atau state yang tidak semestinya.

**Verifikasi:** Jalankan semua task yang sudah tersedia; task yang belum punya implementasi harus memiliki script aman dan statusnya jelas, bukan sukses palsu.

## Hasil

- Pipeline root menjalankan `dev`, `build`, `lint`, `typecheck`, dan `test` melalui Turborepo. `build`, `lint`, `typecheck`, dan `test` menunggu task workspace dependency bila tersedia; `dev` tetap persistent dan tidak dicache.
- Turbo memakai environment mode `strict` serta input default repo/workspace untuk hash task. Cache output build dinonaktifkan sementara karena konfigurasi environment build belum diselesaikan; output `.next` dan `dist` tidak disimpan Turbo Cache sampai aman ditinjau. Test belum menghasilkan artifact coverage sehingga tidak ada output test yang dicache.
- Workspace database, types, UI, dan validators memiliki script `typecheck` dan konfigurasi yang mewarisi `@bookrate/config`. Workspace config hanya berisi konfigurasi dan tidak memerlukan task runtime sendiri. Lint saat ini berlaku pada web yang telah memiliki ESLint.
- Pada saat Task 06, test runner belum tersedia dan perintah test gagal dengan pesan yang jelas, bukan sukses palsu. Test runner nyata disiapkan pada Task 08.
- Verifikasi saat Task 06: `bun install`, `bun run typecheck`, `bun run lint`, dan `bun run build` berhasil; test sengaja gagal sampai runner tersedia.

Catatan pembaruan Task 07–08: variabel server diteruskan dalam mode passthrough (tidak masuk hash/cache); build tetap tanpa cache. Bun test runner kini tersedia untuk workspace config dan web. Tidak ada artifact test yang dicache.
