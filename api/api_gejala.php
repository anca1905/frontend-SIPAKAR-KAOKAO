<?php
header('Content-Type: application/json');
include '../config/koneksi.php';
$action = isset($_GET['action']) ? $_GET['action'] : '';
if ($action == 'read') {
    $sql = "SELECT * FROM gejala ORDER BY kode_gejala ASC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = ['kode' => $row['kode_gejala'], 'nama' => $row['nama_gejala']];
    }
    echo json_encode($data);
}
if ($action == 'save') {
    $kode = $_POST['kode'];
    $nama = $_POST['nama'];
    $mode = $_POST['mode'];
    if ($mode == 'tambah') {
        $stmt = $conn->prepare("INSERT INTO gejala (kode_gejala, nama_gejala) VALUES (?, ?)");
        $stmt->bind_param("ss", $kode, $nama);
    } else {
        $stmt = $conn->prepare("UPDATE gejala SET nama_gejala=? WHERE kode_gejala=?");
        $stmt->bind_param("ss", $nama, $kode);
    }
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Data berhasil disimpan']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data']);
    }
}
if ($action == 'delete') {
    $kode = $_POST['kode'];
    $stmt = $conn->prepare("DELETE FROM gejala WHERE kode_gejala=?");
    $stmt->bind_param("s", $kode);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error']);
    }
}
