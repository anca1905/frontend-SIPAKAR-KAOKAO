import os

def replace_in_file(filepath, replacements):
    if not os.path.exists(filepath):
        return
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

# 1. index.html replacements
index_replacements = [
    ("Smart Cocoa Expert System - AI Diagnosis & Case-Based Reasoning", "SIPAKAR KAOKAO - Sistem Deteksi Penyakit Kakao"),
    ("AI CBR Engine v2.0", "Metode Case-Based Reasoning"),
    ("Smart Agriculture", "Pertanian Kakao Toari"),
    ("Smart Cocoa", "Deteksi Penyakit Kakao"),
    ("Expert System", "Lebih Mudah & Cepat"),
    ("Sistem pakar kesehatan tanaman kakao berbasis web menggunakan kecerdasan buatan (Artificial Intelligence) dengan **Metode Case-Based Reasoning** dan **Algoritma Manhattan Distance**. Mendiagnosis penyakit & hama tanaman kakao secara instan demi ketahanan perkebunan Anda di Kecamatan Toari.", "Aplikasi ini dibuat untuk membantu petani kakao di Kecamatan Toari mengenali penyakit dan hama pada tanamannya. Cukup pilih gejala yang terlihat di kebun, dan sistem akan mencocokkannya dengan basis data kasus kami."),
    ("Mulai Diagnosis Mandiri", "Mulai Cek Kebun Sekarang"),
    ("4.9 ★ BPP Toari Verified", "Telah diuji bersama BPP Kec. Toari"),
    ("Membantu 250+ Kelompok Tani Kakao", "Dibuat khusus untuk petani lokal"),
    ("Layanan &amp; Fitur Unggulan", "Fitur Aplikasi"),
    ("Ekosistem pintar pertanian kakao yang menggabungkan basis kasus (Case-Based Reasoning) dengan teknologi analisis agronomi digital secara real-time.", "Aplikasi sederhana ini menyediakan beberapa fitur untuk memudahkan Anda merawat dan memantau kebun kakao."),
    ("Diagnosis AI-CBR", "Cek Penyakit Otomatis"),
    ("Membandingkan gejala yang Anda pilih dengan puluhan basis kasus historis menggunakan kalkulasi selisih mutlak Manhattan Distance secara presisi.", "Mencocokkan gejala di kebun Anda dengan data kasus penyakit sebelumnya untuk mengetahui penyakit apa yang sedang menyerang."),
    ("Deteksi Hama &amp; Penyakit", "Info Hama &amp; Penyakit"),
    ("Mengidentifikasi penyakit utama kakao seperti Busuk Buah (Phytophthora), Kanker Batang, VSD, hingga Hama Penggerek Buah Kakao (PBK).", "Menyediakan informasi terkait penyakit umum di Toari seperti Busuk Buah, Kanker Batang, VSD, dan Penggerek Buah (PBK)."),
    ("Edukasi &amp; Penanganan", "Panduan Perawatan"),
    ("Dilengkapi dengan panduan solusi praktis, mulai dari teknik sanitasi kebun, pemangkasan teratur, hingga teknik penyelubungan buah (sarungisasi).", "Memberikan langkah-langkah penanganan yang mudah diikuti, seperti sanitasi, pemangkasan, dan teknik pembungkusan buah."),
    ("Riwayat &amp; Sebaran Kasus", "Data Riwayat Pengecekan"),
    ("Mendokumentasikan data diagnosis sebaran penyakit petani di Kecamatan Toari untuk deteksi dini epidemi dan pencegahan perluasan hama.", "Mencatat riwayat pengecekan dari petani lain, sehingga kita bisa memantau hama apa yang sedang ramai di daerah Toari."),
    ("Konsultasi &amp; Diagnosis Kakao AI", "Form Pengecekan Gejala"),
    ("Gunakan panel diagnosis berbasis AI di bawah ini untuk mengidentifikasi hama &amp; penyakit kakao Anda secara instan.", "Pilih gejala-gejala yang sedang terjadi pada pohon atau buah kakao Anda di bawah ini."),
    ("Sistem Konsultasi Pakar AI", "Form Data Gejala Tanaman"),
    ("CONNECTED", "Sistem Siap"),
    ("Ketik kata kunci gejala (contoh: bercak, membusuk, daun menguning, ulat)...", "Cari gejala (misal: daun kuning, bercak)..."),
    ("Mulai Hitung Similarity Manhattan", "Lihat Hasil Diagnosis"),
    ("Hitung Similarity Manhattan", "Lihat Hasil Diagnosis"),
    ("Laporan Hasil Diagnosis Sistem Pakar", "Hasil Pengecekan Penyakit"),
    ("Metode Analisis", "Metode Hitung"),
    ("Gejala Teridentifikasi (Input)", "Gejala yang Anda Alami"),
    ("Hasil Analisis Komparasi Kasus (Similarity)", "Tingkat Kemiripan dengan Penyakit Lain"),
    ("Kalkulasi Kedekatan Kasus (Manhattan Distance)", "Cara Menghitung (Manhattan Distance)"),
    ("Sistem mengonversi gejala yang dialami kebun Anda ($Y$) dan membandingkannya dengan rekam kasus klinis dalam database ($X$). Selisih mutlak status kehadiran gejala $|x_i - y_i|$ dijumlahkan sebagai Jarak Manhattan. Nilai kemiripan (Similarity) berbanding terbalik dengan Jarak Manhattan—semakin sedikit perbedaan gejala, semakin tinggi persentase kecocokan.", "Sebagai bagian dari tugas akhir, sistem ini menggunakan metode Manhattan Distance. Sistem menghitung perbedaan jumlah gejala yang Anda pilih dengan pola penyakit di database. Semakin sedikit perbedaannya, semakin tinggi persentase kemiripannya."),
    ("Kesimpulan Hasil Akhir", "Kesimpulan Diagnosis"),
    ("Berdasarkan data basis kasus terdaftar, tanaman kakao Anda diidentifikasi memiliki persentase kecocokan tertinggi dengan hama/penyakit di atas.", "Dari hasil pencocokan sistem, tanaman kakao Anda paling besar kemungkinannya terserang hama/penyakit di atas."),
    ("Solusi Pengendalian Rekomendasi Pakar", "Saran Penanganan untuk Petani"),
    ("Cetak Laporan Hasil", "Cetak Hasil"),
    ("Diagnosis Ulang", "Cek Ulang"),
    ("Smart Cocoa Expert System", "SIPAKAR KAOKAO"),
]
replace_in_file(r"c:\laragon\www\gea\index.html", index_replacements)

