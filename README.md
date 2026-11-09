# BookRate — Product Requirements Document (PRD)

## 1. Informasi Produk

### 1.1 Nama Produk
BookRate

### 1.2 Tagline
Discover Books. Share Your Stories.

### 1.3 Jenis Produk
Platform web untuk discovery buku, rating & review, manajemen daftar bacaan, dan komunitas pembaca.

### 1.4 Konsep Produk
BookRate adalah platform berbasis web yang memungkinkan pengguna mencari buku, membaca detail informasi buku, memberikan rating dan ulasan, menyimpan buku favorit, dan mengelola aktivitas membaca mereka. Produk ini berfokus pada pengalaman membaca yang personal, komunitas, dan keputusan pembelian/penemuan buku yang lebih terinformasi.

Produktivitas utama yang ditawarkan:
- Memudahkan pengguna menemukan buku baru berdasarkan genre, kategori, rating, popularitas, dan rekomendasi.
- Memberikan ruang bagi pembaca untuk berbagi pendapat secara terstruktur melalui rating dan review.
- Mengelola daftar bacaan secara personal sesuai status progres membaca.
- Membangun komunitas yang aktif melalui interaksi review, like, dan aktivitas pengguna.
- Menyediakan dashboard admin untuk pengelolaan konten, komunitas, dan statistik platform.

### 1.5 Tujuan Bisnis
- Meningkatkan discoverability buku bagi audiens umum.
- Menjadi sumber referensi buku yang terpercaya dan terstruktur.
- Menjaga engagement pengguna melalui aktivitas membaca dan review.
- Menumbuhkan komunitas pembaca yang aktif dan konsisten.
- Menyediakan data dan insight operasional untuk administrasi platform.

### 1.6 Tujuan Pengguna
- Menemukan buku sesuai preferensi.
- Menilai dan membagikan pengalaman membaca.
- Mengelola daftar buku yang ingin dibaca dan sedang dibaca.
- Menjaga jejak aktivitas membaca pribadi.
- Menjadi bagian dari komunitas pembaca.

---

## 2. Target Pengguna

### 2.1 Guest
Guest adalah pengguna yang belum login atau belum mendaftar. Mereka dapat mengakses halaman publik namun memiliki akses terbatas.

Hak akses Guest:
- Melihat halaman utama (home page)
- Menelusuri katalog buku
- Mencari buku berdasarkan judul, penulis, dan ISBN
- Memfilter buku berdasarkan kategori, genre, dan rating
- Menampilkan rating dan review publik
- Melihat profil publik pengguna
- Meminta mendaftar untuk mendapatkan manfaat fitur personal

### 2.2 User
User adalah pengguna terautentikasi yang memiliki akun aktif.

Fungsi utama User:
- Registrasi dan login
- Mengelola profil pengguna
- Menambahkan dan memperbarui review
- Memberikan rating pada buku
- Menyukai review orang lain
- Menyimpan buku favorit
- Menambahkan buku ke reading list dengan status tertentu
- Menampilkan riwayat aktivitas membaca
- Melihat statistik membaca pribadi
- Mengakses dashboard pengguna

### 2.3 Admin
Admin adalah role khusus dengan otorisasi administratif untuk mengelola platform.

Fungsi utama Admin:
- Mengelola data buku, kategori, dan genre
- Mengelola data akun pengguna
- Memoderasi review dan konten ulasan
- Melihat stats platform, aktivitas pengguna, dan performa buku
- Mengatur konten utama halaman depan
- Melakukan pengelolaan konten atau highlight editorial

### 2.4 Role-Based Access Control (RBAC)
Role hierarchy:
- Guest: akses publik terbatas
- User: akses personal terhadap fitur yang relevan
- Admin: akses penuh terhadap fitur operasional dan moderasi

Kontrol akses utama:
- Halaman publik dapat diakses Guest
- Fitur personal di-protect berdasarkan login
- Fitur admin hanya tersedia untuk role Admin
- RBAC ditegakkan oleh NestJS API pada setiap endpoint; frontend hanya mengatur tampilan sesuai hak akses

---

## 3. Teknologi dan Tech Stack

PRD ini menggunakan standar teknologi berikut untuk pengembangan aplikasi.

