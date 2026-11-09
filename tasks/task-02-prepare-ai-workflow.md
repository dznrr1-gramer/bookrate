# Task 02 — Menyiapkan workflow AI

**Tujuan:** Menyepakati cara AI Coding Agent melaksanakan dan memverifikasi task BookRate.

**Prasyarat:** Task 01.

**Pekerjaan:**
- Gunakan skill Superpowers brainstorming/writing-plans bila tersedia.
- Tentukan kebiasaan implementasi: satu task per perubahan terukur, test dahulu untuk perilaku penting, lalu review dan verifikasi.
- Jika skill Superpowers tidak tersedia, gunakan checklist setara tanpa menambahkan dependency aplikasi.

**Kriteria penerimaan:**
- Workflow menyebut perencanaan, TDD, code review, dan verification.
- Superpowers hanya alat/workflow pengembangan, bukan fitur produk atau paket runtime.
- Setiap task memiliki hasil dan kriteria selesai yang eksplisit.

**Verifikasi:** Pastikan workflow dapat dijalankan menggunakan tooling repository dan tidak membutuhkan dependency produk baru.

## Workflow yang disepakati

Untuk setiap task implementasi:

1. **Rencanakan:** Baca task, kriteria penerimaan, PRD, dan kode/pola yang sudah ada. Periksa dependensi serta batas scope; catat keputusan produk yang belum jelas sebelum mengasumsikannya. Gunakan brainstorming atau writing-plans Superpowers bila tersedia, atau lakukan langkah setara.
2. **Implementasikan terukur:** Kerjakan satu task dengan perubahan sekecil mungkin yang memenuhi kriteria. Pertahankan perilaku yang ada dan jangan memasukkan fitur di luar scope tanpa persetujuan.
3. **Uji dengan pendekatan TDD:** Untuk perilaku penting, tulis/jalankan tes yang menangkap perilaku yang diharapkan sebelum implementasi, lalu implementasikan dan pastikan tes lulus. Bila tes belum dapat ditulis lebih dahulu (misalnya fondasi tooling), jelaskan alasannya dan tambahkan verifikasi yang sesuai pada task tersebut.
4. **Review:** Tinjau diff untuk kesesuaian kriteria, regresi, validasi input, otorisasi, penanganan error, tipe, dan dokumentasi terkait. Perbaiki masalah yang disebabkan perubahan ini; jangan mencampur perbaikan tidak terkait.
5. **Verifikasi dan laporkan:** Jalankan tes, lint, typecheck, atau build paling relevan yang tersedia untuk perubahan. Laporkan perintah dan hasilnya, termasuk keterbatasan atau kegagalan; jangan mengklaim pemeriksaan yang tidak dijalankan.

Setiap task harus berakhir dengan hasil yang dapat diperiksa dan kriteria selesai yang eksplisit. Catat verifikasi pada task terkait atau ringkasan penyelesaian; lanjut ke task berikutnya hanya setelah prasyaratnya terpenuhi.

Superpowers adalah bantuan workflow bagi AI Coding Agent saja. Jangan menambah paket runtime, fitur produk, atau konfigurasi aplikasi untuk mengaktifkannya. Bila tidak tersedia, checklist di atas tetap dapat dijalankan dengan tooling repository.

### Selesai Task 02

- Workflow di atas mencakup perencanaan, TDD, code review, dan verifikasi.
- Workflow dapat dilakukan dengan membaca task/PRD, meninjau diff, serta menjalankan perintah tooling yang tersedia; task fondasi dapat memakai verifikasi yang relevan bila belum ada test runner.
- Tidak ada dependency aplikasi atau fitur produk baru yang diwajibkan.
