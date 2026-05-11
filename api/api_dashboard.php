<?php
header('Content-Type: application/json');
include '../config/koneksi.php';

$res_gejala   = $conn->query("SELECT COUNT(*) as j FROM gejala")->fetch_assoc();
$res_penyakit = $conn->query("SELECT COUNT(*) as p FROM penyakit WHERE jenis = 'Penyakit'")->fetch_assoc();
$res_hama     = $conn->query("SELECT COUNT(*) as h FROM penyakit WHERE jenis = 'Hama'")->fetch_assoc();
$res_kasus    = $conn->query("SELECT COUNT(*) as k FROM kasus")->fetch_assoc();
$res_riwayat  = $conn->query("SELECT COUNT(*) as r FROM riwayat WHERE MONTH(tanggal) = MONTH(CURRENT_DATE()) AND YEAR(tanggal) = YEAR(CURRENT_DATE())")->fetch_assoc();

echo json_encode([
    'total_gejala'           => $res_gejala['j'],
    'total_penyakit'         => $res_penyakit['p'],
    'total_hama'             => $res_hama['h'],
    'total_kasus'            => $res_kasus['k'],
    'total_riwayat_bulan_ini'=> $res_riwayat['r']
]);
?>