### 3.1 Core Technology
- Runtime & Package Manager: Bun
- Monorepo Management: Turborepo
- Frontend Framework: Next.js dengan App Router
- Backend Framework: NestJS dengan REST API
- Language: TypeScript
- Styling: Tailwind CSS
- UI Component: shadcn/ui
- Icons: Lucide React
- Database: PostgreSQL lokal
- ORM: Prisma
- Authentication: NestJS dengan Passport; API menjadi sumber autentikasi dan otorisasi
- Validation: Zod
- Form Management: React Hook Form
- Chart & Analytics: Recharts
- Book Metadata: Google Books API, dengan metadata buku terpilih disimpan di PostgreSQL lokal

Catatan penting:
- Database utama adalah PostgreSQL lokal, bukan Supabase, Firebase, Neon, atau database cloud.
- Tidak ada dependency aplikasi yang dipasang hanya untuk alasan branding atau gimmick.
- "Superpowers" diperlakukan sebagai workflow pendukung AI coding agent, bukan fitur aplikasi.

### 3.2 Monorepo Architecture
Struktur monorepo yang direkomendasikan:

```text
bookrate/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── services/
│   │   └── package.json
│   └── api/
│       ├── src/
│       │   ├── auth/
│       │   ├── books/
│       │   ├── reviews/
│       │   └── main.ts
│       └── package.json
│
├── packages/
│   ├── database/
│   ├── ui/
│   ├── types/
│   ├── validators/
│   ├── config/
│   └── eslint-config/
│
├── turbo.json
├── package.json
├── bun.lock
├── tsconfig.base.json
├── .env.example
└── README.md
```

### 3.3 Penjelasan Paket dan Fungsi

#### apps/web
Aplikasi frontend yang menyediakan interface berbasis web untuk end-user dan admin.
Fungsi utama:
- Routing dengan App Router Next.js
- UI page utama, catalog, detail buku, auth, dashboard pengguna, admin panel
- Mengonsumsi REST API BookRate melalui API client
- Logic presentasi dan interaksi pengguna

#### apps/api
Backend terpisah berbasis NestJS yang menyediakan REST API untuk aplikasi web.
Fungsi utama:
- Menangani autentikasi, otorisasi/RBAC, validasi, dan business logic
- Menyediakan endpoint untuk katalog, buku, review, reading list, favorit, profil, dan admin
- Mengakses PostgreSQL melalui Prisma dan `packages/database`
- Mengintegrasikan Google Books API dan mengimpor metadata buku terpilih
- Menyediakan dokumentasi endpoint melalui OpenAPI

#### packages/database
Berisi konfigurasi Prisma, schema database, migrasi, seed data, dan helper query. Akses database runtime dilakukan oleh `apps/api`, bukan `apps/web`.

#### packages/ui
Berisi komponen UI reusable, desain sistem, komponen shadcn/ui, dan komponen berbasis Tailwind.

#### packages/types
Berisi type definitions lintas aplikasi untuk domain buku, pengguna, review, dan reading list.

#### packages/validators
Berisi schema validasi Zod bersama untuk registrasi, login, profil, katalog,
buku, kategori/genre, review/rating, favorit, dan reading list. API wajib
memanggil schema ini pada input server; validasi browser hanya membantu UX dan
bukan batas keamanan.

#### packages/config
Berisi konfigurasi linting, TypeScript, Tailwind, dan rule umum monorepo.

### 3.4 Workflow Turborepo
Turborepo harus mengatur lifecycle berikut:
- development: menjalankan app web dan API dalam mode development
- build: build production app dan API
- lint: cek gaya dan kualitas kode
- typecheck: validasi TypeScript
- test: menjalankan unit/integration test

Manfaat penggunaan monorepo:
- Modularisasi kode dan domain logic
- Reusability antar aplikasi dan package
- Konsistensi konfigurasi dan standard tooling
- Skalabilitas untuk penambahan fitur di masa depan

### 3.5 Workflow AI / Superpowers
Superpowers dijadikan sebagai workflow pendukung AI Coding Agent, bukan dependency produk. Penggunaan yang disarankan:
- Brainstorming untuk kebutuhan produk dan problem framing
- Writing Plans untuk menyusun perencanaan implementasi
- Executing Plans untuk eksekusi bertahap
- Test-Driven Development (TDD) untuk fitur kritis
- Code Review untuk memastikan kualitas dan konsistensi
- Verification untuk validasi akhir sebelum release

