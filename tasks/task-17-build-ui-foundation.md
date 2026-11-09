# Task 17 — Membangun fondasi UI

**Tujuan:** Menyiapkan pola visual dan komponen dasar yang responsif dan dapat diakses.

**Prasyarat:** Task 04–05.

**Pekerjaan:**
- Tentukan tokens warna/typography/spacing dan layout aplikasi yang hangat serta mudah dibaca.
- Siapkan shadcn/ui, Lucide React, navigasi, footer, tombol, form field, rating display, dan feedback states.
- Terapkan semantic HTML dan dukungan keyboard.

**Kriteria penerimaan:**
- Komponen mengikuti satu pola desain yang konsisten.
- Layout bekerja di mobile dan desktop.
- Focus state, label, kontras, serta feedback form dapat digunakan dengan keyboard/screen reader.

**Verifikasi:** Jalankan lint/typecheck dan periksa layout pada viewport mobile serta desktop.

## Status implementasi

- Design tokens BookRate (warna kertas, forest, sage, teks, border, status, dan rating) ditetapkan sebagai CSS variables dan Tailwind theme tokens.
- `@bookrate/ui` menyediakan Button, Field dengan label/deskripsi/error, Rating yang diumumkan screen reader, Feedback untuk loading/error/success/empty, serta navigasi/footer responsif.
- Konfigurasi shadcn/ui menggunakan CSS variables, alias package UI, dan Lucide; ikon Lucide dipakai pada navigasi, form pencarian, rating, dan feedback.
- UI web memakai semantik main/header/nav/footer, tautan lewati ke konten utama, focus-visible, label form, state filter yang diumumkan dengan `aria-pressed`, serta reduced-motion preferences.
- Verifikasi test komponen menguji label/validasi input, nama rating, announcement state, default button type, dan disclosure navigasi seluler.
- Verifikasi lulus: test UI 5/5, test web 5/5, lint, typecheck, format check, dan production build web. Pemeriksaan browser pada lebar 390 px dan 1365 px memastikan tidak ada horizontal overflow; pencarian/filter dan menu navigasi seluler berfungsi.
