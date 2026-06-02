<?php
/**
 * api_statistik_landing.php
 * Mengembalikan statistik dinamis untuk ditampilkan di stats strip landing page.
 *
 * Response JSON:
 *  - petani_terbantu   : jumlah petani unik yang pernah melakukan diagnosis (dari tabel riwayat)
 *  - jenis_penyakit    : total penyakit + hama yang ada di tabel penyakit
 *  - kasus_diagnosis   : total keseluruhan diagnosis yang tersimpan di tabel riwayat
 *  - tingkat_akurasi   : persentase diagnosis dengan nilai_cf >= 70% (dibulatkan)
 *  - kasus_tersimpan   : total kasus referensi CBR (tabel kasus)
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include '../config/koneksi.php';

// 1. Petani terbantu → petani unik berdasarkan nama_petani di riwayat
$res_petani = $conn->query("SELECT COUNT(DISTINCT nama_petani) as total FROM riwayat");
$petani     = $res_petani ? (int)$res_petani->fetch_assoc()['total'] : 0;

// 2. Jenis penyakit/hama → semua record di tabel penyakit
$res_penyakit = $conn->query("SELECT COUNT(*) as total FROM penyakit");
$jenis        = $res_penyakit ? (int)$res_penyakit->fetch_assoc()['total'] : 0;

// 3. Total kasus diagnosis → semua record di tabel riwayat
$res_kasus  = $conn->query("SELECT COUNT(*) as total FROM riwayat");
$kasus      = $res_kasus ? (int)$res_kasus->fetch_assoc()['total'] : 0;

// 4. Tingkat akurasi → % baris riwayat yang nilai_cf >= 70 (abaikan simbol %)
//    nilai_cf disimpan sebagai string "70%", "80%", dll.
$res_akurasi = $conn->query("
    SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN CAST(REPLACE(nilai_cf, '%', '') AS UNSIGNED) >= 70 THEN 1 ELSE 0 END) as akurat
    FROM riwayat
");
$akurasi_row = $res_akurasi ? $res_akurasi->fetch_assoc() : ['total' => 0, 'akurat' => 0];
$akurasi     = ($akurasi_row['total'] > 0)
    ? (int)round(($akurasi_row['akurat'] / $akurasi_row['total']) * 100)
    : 95; // Nilai default fallback jika belum ada data

// 5. Kasus tersimpan CBR → tabel kasus (basis pengetahuan)
$res_cbr    = $conn->query("SELECT COUNT(*) as total FROM kasus");
$kasus_cbr  = $res_cbr ? (int)$res_cbr->fetch_assoc()['total'] : 0;

echo json_encode([
    'petani_terbantu'  => $petani,
    'jenis_penyakit'   => $jenis,
    'kasus_diagnosis'  => $kasus,
    'tingkat_akurasi'  => $akurasi,
    'kasus_tersimpan'  => $kasus_cbr,
    'status'           => 'ok'
]);

$conn->close();
?>