---

## 4. User Stories dan Requirements

### 4.1 User Stories Umum
- Sebagai Guest, saya ingin melihat katalog buku agar bisa menemukan buku yang sesuai minat saya.
- Sebagai Guest, saya ingin mencari dan memfilter buku agar cepat menemukan rekomendasi yang relevan.
- Sebagai User, saya ingin mendaftar dan masuk ke akun agar dapat menyimpan aktivitas membaca saya.
- Sebagai User, saya ingin memberikan ulasan dan rating agar berbagi pengalaman saya.
- Sebagai User, saya ingin menambahkan buku ke favorit agar dapat mengaksesnya kembali nanti.
- Sebagai User, saya ingin mengelola reading list agar saya bisa mengikuti progres membaca.
- Sebagai Admin, saya ingin mengelola buku dan review agar konten platform tetap relevan dan berkualitas.

### 4.2 Functional Requirements
Semua fitur utama harus siap dikembangkan dengan pendekatan modular dan scalable.

---

## 5. Fitur Utama

### 5.1 Public Homepage
Halaman utama berfungsi sebagai landing page dan discovery layer untuk pengguna baru maupun member.

Komponen yang wajib ada:
- Hero section dengan headline, CTA, visual buku, dan manfaat platform
- Search bar untuk pencarian buku
- Featured Books
- Popular Books
- Highest Rated Books
- Recently Added Books
- Kategori dan genre buku
- Rekomendasi buku berbasis aktivitass pengguna atau popularitas
- Ringkasan statistik platform
- Section review komunitas atau review terbaru
- Footer dengan navigasi, link penting, dan informasi brand

Acceptance criteria:
- Pengguna dapat melihat buku yang dipromosikan dengan gambar cover dan rating singkat
- Search bar berfungsi dan menavigasi ke halaman katalog
- Section homepage ditampilkan dengan layout yang responsif

### 5.2 Authentication
Authentication harus aman, jelas, dan sesuai standar modern.

Fitur utama:
- Register
- Login
- Logout
- Session management
- Password hashing
- Validasi input
- Role-based authorization
- Proteksi halaman berdasarkan role

NestJS API adalah sumber autentikasi dan otorisasi. Aplikasi web menggunakan REST API dan tidak mengelola kredensial atau memutuskan izin secara mandiri. Kontrak session/token dan perlindungan request lintas origin harus konsisten dan didokumentasikan.

Acceptance criteria:
- Password disimpan dalam bentuk hash yang aman
- User yang belum login tidak dapat mengakses page private
- Session valid serta bisa expired otomatis
- Validasi email, password, dan form unik ditangani di frontend dan backend

### 5.3 Book Catalog
Halaman katalog adalah core discovery experience BookRate.

Fitur:
- Menampilkan seluruh buku
- Search berdasarkan judul, penulis, dan ISBN
- Mencari buku melalui Google Books API dan mengimpor buku terpilih ke katalog lokal
- Filter berdasarkan kategori dan genre
- Filter berdasarkan rating minimum
- Sorting berdasarkan popularitas, rating, terbaru, dan judul
- Pagination
- Opsi tampilan grid/list jika dibutuhkan

Acceptance criteria:
- Pengguna bisa menebak hasil relevan dalam waktu singkat
- Filter dan sort dapat dipakai secara kombinasi
- Pagination konsisten dan tidak memicu bug rendering
- Buku hasil impor tersimpan di PostgreSQL dan dapat digunakan oleh fitur katalog serta fitur personal

### 5.4 Book Detail
Setiap buku memiliki halaman detail yang lengkap.

Data utama yang ditampilkan:
- Cover buku
- Judul
- Penulis
- Penerbit
- Tahun terbit
- ISBN
- Jumlah halaman
- Bahasa
- Deskripsi
- Kategori
- Genre
- Rating rata-rata
- Jumlah review
- Daftar review pengguna
- Buku terkait atau rekomendasi

Acceptance criteria:
- Informasi buku tampil lengkap dan akurat
- Review pengguna dapat dilihat di halaman detail
- User dapat langsung memberikan rating atau menavigasi ke katalog terkait

