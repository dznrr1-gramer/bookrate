# BookRate Implementation Tasks

Dokumen ini mengindeks 31 task implementasi MVP BookRate. **Satu task = satu file**; kerjakan dan verifikasi satu per satu sesuai nomor, kecuali task independen yang dapat dikerjakan paralel setelah dependensinya selesai.

## Standar proyek

- Ikuti PRD di `../README.md`.
- Gunakan Bun sebagai runtime/package manager dan Bun Workspaces bersama Turborepo.
- Database utama adalah PostgreSQL lokal, dengan Prisma sebagai ORM. Akses database runtime dilakukan oleh `apps/api`.
- Gunakan Next.js App Router untuk web dan NestJS REST API untuk backend. NestJS API menangani autentikasi, otorisasi, validasi, serta business logic.
- Gunakan TypeScript, Tailwind CSS, shadcn/ui, Zod, React Hook Form, Lucide React, dan Recharts sesuai kebutuhan fitur.
- Jalankan task project melalui pipeline Turborepo untuk `dev`, `build`, `lint`, `typecheck`, dan `test`.
- Gunakan Superpowers sebagai workflow AI Coding Agent bila tersedia (brainstorming, writing-plans, TDD, code review, verification); bukan dependency atau fitur produk. Jika tidak tersedia, lakukan langkah setara.
- Jangan menaruh credential/secret di repository; jangan memakai database cloud sebagai pengganti PostgreSQL lokal.
- Salin `.env.example` ke file environment lokal dan ganti placeholder; jangan commit file environment nyata. Jalankan `bun run format:check`, `bun run lint`, `bun run typecheck`, `bun run test`, dan `bun run build` yang relevan sebelum task dinyatakan selesai.

## Urutan

| ID | Task | File |
|---|---|---|
| 01 | Validasi kebutuhan MVP | [task-01-validate-mvp-requirements.md](./task-01-validate-mvp-requirements.md) |
| 02 | Rencana kerja AI | [task-02-prepare-ai-workflow.md](./task-02-prepare-ai-workflow.md) |
| 03 | Monorepo Bun dan Turborepo | [task-03-bootstrap-monorepo.md](./task-03-bootstrap-monorepo.md) |
| 04 | Aplikasi Next.js | [task-04-create-web-app.md](./task-04-create-web-app.md) |
| 05 | Shared packages | [task-05-create-shared-packages.md](./task-05-create-shared-packages.md) |
| 06 | Pipeline Turborepo | [task-06-configure-turbo-pipeline.md](./task-06-configure-turbo-pipeline.md) |
| 07 | Environment dan konfigurasi | [task-07-configure-environment.md](./task-07-configure-environment.md) |
| 08 | Workflow kualitas | [task-08-establish-quality-workflow.md](./task-08-establish-quality-workflow.md) |
| 09 | PostgreSQL lokal | [task-09-run-local-postgresql.md](./task-09-run-local-postgresql.md) |
| 10 | Prisma | [task-10-configure-prisma.md](./task-10-configure-prisma.md) |
| 11 | Schema domain | [task-11-design-domain-schema.md](./task-11-design-domain-schema.md) |
| 12 | Constraint dan indeks | [task-12-add-database-constraints.md](./task-12-add-database-constraints.md) |
| 13 | Seed data | [task-13-create-seed-data.md](./task-13-create-seed-data.md) |
| 14 | Validasi Zod | [task-14-create-zod-validators.md](./task-14-create-zod-validators.md) |
| 15 | Autentikasi | [task-15-implement-authentication.md](./task-15-implement-authentication.md) |
| 16 | RBAC | [task-16-implement-rbac.md](./task-16-implement-rbac.md) |
| 17 | Fondasi UI | [task-17-build-ui-foundation.md](./task-17-build-ui-foundation.md) |
| 18 | Homepage | [task-18-build-homepage.md](./task-18-build-homepage.md) |
| 19 | Katalog dan pencarian | [task-19-build-book-catalog.md](./task-19-build-book-catalog.md) |
| 20 | Detail buku | [task-20-build-book-detail.md](./task-20-build-book-detail.md) |
| 21 | Profil publik | [task-21-build-public-profiles.md](./task-21-build-public-profiles.md) |
| 22 | Profil dan dashboard pengguna | [task-22-build-user-dashboard.md](./task-22-build-user-dashboard.md) |
| 23 | Rating dan review | [task-23-implement-reviews.md](./task-23-implement-reviews.md) |
| 24 | Rating agregat | [task-24-maintain-rating-aggregates.md](./task-24-maintain-rating-aggregates.md) |
| 25 | Like review | [task-25-implement-review-likes.md](./task-25-implement-review-likes.md) |
| 26 | Reading list | [task-26-implement-reading-list.md](./task-26-implement-reading-list.md) |
| 27 | Favorit | [task-27-implement-favorites.md](./task-27-implement-favorites.md) |
| 28 | Statistik membaca | [task-28-build-reading-statistics.md](./task-28-build-reading-statistics.md) |
| 29 | Admin panel | [task-29-build-admin-panel.md](./task-29-build-admin-panel.md) |
| 30 | Integrasi Google Books API | [task-30-integrate-google-books-api.md](./task-30-integrate-google-books-api.md) |
| 31 | Verifikasi MVP | [task-31-verify-and-release-mvp.md](./task-31-verify-and-release-mvp.md) |

## Task backend tambahan

Kerjakan API-01 setelah Task 08 dan sebelum Task 09–31. Task ini menyiapkan backend terpisah yang menjadi fondasi bagi implementasi fitur backend pada task bernomor.

| ID | Task | File |
|---|---|---|
| API-01 | Menyiapkan NestJS REST API | [task-api-01-bootstrap-nestjs-rest-api.md](./task-api-01-bootstrap-nestjs-rest-api.md) |
