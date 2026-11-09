# Task 01 — Validasi kebutuhan MVP

**Tujuan:** Mengubah PRD BookRate menjadi scope MVP yang jelas sebelum implementasi.

**Prasyarat:** Tidak ada.

**Pekerjaan:**
- Baca `README.md`, petakan fitur MVP, user stories, role, dan alur pengguna.
- Tandai keputusan yang belum ditetapkan, termasuk definisi popularitas, rekomendasi, serta privasi profil.
- Bedakan kebutuhan MVP dari enhancement fase berikutnya; jangan menambah fitur tanpa persetujuan.

**Kriteria penerimaan:**
- Setiap fitur MVP memiliki user story dan kriteria penerimaan yang bisa diuji.
- Guest, User, dan Admin memiliki batas akses yang konsisten dengan PRD.
- Ambiguitas penting dicatat sebagai keputusan terbuka, bukan diasumsikan diam-diam.

**Verifikasi:** Tinjau cakupan terhadap bagian 2, 5, 6, 11, dan 12 PRD; minta konfirmasi untuk keputusan produk yang berdampak besar.

**Workflow:** Gunakan Superpowers brainstorming bila tersedia; selain itu lakukan review kebutuhan terstruktur.

## Hasil validasi kebutuhan

### Cakupan MVP

| Fitur MVP | User story | Kriteria penerimaan yang dapat diuji |
|---|---|---|
| Homepage | Sebagai Guest, saya ingin melihat pintasan discovery dan buku pilihan agar dapat mulai menemukan buku. | Homepage menampilkan pencarian dan bagian buku yang tersedia; setiap kartu buku menampilkan cover, judul, dan rating bila ada; pencarian membuka hasil katalog; layout tetap dapat digunakan pada viewport mobile dan desktop. Bagian rekomendasi tidak ditampilkan dalam MVP; bagian buku populer mengikuti aturan popularitas di bawah. |
| Autentikasi dan RBAC | Sebagai pengunjung, saya ingin mendaftar atau login agar dapat menggunakan fitur personal; sebagai Admin, saya ingin mengakses operasi admin yang dibatasi. | Guest dapat mendaftar, login, dan logout; kredensial tidak disimpan sebagai plaintext; request tanpa autentikasi tidak dapat membaca atau mengubah data personal; User tidak dapat menjalankan operasi Admin; endpoint Admin menolak selain Admin; sesi yang kedaluwarsa tidak memberi akses. |
| Katalog buku | Sebagai Guest, saya ingin mencari, memfilter, mengurutkan, dan menelusuri buku agar menemukan buku yang relevan. | Hasil dapat dicari menurut judul, penulis, atau ISBN; filter kategori/genre dan minimum rating dapat dikombinasikan; hasil dapat dipaginasi; buku populer diurutkan berdasarkan jumlah review menurun, lalu rating rata-rata menurun, lalu tanggal penambahan terbaru. |
| Impor metadata buku | Sebagai pengguna katalog, saya ingin mencari buku dari Google Books dan memilih metadata untuk disimpan agar buku tersebut tersedia di BookRate. | Hasil eksternal tidak otomatis dianggap sebagai buku lokal; hanya buku yang dipilih yang disimpan ke PostgreSQL; data tersimpan dapat ditemukan di katalog dan halaman detail; impor mencegah duplikasi berdasarkan ISBN ternormalisasi, atau ID volume Google Books bila ISBN tidak tersedia. |
| Detail buku | Sebagai Guest, saya ingin melihat informasi buku dan review publik agar dapat menilai kecocokan buku. | Halaman detail menampilkan metadata yang tersedia, rating agregat, jumlah review, dan review publik; tautan ke buku terkait hanya ditampilkan jika ada data yang memenuhi aturan terkait. |
| Rating dan review | Sebagai User, saya ingin memberi atau mengubah rating dan review agar dapat berbagi pengalaman membaca. | Rating hanya bernilai 1–5; teks review boleh kosong sehingga rating saja dapat disimpan; satu User memiliki paling banyak satu entri per buku; User dapat mengedit atau menghapus entri miliknya, tetapi tidak milik orang lain; rating agregat dan jumlah review sesuai dengan entri yang tersimpan; User dapat menyukai review User lain paling banyak satu kali dan dapat membatalkan like. |
| Reading list | Sebagai User, saya ingin menyimpan buku dengan status membaca agar dapat mengelola progres saya. | User dapat menambah, mengubah status ke `WANT_TO_READ`, `CURRENTLY_READING`, atau `READ`, menghapus, dan memfilter daftarnya; data satu User tidak terlihat atau dapat diubah oleh User lain. |
| Favorit | Sebagai User, saya ingin menandai buku favorit agar dapat menemukannya kembali. | User dapat menambah/menghapus favorit; pasangan User-buku tidak terduplikasi; daftar hanya menampilkan favorit milik User tersebut. |
| Dashboard User | Sebagai User, saya ingin melihat ringkasan aktivitas membaca saya agar dapat memantau aktivitas pribadi. | Dashboard hanya menampilkan data User yang sedang login; jumlah buku dibaca, review, reading list, favorit terbaru, statistik, dan review terbaru dihitung dari data milik User tersebut; keadaan kosong ditangani tanpa menampilkan data pengguna lain. Definisi statistik tambahan mengikuti keputusan privasi. |
| Admin basic management | Sebagai Admin, saya ingin mengelola konten inti dan moderasi agar katalog serta komunitas tetap terjaga. | Hanya Admin dapat melakukan tindakan yang disepakati untuk buku, kategori/genre, akun, review, dan konten homepage; Admin dapat melihat akun dan menonaktifkan/mengaktifkan akun, tetapi tidak menghapusnya; perubahan tersimpan dan terlihat pada tampilan publik terkait. |

