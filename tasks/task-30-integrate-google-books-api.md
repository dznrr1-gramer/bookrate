# Task 30 — Mengintegrasikan Google Books API

**Tujuan:** Memungkinkan pengguna menemukan buku melalui Google Books API dan mengimpor metadata buku terpilih ke katalog PostgreSQL BookRate.

**Prasyarat:** Task 07, 10–14, 17, 19–20, 23–24, dan 26–27.

**Pekerjaan:**
- Buat service server-side untuk mencari Google Books API; jangan memanggil provider langsung dari browser.
- Tampilkan hasil eksternal secara terpisah dari katalog lokal dan sediakan aksi eksplisit untuk mengimpor buku yang dipilih.
- Petakan metadata provider yang tersedia ke model Book; simpan Google Books volume ID sebagai identifier unik opsional.
- Cegah impor ganda berdasarkan volume ID dan ISBN bila tersedia. Jika buku lokal dengan ISBN yang sama sudah ada, gunakan entri lokal tersebut tanpa menimpa data editorial atau relasi komunitasnya.
- Tangani field yang tidak tersedia, timeout, rate limit, respons invalid, dan kegagalan provider dengan validasi serta status UI yang jelas. Katalog lokal tetap dapat digunakan saat provider gagal.
- Dokumentasikan konfigurasi API key bila digunakan melalui environment variable; jangan mengekspos atau menyimpan secret di repository.

**Kriteria penerimaan:**
- Pengguna dapat mencari buku eksternal, melihat hasil yang relevan, dan mengimpor pilihan ke PostgreSQL.
- Buku impor menjadi entri lokal yang dapat digunakan untuk detail, review, rating, favorit, dan reading list.
- Permintaan impor berulang tidak membuat duplikat dan tidak merusak data atau relasi pada buku lokal yang sudah ada.
- Kegagalan API eksternal tidak menyebabkan katalog lokal gagal dimuat dan ditampilkan kepada pengguna secara jelas.
- Tidak ada credential atau secret yang terekspos di client maupun repository.

**Verifikasi:** Uji pemetaan metadata lengkap/minimal, hasil kosong, error dan rate limit provider, impor sukses, impor berulang, konflik ISBN, serta penggunaan katalog lokal saat provider tidak tersedia.
