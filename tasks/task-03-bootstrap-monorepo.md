# Task 03 — Membuat monorepo Bun dan Turborepo

**Tujuan:** Menyiapkan root monorepo yang memakai Bun Workspaces dan Turborepo.

**Prasyarat:** Task 01–02.

**Pekerjaan:**
- Buat root `package.json` dengan Bun workspaces untuk `apps/*` dan `packages/*`.
- Inisialisasi Turborepo, lockfile Bun, dan konfigurasi TypeScript bersama.
- Jangan membuat lockfile package manager lain.

**Kriteria penerimaan:**
- Instalasi dependency dan perintah script berjalan dari root dengan Bun.
- Workspace app dan package dikenali.
- Konfigurasi dasar terdokumentasi dan tidak mengandung secret.

**Verifikasi:** Jalankan `bun install` dan perintah inspeksi workspace yang tersedia; pastikan lockfile Bun terbentuk.

## Hasil

- Root menggunakan Bun `1.4.0`, Bun Workspaces (`apps/*` dan `packages/*`), serta Turborepo `2.x`.
- Script root menyediakan `dev`, `build`, `lint`, `typecheck`, dan `test`; `turbo.json` mendefinisikan dependensi task serta output cache.
- Opsi TypeScript strict bersama kini diekspor oleh `@bookrate/config/tsconfig/base.json` (dipindahkan ke shared package pada Task 05). `.gitignore` root mengecualikan hasil build, dependency lokal, cache, dan file environment; `.env.example` tetap dapat dilacak.
- `bun install` berhasil dan menghasilkan `bun.lock`. Tidak dibuat lockfile package manager lain.
- Verifikasi: `bun pm ls` mengenali workspace uji pada kedua pola (`apps/*` dan `packages/*`); workspace uji dihapus setelah pengecekan. `bun run turbo --version` menghasilkan `2.11.10`, dan `bun run tsc --version` menghasilkan `5.9.3`.
- Workspace aplikasi dan package sesungguhnya akan ditambahkan oleh Task 04 dan 05; belum ada kode aplikasi pada tahap bootstrap ini.
