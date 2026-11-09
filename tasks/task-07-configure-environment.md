# Task 07 — Menyiapkan environment dan konfigurasi

**Tujuan:** Membuat konfigurasi lokal yang aman dan konsisten untuk aplikasi.

**Prasyarat:** Task 03–06.

**Pekerjaan:**
- Tambahkan `.env.example` untuk variabel yang memang diperlukan, termasuk URL PostgreSQL lokal saat database disiapkan.
- Validasi environment di server dengan schema bertipe; hindari mengekspos secret ke client.
- Pastikan file environment nyata diabaikan Git.

**Kriteria penerimaan:**
- Developer mengetahui nama dan tujuan setiap variabel wajib.
- Nilai wajib yang hilang menghasilkan error yang jelas saat startup.
- Tidak ada credential nyata di file contoh atau source.

**Verifikasi:** Uji validasi dengan konfigurasi valid dan variabel wajib yang sengaja dihilangkan.

## Kontrak environment

| Variabel | Wajib | Default | Tujuan |
|---|---|---|---|
| `DATABASE_URL` | Ya untuk server API | — | URL koneksi PostgreSQL lokal; URL non-PostgreSQL ditolak. |
| `API_PORT` | Tidak | `4000` | Port server API; harus berupa integer antara 1–65535. |
| `WEB_ORIGIN` | Tidak | `http://localhost:3000` | Origin web yang akan digunakan API untuk kebijakan CORS. |
| `GOOGLE_BOOKS_API_KEY` | Tidak | — | Credential opsional untuk integrasi provider server-side; jangan pernah expose ke browser. |

`.env.example` hanya berisi placeholder dan nilai development lokal. Salin ke `.env` lalu ganti placeholder PostgreSQL sesuai instalasi lokal; jangan commit file environment nyata. `packages/config/src/env.ts` mengekspor `parseServerEnv`, schema bertipe yang harus dipanggil API pada startup. Parser tidak membaca atau mencetak secret dengan sendirinya; pemanggil harus meneruskan `process.env` dari konteks server.

Task 07 menyiapkan kontrak bersama sebelum aplikasi API dan database lokal dibuat. Database benar-benar diperlukan saat Task 09 dan API akan mengaktifkan validasi saat bootstrap di API-01.

### Selesai Task 07

- File contoh dan schema server-side dibuat; variabel public/client tidak berisi database URL atau provider key.
- Test mencakup konfigurasi valid/default, nilai eksplisit, URL database wajib, scheme PostgreSQL, dan batas port.
- Variabel diteruskan ke proses Turborepo melalui `globalPassThroughEnv`, tidak dijadikan input hash/cache.