### 5.5 Rating & Review
Fitur interaksi sosial utama platform.

Spesifikasi:
- Rating 1-5 bintang
- User hanya dapat memberikan satu rating dan review per buku
- User dapat mengedit review miliknya
- User dapat menghapus review miliknya
- User dapat menyukai review pengguna lain
- Review dapat diurutkan berdasarkan terbaru, rating, atau jumlah like
- Rata-rata rating dihitung otomatis

Acceptance criteria:
- Rating dan review disinkronisasi dengan total skor buku
- Sistem mencegah user menambahkan review ganda pada buku yang sama
- Sertakan tombol edit/hapus hanya untuk review milik user yang sedang login

### 5.6 Reading List
Reading list memungkinkan buku dikelompokkan berdasarkan status membaca.

Status yang digunakan:
- WANT_TO_READ
- CURRENTLY_READING
- READ

User dapat:
- Menambahkan buku ke reading list
- Mengubah status buku
- Menghapus buku dari reading list
- Melihat daftar buku berdasarkan status tertentu

Acceptance criteria:
- Status buku terikat pada user dan buku tertentu
- Perubahan status langsung tercermin di dashboard user
- User dapat memfilter berdasarkan status baca

### 5.7 Favorite Books
Fitur ini memberi cara cepat untuk menandai buku favorit.

User dapat:
- Menambahkan buku ke favorit
- Menghapus buku dari favorit
- Melihat daftar buku favorit di dashboard

Acceptance criteria:
- Buku favorit tidak ditambahkan ganda oleh user yang sama
- Daftar favorit dapat ditampilkan di dashboard atau profil

### 5.8 User Dashboard
Dashboard user berfungsi sebagai pusat aktivitas pribadi.

Minimal data yang ditampilkan:
- Ringkasan aktivitas
- Total buku yang telah dibaca
- Total review
- Total buku dalam reading list
- Buku favorit terbaru
- Statistik membaca
- Review terbaru

Acceptance criteria:
- Dashboard menampilkan data real-time sesuai user login
- Layout dashboard usable pada desktop dan mobile
- Data terhubung ke transaksi domain yang relevan

### 5.9 Admin Dashboard
Admin perlu memiliki panel operasional yang mendukung kontrol terhadap platform.

Fitur utama:
- Manajemen buku
- Manajemen kategori dan genre
- Manajemen akun pengguna
- Moderasi review
- Statistik dan aktivitas platform
- Konten utama halaman depan

Acceptance criteria:
- Admin dapat melakukan CRUD terhadap data domain inti
- Akses admin dibatasi dengan RBAC
- Akses tindakan kritis terdokumentasi dan loggable

---

## 6. Alur Pengguna (User Flows)

### 6.1 Alur Pencarian dan Discovery
1. Pengguna membuka homepage
2. Pengguna melihat buku unggulan, popular, dan rekomendasi
3. Pengguna menggunakan search bar atau filter
4. Sistem menampilkan katalog relevan
5. Pengguna membuka detail buku
6. Pengguna membaca deskripsi, review, dan rating
7. Pengguna dapat memilih untuk membeli, menandai favorit, atau menambahkan ke reading list

### 6.2 Alur Registrasi dan Login
1. Pengguna memilih tombol register
2. Pengguna mengisi nama, email, password, dan data dasar lain
3. Sistem memvalidasi input
4. Sistem membuat akun baru dan autentikasi session
5. User diarahkan ke dashboard atau home page

### 6.3 Alur Review dan Rating
1. User membuka halaman detail buku
2. User memilih tombol tulis review
3. User menilai buku dari 1-5 bintang
4. User menulis ulasan
5. Sistem menyimpan review dan menghitung rating rata-rata
6. Review muncul di detail buku dan halaman profil user

### 6.4 Alur Reading List
1. User membuka detail buku
2. User memilih status baca (Want to Read / Currently Reading / Read)
3. Sistem menyimpan relasi user-book dengan status tertentu
4. User bisa melihat status di dashboard atau reading list page

---

## 7. Arsitektur Sistem