### Hak akses yang dipetakan

- **Guest:** melihat homepage, mencari/memfilter katalog, melihat detail, rating/review publik, dan profil publik termasuk daftar bacaan, favorit, dan aktivitas membaca. Tidak dapat membaca atau mengubah data personal yang tidak ditetapkan publik.
- **User:** semua akses publik serta mengelola profil dan data miliknya (review, reading list, favorit, dashboard); hanya dapat mengubah atau menghapus review miliknya sendiri.
- **Admin:** endpoint operasional dan moderasi yang disetujui. Hak Admin tidak diberikan hanya dengan menyembunyikan atau menampilkan kontrol di frontend; API harus menegakkannya.

### Alur MVP

1. **Discovery:** homepage → pencarian/filter katalog → detail buku → membaca informasi dan review.
2. **Akun:** register/login → sesi aktif → dashboard; logout atau sesi kedaluwarsa menghilangkan akses personal.
3. **Kontribusi:** User di detail buku → membuat/mengedit/menghapus satu review → detail menampilkan review dan agregat terbaru.
4. **Pengelolaan bacaan:** User di detail buku → menambah/mengubah/menghapus status reading list atau favorit → daftar/dashboard milik User diperbarui.
5. **Impor:** pencarian Google Books → memilih hasil → metadata disimpan lokal → buku tersedia di katalog/detail.
6. **Operasi Admin:** Admin mengelola konten yang disetujui melalui API terlindungi → perubahan terlihat pada permukaan publik yang relevan.

### Batas MVP dan keputusan terbuka

- Fitur Phase 2/3 yang disebut PRD (rekomendasi AI/collaborative filtering, follow, community feed, notifikasi, analitik admin lanjutan, aplikasi mobile, book club, challenge/streak, marketplace, dan impor dataset massal) tidak masuk MVP.
- PRD sekaligus menyebut rekomendasi di homepage, rekomendasi buku terkait, dan integrasi like review pada bagian MVP, sementara beberapa di antaranya tidak ditetapkan tegas dalam daftar MVP. Jangan membangun perilaku tambahan sebelum keputusan berikut dikonfirmasi.
- **Popularitas (diputuskan):** jumlah review menurun, tie-break rating rata-rata menurun, lalu buku terbaru; tidak memakai window waktu.
- **Rekomendasi (diputuskan):** tidak ada rekomendasi pada MVP; rekomendasi AI/personal tetap Phase 2. Bagian homepage yang disebut “Popular” adalah daftar populer, bukan rekomendasi.
- **Privasi profil (diputuskan):** profil publik menampilkan daftar bacaan, favorit, dan aktivitas membaca kepada Guest; fitur pengaturan visibilitas per bagian tidak termasuk cakupan yang disetujui saat ini.
- **Like review (diputuskan):** termasuk MVP; satu like per User per review, dapat dibatalkan.
- **Batas operasi Admin (diputuskan):** Admin dapat melihat dan menonaktifkan/mengaktifkan akun; penghapusan akun tidak termasuk. CRUD buku, kategori/genre, moderasi review, dan pengelolaan konten homepage termasuk sesuai PRD.
- **Aturan tambahan (diputuskan):** teks review opsional, rating tanpa teks diizinkan. Impor menghindari duplikasi memakai ISBN ternormalisasi jika tersedia, selain itu ID volume Google Books; kriteria field metadata minimum tetap mengikuti validasi yang ditetapkan implementasi dan schema.

Task ini telah memetakan fitur, story, kriteria, role, dan alur berdasarkan PRD serta mencatat keputusan produk yang dikonfirmasi. Verifikasi terakhir: semua fitur pada daftar MVP PRD dipetakan; scope Phase 2/3 tidak dimasukkan; batas Guest/User/Admin konsisten dan dapat diuji pada API.
