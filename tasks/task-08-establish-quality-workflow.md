# Task 08 — Menetapkan workflow kualitas

**Tujuan:** Menetapkan pemeriksaan rutin agar perubahan mudah ditinjau dan dipelihara.

**Prasyarat:** Task 03–06.

**Pekerjaan:**
- Konfigurasikan formatter/linter dan pola unit/integration test yang sesuai repository.
- Tetapkan aturan typecheck, test, dan build sebelum perubahan dianggap selesai.
- Instruksikan penggunaan TDD, review, dan verification; gunakan Superpowers jika tersedia.

**Kriteria penerimaan:**
- Perintah kualitas tersedia melalui Bun/Turborepo.
- Kegagalan lint/typecheck/test menghasilkan exit code gagal.
- Workflow tidak mengharuskan pemasangan Superpowers sebagai dependency aplikasi.

**Verifikasi:** Jalankan perintah kualitas dan pastikan contoh kegagalan tidak dilaporkan sebagai sukses.

## Workflow kualitas

- `bun run format:check` memeriksa format Prettier; gunakan `bun run format` untuk memperbaikinya.
- `bun run lint` menjalankan ESLint pada workspace yang sudah dikonfigurasi.
- `bun run typecheck` menjalankan pemeriksaan TypeScript untuk aplikasi dan package.
- `bun run test` menjalankan unit test dengan built-in `bun:test`; failure menghentikan pipeline dengan exit code non-zero.
- `bun run build` membangun aplikasi melalui Turborepo.
- Untuk perubahan perilaku, tulis tes yang gagal sebelum implementasi (TDD), lalu jalankan tes terkait. Sebelum menyatakan task selesai, jalankan format check, lint, typecheck, tes, dan build yang relevan; review diff dan laporkan hasil/perintah secara eksplisit.
- Superpowers boleh dipakai sebagai bantuan perencanaan/review bila tersedia, tetapi tidak menjadi dependency aplikasi.

### Selesai Task 08

- Prettier dan Bun test runner tersedia tanpa menambah dependency runtime. Test mencakup validasi environment serta smoke render route awal web.
- Verifikasi lulus/gagal secara nyata: semua tes saat ini lulus; test dengan assertion gagal akan menghasilkan exit code gagal dari Bun/Turborepo. Lint, typecheck, format check, dan build dijalankan untuk memastikan keseluruhan workflow.
- Web dan config memiliki test scripts; workspace lain menambahkan test ketika perilaku produk mulai tersedia.