### 7.1 Arsitektur Aplikasi
BookRate menggunakan arsitektur monorepo dengan frontend dan backend sebagai aplikasi terpisah. `apps/web` menggunakan Next.js untuk routing, rendering, UI, dan interaksi pengguna. `apps/api` menggunakan NestJS untuk menyediakan REST API berversi yang menangani autentikasi, otorisasi, validasi input, business logic, integrasi Google Books API, serta akses data. Web berkomunikasi dengan API melalui kontrak REST; web tidak mengakses Prisma atau PostgreSQL secara langsung. API menggunakan Prisma melalui `packages/database` untuk mengakses PostgreSQL lokal.

### 7.2 Layer Arsitektur
1. Presentation Layer: Next.js App Router + Tailwind + shadcn/ui di `apps/web`
2. API Layer: NestJS REST controllers dan OpenAPI di `apps/api`
3. Application Layer: NestJS services dan domain logic di `apps/api`
4. Validation Layer: Zod schemas yang digunakan bersama oleh web dan API
5. Persistence Layer: Prisma + PostgreSQL lokal, hanya diakses runtime oleh API
6. Authentication Layer: NestJS dengan Passport; API menegakkan autentikasi dan RBAC
7. Analytics Layer: Recharts di web dan metrics aggregation di API
8. External Book Data Layer: API mengakses Google Books; metadata yang dipilih diimpor ke PostgreSQL lokal

### 7.3 Prinsip Desain
- Modular: setiap domain dipisahkan berdasarkan fungsi
- Separation of concerns: web hanya menangani presentasi; API memiliki business logic dan akses data
- Scalable: siap berkembang dengan fitur baru
- Secure: validasi, auth, dan authorization diterapkan konsisten
- Maintainable: struktur monorepo dan naming conventions konsisten
- User-centered: fokus pada discoverability, engagement, dan interaksi komunitas

---

## 8. Data dan Database

### 8.1 Entitas Inti
Schema MVP memodelkan User, Account, Session, Book, Author, Publisher, Category,
Genre, Review, ReviewLike, Favorite, dan ReadingList. Role dan ReadingStatus
merupakan enum, sedangkan rating disimpan pada Review agar satu ulasan memiliki
satu nilai rating. UserActivity dan BookRecommendation belum menjadi tabel
karena belum ada alur MVP yang memerlukannya.

### 8.2 Entity Relationship Summary
- User has many Account, Session, Review, ReviewLike, Favorite, and ReadingList entries
- Book has many Review, Favorite, and ReadingList entries
- Book belongs to many Author, Category, and Genre; Publisher is optional
- Review belongs to User and Book and has many ReviewLike entries

### 8.3 Data Model Inti
#### User
- id
- name (nullable for external identity providers)
- email (nullable for external identity providers)
- emailVerified
- image (avatar)
- passwordHash (nullable for external identity providers)
- bio
- role
- createdAt
- updatedAt

`Role` berisi `USER` dan `ADMIN`. `GUEST` adalah status pengunjung tanpa akun,
bukan role yang disimpan pada User.

#### Book
- id
- title
- slug
- description
- isbn
- publishedYear
- pageCount
- language
- coverImage
- googleBooksVolumeId (opsional)
- authors (many-to-many)
- categories (many-to-many)
- genres (many-to-many)
- publisherId (opsional)
- createdAt
- updatedAt

#### Author, Publisher, Category, dan Genre

Masing-masing mempunyai `id` dan `name`; Category dan Genre juga mempunyai
`slug`. Book dapat berelasi dengan banyak Author, Category, dan Genre. Publisher
bersifat opsional pada sebuah Book.

#### Account dan Session

Account menyimpan identitas provider eksternal dan token terkait; Session
menyimpan token sesi, User, dan waktu kedaluwarsa. Keduanya memiliki relasi
eksplisit ke User dengan cascade delete. Keberadaan model ini tidak mengganti
arsitektur autentikasi API NestJS/Passport yang ditetapkan pada bagian arsitektur.

#### Review
- id
- userId
- bookId
- rating
- content
- createdAt
- updatedAt

Jumlah like dan rata-rata rating dihitung dari relasi ReviewLike dan Review,
bukan disalin ke kolom agregat.

#### ReadingList
- id
- userId
- bookId
- status (`WANT_TO_READ`, `CURRENTLY_READING`, atau `READ`)
- createdAt
- updatedAt