# 2. edukasi.html replacements
edukasi_replacements = [
    ("Pustaka Edukasi Hama &amp; Penyakit Kakao - SIPAKAR-KAOKAO", "Artikel Edukasi Kakao - SIPAKAR KAOKAO"),
    ("Pustaka Edukasi Agronomi", "Artikel & Panduan Perawatan"),
    ("Pustaka Pencegahan", "Tips Perawatan"),
    ("Penanganan Kakao", "Pencegahan Hama"),
    ("Daftar literatur penanganan taktis yang direkomendasikan pakar pertanian untuk mencegah penyebaran hama penggerek, mengebalkan pohon, dan mengobati penyakit jamur busuk buah kakao.", "Kumpulan panduan singkat untuk membantu petani mencegah penyebaran hama penggerek dan mengobati penyakit busuk buah di kebun kakao Anda."),
    ("Baca Protokol Medis", "Baca Panduan Lengkap"),
    ("Protokol Pengendalian &amp; Penanganan Pakar", "Langkah Penanganan yang Disarankan"),
    ("Smart Cocoa Expert System", "SIPAKAR KAOKAO"),
]
replace_in_file(r"c:\laragon\www\gea\edukasi.html", edukasi_replacements)

# 3. riwayat.html replacements
riwayat_replacements = [
    ("Penyebaran &amp; Riwayat Diagnosis Kakao - SIPAKAR-KAOKAO", "Riwayat Pengecekan Petani - SIPAKAR KAOKAO"),
    ("Database Riwayat Diagnosis", "Data Riwayat Pengecekan"),
    ("Sebaran Klinis &amp;", "Data Riwayat &amp;"),
    ("Riwayat Petani", "Sebaran Penyakit"),
    ("Pantau log laporan kasus hama penyakit kakao milik warga tani setempat di Kecamatan Toari untuk mengantisipasi potensi penyebaran epidemi di area perkebunan Anda.", "Lihat daftar riwayat pengecekan dari petani-petani lain di Kecamatan Toari untuk memantau penyakit apa yang sedang sering muncul belakangan ini."),
    ("Klasifikasi Penyakit", "Pilih Jenis Penyakit"),
    ("Diagnosis Hasil Sistem Pakar", "Hasil Pengecekan"),
    ("Diagnosis Sistem Pakar", "Hasil Pengecekan"),
    ("Tingkat Similarity", "Persentase"),
    ("Menghubungkan ke basis riwayat sistem pakar...", "Mengambil data riwayat dari database..."),
    ("Smart Cocoa Expert System", "SIPAKAR KAOKAO"),
]
replace_in_file(r"c:\laragon\www\gea\riwayat.html", riwayat_replacements)

# 4. auth.html replacements
auth_replacements = [
    ("Sistem CBR Kakao - Secure Mainframe Portal", "Login Admin - SIPAKAR KAOKAO"),
    ("Secure Login", "Login Admin"),
    ("Sistem Pakar Kakao", "Halaman Khusus Penyuluh/Admin"),
    ("Operator Register", "Daftar Admin Baru"),
    ("Pendaftaran Akun Operator", "Buat Akun untuk Penyuluh BPP"),
    ("Nama Lengkap Operator", "Nama Lengkap"),
    ("Otentikasi", "Masuk"),
    ("Buat Akses", "Daftar"),
]
replace_in_file(r"c:\laragon\www\gea\auth.html", auth_replacements)

# 5. script_landing.js replacements
js_replacements = [
    ("SEDANG MENGEVALUASI BASIS KASUS MAINFRAME...", "MENGHITUNG KECOCOKAN GEJALA..."),
    ("Memuat basis gejala kakao dari sistem...", "Mengambil daftar gejala dari database..."),
    ("Hitung Similarity Manhattan", "Lihat Hasil Diagnosis"),
    ("Mulai Hitung Similarity Manhattan", "Lihat Hasil Diagnosis"),
]
replace_in_file(r"c:\laragon\www\gea\script_landing.js", js_replacements)

print("Humanized text updates completed.")
