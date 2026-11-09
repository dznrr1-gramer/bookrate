# Task 24 — Menjaga agregat rating

**Tujuan:** Menampilkan rata-rata rating dan jumlah review yang akurat.

**Prasyarat:** Task 23.

**Pekerjaan:**
- Tentukan strategi agregasi berdasarkan source of truth Review.
- Perbarui pembacaan rating di katalog/detail saat review dibuat, diedit, atau dihapus.
- Jika menyimpan nilai agregat terdenormalisasi, jaga konsistensi melalui transaksi/strategi yang terdokumentasi.

**Kriteria penerimaan:**
- Agregat sesuai perhitungan rating aktif pada seluruh buku.
- Buku tanpa rating memiliki tampilan yang jelas dan bukan rata-rata palsu.
- Edit/hapus review memperbarui nilai yang terlihat.

**Verifikasi:** Uji nilai awal, create, update, delete, serta beberapa operasi berdekatan terhadap hasil agregat.