Favorite menghubungkan User dan Book; ReviewLike menghubungkan User dan Review.
Constraint unik dan indeks lookup dijaga oleh migrasi database, dengan pemetaan
constraint pada Task 12.

### 8.4 Indexing dan Query Strategy
- Index pada title, author, isbn, kategori, genre, rating, status
- Index pada userId dan bookId untuk lookup cepat
- Query untuk katalog perlu optimized pada filtering dan sorting
- Query analytics perlu support aggregation untuk dashboard admin dan user

---

## 9. Non-Functional Requirements

### 9.1 Performance
- Halaman utama dan katalog harus memuat dengan cepat
- Data buku harus dapat di-fetch dengan query yang efisien
- Pagination dan caching diprioritaskan untuk data yang sering dibutuhkan

### 9.2 Security
- Password hashing dengan mekanisme aman
- Validasi input di frontend dan backend
- Role-based access control ditegakkan oleh NestJS API pada setiap endpoint
- CORS hanya mengizinkan origin web yang terkonfigurasi; session/token dan credential tidak boleh terekspos ke JavaScript atau log
- Sanitasi dan escaping untuk konten user-generated content (review)

### 9.3 Reliability
- Sistem harus menangani error validation dengan graceful fallback
- Data review dan reading list harus konsisten
- Penghitungan rating harus valid tanpa duplikasi atau race condition
- Kegagalan atau rate limit Google Books API tidak boleh mengganggu katalog lokal; tampilkan status yang jelas dan pertahankan data lokal

### 9.4 Usability
- UI harus bersih, responsif, dan mudah dipahami
- Interaksi review, filter, dan dashboard harus intuitif
- Responsif untuk mobile, tablet, dan desktop

### 9.5 Maintainability
- Struktur modular sesuai monorepo
- Type-safe dengan TypeScript
- Domain logic dipisah dari view logic
- Schema validation menggunakan Zod

---

## 10. UX / UI Requirements

### 10.1 Design Principles
- Modern, warm, dan nyaman untuk komunitas buku
- Mengutamakan readability, whitespace, dan hierarki visual
- Fokus pada discoverability buku dan aktivitas komunitas
- Visual cover book dan metadata yang jelas

### 10.2 Layout Priority
1. Homepage
2. Catalog
3. Detail Book
4. User Dashboard
5. Admin Panel

### 10.3 UI Behavior
- Search bar konsisten di semua header utama
- Tombol CTA jelas untuk login, join, submit review, add to reading list
- Komponen rating digunakan secara konsisten di seluruh UI
- Komponen filter dapat diakses dengan mudah di desktop dan mobile

---

## 11. Acceptance Criteria Keseluruhan
Produk dapat dianggap siap untuk phase berikutnya apabila:
- Pengguna Guest dapat mencari, mencari dan melihat katalog buku
- User dapat mendaftar, login, dan menggunakan fitur personal
- User dapat menambahkan buku ke favorit dan reading list
- User dapat menambah, mengedit, dan menghapus review
- Pengguna dapat mencari buku dari Google Books API dan mengimpor metadata buku terpilih ke katalog PostgreSQL lokal
- Rating rata-rata terupdate otomatis
- Admin dapat mengelola buku serta konten platform
- Interface responsif dan konsisten
- Sistem aman terhadap validasi input dan akses role

---

## 12. Scope MVP vs Future Enhancements

### 12.1 MVP (Phase 1)
- Homepage
- Auth dan RBAC
- Book catalog
- Integrasi Google Books API dan impor metadata ke PostgreSQL
- Book detail
- Rating & review
- Reading list
- Favorite books
- User dashboard
- Admin basic management

### 12.2 Phase 2
- Recomendasi berbasis AI atau collaborative filtering
- Follow system antar pengguna
- Community feed dan aktivitas social
- Bookmarking dan sharing review
- Notification system
- Advanced admin analytics

### 12.3 Phase 3
- Mobile app
- Book club feature
- Reading challenge / streaks
- Marketplace atau partner library integration
- Bulk import dari dataset eksternal selain integrasi Google Books API di MVP

---

## 13. Roadmap Rekomendasi

