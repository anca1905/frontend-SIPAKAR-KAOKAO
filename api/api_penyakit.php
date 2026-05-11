<?php
header('Content-Type: application/json');
include '../config/koneksi.php'; // Sesuaikan path koneksi

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'read') {
    $jenis = isset($_GET['jenis']) ? $_GET['jenis'] : '';
    $sql = "SELECT * FROM penyakit";
    if ($jenis) {
        $sql .= " WHERE jenis = '$jenis'";
    }
    $sql .= " ORDER BY kode_penyakit ASC";
    
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            'kode' => $row['kode_penyakit'],
            'nama' => $row['nama_penyakit'],
            'jenis' => $row['jenis'],
            'solusi' => $row['solusi']
        ];
    }
    echo json_encode($data);
}

if ($action == 'save') {
    $kode = $_POST['kode'];
    $nama = $_POST['nama'];
    $solusi = $_POST['solusi'];
    $jenis = isset($_POST['jenis']) ? $_POST['jenis'] : 'Penyakit';
    $mode = $_POST['mode'];

    if ($mode == 'tambah') {
        $stmt = $conn->prepare("INSERT INTO penyakit (kode_penyakit, nama_penyakit, jenis, solusi) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $kode, $nama, $jenis, $solusi);
    } else {
        $stmt = $conn->prepare("UPDATE penyakit SET nama_penyakit=?, jenis=?, solusi=? WHERE kode_penyakit=?");
        $stmt->bind_param("ssss", $nama, $jenis, $solusi, $kode);
    }

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Data berhasil disimpan']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data']);
    }
}

if ($action == 'delete') {
    $kode = $_POST['kode'];
    $stmt = $conn->prepare("DELETE FROM penyakit WHERE kode_penyakit=?");
    $stmt->bind_param("s", $kode);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error']);
    }
}
