<?php
header('Content-Type: application/json');
include '../config/koneksi.php';

// Ambil semua data riwayat diurutkan dari yang terbaru
$sql = "SELECT * FROM riwayat ORDER BY id DESC";
$result = $conn->query($sql);

$data = [];
while($row = $result->fetch_assoc()) {
    $data[] = [
        'tgl' => $row['tanggal'],
        'nama' => $row['nama_petani'],
        'lokasi' => $row['lokasi'],
        'hasil' => $row['hasil_diagnosis'],
        'nilai' => $row['nilai_cf']
    ];
}

echo json_encode($data);
?>