### Phase 1: Foundation
- Setup monorepo dan tooling
- Setup database local PostgreSQL
- Setup Prisma schema dasar
- Implement auth dan baseline authorization
- Implement homepage dan katalog dasar

### Phase 2: Core Product
- Book detail
- Integrasi Google Books API untuk pencarian dan impor metadata buku ke PostgreSQL
- Review dan rating
- Reading list
- Favorite books
- Dashboard user

### Phase 3: Admin & Analytics
- Admin panel
- Moderation tools
- Dashboard analytics
- Management konten editorial

### Phase 4: Growth
- Recomendation engine
- Social features and community engagement
- Expansion of content and data enrichment

---

## 14. Kesimpulan
BookRate adalah platform digital yang menggabungkan katalog buku, aktivitas membaca, review, dan komunitas pembaca ke dalam satu ekosistem yang intuitif dan scalable. Produk ini dirancang untuk memenuhi kebutuhan pengguna dari level Guest hingga Admin, dengan fokus utama pada discoverability, engagement, dan data-driven reading experience.

Berdasarkan kebutuhan tersebut, arsitektur monorepo dengan Next.js, NestJS REST API, TypeScript, Tailwind, Prisma, PostgreSQL, dan Turborepo merupakan pilihan yang tepat. Struktur ini memungkinkan BookRate berkembang secara modular sambil menjaga kualitas, performa, keamanan, dan maintainability di masa depan.

---

## 15. Ringkasan Implementasi yang Disarankan

### Stack
- Bun
- Turborepo
- Next.js App Router
- NestJS REST API
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide React
- PostgreSQL local
- Prisma
- Passport (NestJS authentication)
- Zod
- React Hook Form
- Recharts

### Prioritas Pengembangan
1. Setup monorepo & database
2. Authentication & RBAC
3. Book catalog & detail
4. Rating & review
5. Reading list & favorite
6. Dashboard user
7. Admin panel
8. Growth & recommendation features

### Strategi Pengembangan
- Gunakan TDD untuk fitur kritis seperti auth, review, dan reading list
- Validasi all input dengan Zod
- Gunakan Prisma schema untuk domain integrity
- Gunakan UI library dengan pattern yang konsisten
- Terapkan paging, search, filter, dan sorting sejak awal agar skalabilitas terjamin

This document is structured to serve as the product blueprint for developers and AI coding agents in creating BookRate in a modular, robust, and production-grade manner.

## 16. Menjalankan PostgreSQL lokal

BookRate menggunakan PostgreSQL lokal untuk development; database cloud bukan pengganti database development. Pastikan PostgreSQL terpasang dan servicenya berjalan. Pada Windows, installer PostgreSQL menyediakan service serta `psql`, biasanya di `C:\Program Files\PostgreSQL\<versi>\bin`.

Buat role dan database development satu kali. Sambungkan ke database bawaan sebagai administrator PostgreSQL:

```powershell
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' -h localhost -U postgres -d postgres
```

Di prompt `psql`, buat role khusus aplikasi, tetapkan password secara interaktif, lalu buat database:

```sql
CREATE ROLE bookrate_dev LOGIN;
\password bookrate_dev
ALTER ROLE bookrate_dev CREATEDB;
CREATE DATABASE bookrate OWNER bookrate_dev;
\q
```

`CREATEDB` diperlukan oleh `prisma migrate dev` untuk membuat shadow database lokal saat memeriksa migrasi. Batasi izin ini pada role development lokal; role production tidak boleh memilikinya. Jika PostgreSQL terpasang di lokasi atau versi lain, sesuaikan path `psql.exe` dan ganti `18` dengan versi yang terpasang. Perintah pembuatan role dan database hanya perlu dijalankan sekali; jika role atau database sudah ada, jangan buat ulang.

Di root repository, salin `.env.example` menjadi `.env`, lalu ganti placeholder password dengan password role lokal:

```powershell
Copy-Item .env.example .env
```

Jangan commit `.env`. File tersebut sudah diabaikan Git; `.env.example` hanya berisi nilai contoh dan tidak boleh diisi dengan password nyata. Jika password mengandung karakter khusus pada URL, lakukan percent-encoding. Gunakan role terbatas `bookrate_dev` untuk aplikasi, bukan role administrator `postgres`.

