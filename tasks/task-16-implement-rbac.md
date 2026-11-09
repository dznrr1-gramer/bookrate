# Task 16 — Mengimplementasikan RBAC

**Tujuan:** Menegakkan hak akses Guest, User, dan Admin di sisi server.

**Prasyarat:** Task 15.

**Pekerjaan:**
- Buat helper otorisasi server untuk autentikasi dan role.
- Lindungi route, server actions, serta route handlers yang memerlukan izin.
- Definisikan penanganan redirect/unauthorized/forbidden yang konsisten.

**Kriteria penerimaan:**
- Guest dapat mengakses konten publik saja.
- User hanya mengubah data miliknya.
- Admin dapat mengakses operasi administratif; manipulasi UI/client tidak melewati pemeriksaan.

**Verifikasi:** Uji setiap role pada route dan mutation, termasuk request langsung tanpa UI.

## Status implementasi

- `RolesGuard` membedakan request tanpa principal (`401 UNAUTHORIZED`) dari principal dengan role yang tidak sesuai (`403 FORBIDDEN`); route tanpa metadata role tetap publik.
- Guard autentikasi JWT dan guard role tersedia untuk dipasang berurutan pada route terlindungi. Endpoint session yang sudah ada tetap mewajibkan JWT.
- `assertUserAccess` menyediakan kebijakan server untuk membatasi akses user ke resource miliknya dan memberi Admin akses lintas user. Kebijakan ini harus dipanggil API service sebelum membaca atau mengubah resource milik user.
- Verifikasi test mencakup akses publik, request tanpa autentikasi, role yang cocok/tidak cocok, akses resource milik sendiri, penolakan user lain, dan akses Admin.
- Belum ada route mutation produk atau route admin di API pada tahap ini; pengujian ownership memverifikasi policy helper, dan setiap task fitur wajib menerapkannya pada service/route yang mengakses data personal. UI belum menyediakan route atau server action terproteksi.
