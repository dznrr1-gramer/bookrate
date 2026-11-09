# Task API-01 — Menyiapkan NestJS REST API

**Tujuan:** Menambahkan backend NestJS terpisah di `apps/api` sebagai satu-satunya pemilik business logic, autentikasi/otorisasi, dan akses runtime ke database.

**Prasyarat:** Task 03–08. Kerjakan setelah Task 08 dan sebelum Task 09–31.

**Pekerjaan:**
- Inisialisasi aplikasi NestJS TypeScript di `apps/api` sebagai Bun workspace dan integrasikan script `dev`, `build`, `lint`, `typecheck`, dan `test` dengan Turborepo.
- Tetapkan REST API berversi (prefix `/api/v1`), health endpoint, struktur module/controller/service, format error yang konsisten, dan dokumentasi OpenAPI.
- Gunakan schema Zod bersama untuk validasi request; konfigurasi environment server-side dengan error startup yang jelas.
- Konfigurasikan CORS dengan allowlist origin web yang eksplisit dan credential hanya bila dibutuhkan.
- Tetapkan NestJS dengan Passport sebagai pemilik autentikasi dan RBAC. Siapkan integration point/guard yang akan digunakan task autentikasi dan RBAC; dokumentasikan kontrak session/token yang aman untuk web, termasuk cookie HttpOnly/Secure, masa berlaku, dan mitigasi CSRF bila menggunakan cookie.
- Siapkan API client/config pada `apps/web` untuk mengonsumsi backend. Web tidak boleh mengakses Prisma/PostgreSQL atau menaruh business logic yang menjadi kewenangan API.
- Atur agar akses runtime ke `packages/database` hanya dilakukan oleh API; script migrasi dan seed boleh dijalankan melalui workspace database.
- Jadikan PRD dan task ini sebagai acuan arsitektur untuk task bernomor berikutnya: implementasi backend dilakukan di `apps/api`, sedangkan `apps/web` mengonsumsi REST API. Rujukan lama ke Auth.js, server actions, route handlers, atau query Prisma di web tidak mengubah batas tanggung jawab tersebut.

**Kriteria penerimaan:**
- Aplikasi web dan API dapat dijalankan dan dibuild dari root monorepo melalui Turborepo.
- Health endpoint merespons; kontrak API dapat dilihat melalui OpenAPI.
- Request invalid ditolak di API, dan integration point Passport/guard siap digunakan task autentikasi dan RBAC berikutnya.
- CORS hanya menerima origin yang dikonfigurasi; credential dan secret tidak diekspos ke client atau log.
- Aplikasi web tidak memiliki koneksi database langsung dan mengakses fitur melalui REST API.
- Task lint, typecheck, test, dan build API berjalan dengan status yang benar.

**Verifikasi:** Jalankan lint/typecheck/test/build untuk kedua aplikasi dari root; uji health endpoint, OpenAPI, validasi request, serta origin CORS yang diizinkan dan ditolak. Uji integration point Passport/guard dengan test terisolasi tanpa menganggap autentikasi produk sudah selesai sebelum Task 15–16.

## Status implementasi

- NestJS API berjalan sebagai workspace `apps/api` pada `/api/v1` dengan health endpoint, OpenAPI development, format error JSON, validasi Zod development-only, allowlist CORS tanpa credentials, dan Passport/JWT guard plus role guard sebagai integration point.
- `apps/web` menyediakan API client awal dan tidak lagi bergantung pada atau mengimpor `@bookrate/database`; Prisma runtime hanya digunakan oleh API.
- Kontrak autentikasi web/API didokumentasikan di README. Cookie HttpOnly/SameSite dan credential CORS akan diaktifkan bersama implementasi autentikasi pada Task 15; production docs serta endpoint validasi development tidak didaftarkan.
- Verifikasi selesai: `bun run lint`, `bun run typecheck`, `bun run test`, dan `bun run build` berhasil dari root monorepo. Tes mencakup validasi request, OpenAPI, CORS, dan role guard.
- Uji langsung API development berhasil: `/api/v1/health` dan `/api/v1/docs/openapi.json` merespons HTTP 200; origin web yang diizinkan menerima header CORS, sedangkan origin lain tidak.