Verifikasi koneksi dan jalankan query pemeriksaan dari PowerShell setelah URL di `.env` disesuaikan:

```powershell
$env:DATABASE_URL = 'postgresql://bookrate_dev:<password>@localhost:5432/bookrate?schema=public'
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' "$env:DATABASE_URL" -c 'SELECT current_database(), current_user;'
```

Untuk production, gunakan PostgreSQL production yang dikelola dan dikonfigurasi terpisah, dengan secret disimpan di secret manager environment deployment. Jangan menggunakan database development atau menyalin kredensial lokal ke production.

### Prisma di database lokal

Prisma schema dan migrasi berada di `packages/database/prisma`. Prisma Client diekspor dari package `@bookrate/database`; konfigurasi Prisma memuat `DATABASE_URL` dari `.env` di root monorepo.

Jalankan command dari root repository:

```powershell
bun run --filter @bookrate/database db:format
bun run --filter @bookrate/database db:validate
bun run --filter @bookrate/database db:generate
bun run --filter @bookrate/database db:migrate -- --name nama_migrasi
bun run --filter @bookrate/database db:status
```

`db:migrate` digunakan untuk development dan membuat/menerapkan migrasi. Untuk menerapkan migrasi yang sudah ada di deployment, gunakan `bun run --filter @bookrate/database db:deploy`; kredensial production harus berasal dari secret environment deployment, bukan `.env` development.

### Menjalankan REST API

Backend BookRate adalah NestJS API di `apps/api`, bukan API pihak ketiga. Dari
root repository, `bun run dev` menjalankan web dan API; API mendengarkan pada
port `API_PORT` (default `4000`). Endpoint health ada di
`http://localhost:4000/api/v1/health`, dan dokumentasi OpenAPI development ada di
`http://localhost:4000/api/v1/docs`. Web memakai API client dan
`NEXT_PUBLIC_API_URL`; web tidak mengimpor Prisma atau mengakses PostgreSQL.

Google Books API terpisah dari REST API BookRate. Integrasi itu hanya dibutuhkan
untuk pencarian/impor metadata dari Google Books, dan menggunakan
`GOOGLE_BOOKS_API_KEY` opsional pada server. Katalog lokal tetap bekerja tanpa
API key Google.

#### Kontrak autentikasi web/API

Autentikasi dimiliki NestJS API melalui Passport; web tidak menyimpan access atau
refresh token di `localStorage` atau JavaScript. Kontrak implementasi: access
token singkat (15 menit) dan session/refresh token yang dirotasi (7 hari)
disimpan pada cookie `HttpOnly` dan `SameSite=Lax`; access cookie berlaku untuk
`/api/v1`, refresh cookie hanya untuk `/api/v1/auth`. Keduanya memakai flag
`Secure` di HTTPS/production. Endpoint autentikasi tersedia pada
`/api/v1/auth/register`, `/login`, `/refresh`, `/logout`, dan `/session`.
Logout menghapus session dan cookie. Request berkredensial hanya diizinkan dari
`WEB_ORIGIN` yang dikonfigurasi. Semua operasi autentikasi yang mengubah state
memeriksa header `Origin`; cookie `SameSite` bukan satu-satunya perlindungan
CSRF. `AUTH_JWT_SECRET` wajib berisi minimal 32 karakter di production; saat
development, server memakai key acak sementara bila variabel itu belum diisi.

### Seed data development

Jalankan seed idempotent setelah migrasi:

```powershell
bun run --filter @bookrate/database db:seed
```

Seed membuat katalog contoh, pembaca, review, favorit, dan reading list. Beberapa
buku sengaja tidak memiliki review; `Laut Bercerita` memiliki beberapa review
untuk menguji tampilan detail dan agregasi.

Admin development bersifat opsional dan tidak memiliki password bawaan. Untuk
membuatnya, isi kedua variabel berikut hanya di `.env` lokal dengan alamat email
development dan password acak minimal 12 karakter:

```dotenv
SEED_ADMIN_EMAIL=admin@example.invalid
SEED_ADMIN_PASSWORD=<password-development-acak>
```

Seed menyimpan hash scrypt, bukan password teks, menolak berjalan saat
`NODE_ENV=production`, dan tidak mencatat password ke output. `.env` tidak boleh
di-commit.
