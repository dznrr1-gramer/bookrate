# Task 15 — Mengimplementasikan autentikasi

**Tujuan:** Menyediakan registrasi, login, logout, dan session yang dimiliki
NestJS REST API.

**Prasyarat:** Task API-01 dan Task 10–14.

**Pekerjaan:**
- Implementasikan registrasi/login/logout di `apps/api` dengan Passport dan
  akses Prisma hanya melalui `packages/database`.
- Hash password dan token session; jangan simpan token mentah atau password.
- Keluarkan access token singkat serta refresh/session token yang dirotasi melalui
  cookie `HttpOnly`, `SameSite=Lax`, dan `Secure` pada HTTPS/production.
- Batasi credentialed CORS ke `WEB_ORIGIN`; verifikasi `Origin` pada operasi yang
  mengubah state untuk mitigasi CSRF.
- Web mengonsumsi endpoint melalui API client; tidak memakai Auth.js/server
  actions untuk autentikasi dan tidak mengakses database langsung.
- Validasi request di API dengan schema Zod bersama. Form web boleh memakai
  schema yang sama untuk UX, tetapi server tetap sumber validasi/otorisasi.

**Kriteria penerimaan:**
- Password tidak pernah disimpan atau dicatat sebagai plaintext.
- Email duplikat dan kredensial salah ditangani tanpa membocorkan informasi sensitif.
- Session dapat dibaca di server dan logout mengakhiri session.

**Verifikasi:** Uji alur register/login/logout, email duplikat, password salah,
rotasi session, cookie security, CORS/CSRF, dan akses session.

## Status implementasi

- API menyediakan register, login, refresh, logout, dan pembacaan session melalui NestJS/Passport. Web memakai API client dengan `credentials: include` hanya untuk endpoint autentikasi.
- Password di-hash dengan scrypt; refresh token acak disimpan sebagai SHA-256 hash. Access JWT berlaku 15 menit, session refresh 7 hari, dan rotasi session dilakukan secara atomik.
- Access dan refresh cookie bersifat HttpOnly/SameSite=Lax; refresh cookie dibatasi ke `/api/v1/auth`. Cookie Secure aktif pada HTTPS/production. Logout menghapus session agar access JWT lama langsung tidak berlaku.
- CORS berkredensial hanya mengizinkan `WEB_ORIGIN`; semua endpoint autentikasi yang mengubah state memvalidasi `Origin`. `AUTH_JWT_SECRET` wajib di production.
- Verifikasi selesai: seluruh lint, typecheck, test, dan build monorepo berhasil. Uji langsung register, session, duplikasi email, login, rotasi/replay refresh token, logout, dan pencabutan session berhasil; data akun uji dibersihkan.
