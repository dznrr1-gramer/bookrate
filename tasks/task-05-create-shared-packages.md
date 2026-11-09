# Task 05 — Membuat shared packages

**Tujuan:** Menyiapkan package bersama yang diperlukan arsitektur PRD.

**Prasyarat:** Task 03–04.

**Pekerjaan:**
- Buat package database, UI, validators, types, dan config di `packages/`.
- Definisikan nama package, exports, TypeScript entry points, dan dependency internal.
- Pertahankan package sekecil mungkin; hindari wrapper yang belum dibutuhkan.

**Kriteria penerimaan:**
- Package dapat diimpor dari `apps/web` melalui nama workspace.
- TypeScript dapat menyelesaikan exports tanpa path relatif lintas package.
- Tanggung jawab package tidak tumpang tindih.

**Verifikasi:** Tambahkan smoke import/typecheck dan jalankan task typecheck workspace.

## Hasil

- Dibuat `@bookrate/database`, `@bookrate/ui`, `@bookrate/validators`, `@bookrate/types`, dan `@bookrate/config` sebagai workspace package dengan ekspor TypeScript yang eksplisit.
- `@bookrate/config/tsconfig/base.json` menjadi sumber opsi TypeScript bersama; aplikasi web menggunakannya lewat nama workspace, tanpa path relatif lintas package.
- `@bookrate/types` menyediakan tipe dasar `ViewerRole`, `ReadingStatus`, dan `BookRating` yang mengikuti PRD. Entry point database/UI/validators disiapkan untuk implementasi sesuai task Prisma, UI, dan validasi berikutnya.
- Dependency workspace didaftarkan pada aplikasi web. Smoke import seluruh package serta pemeriksaan tipe berhasil melalui `bun run typecheck --filter=web`.
