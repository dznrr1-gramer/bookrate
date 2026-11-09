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
