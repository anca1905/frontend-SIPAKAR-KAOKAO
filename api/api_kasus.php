<?php
header('Content-Type: application/json');
include '../config/koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// --- FUNGSI BACA DATA ---
if ($action == 'read') {
    $sql = "SELECT k.kode_kasus, k.nama_kasus, k.tanggal_input, p.nama_penyakit, p.kode_penyakit,
            GROUP_CONCAT(kg.kode_gejala ORDER BY kg.kode_gejala ASC SEPARATOR ', ') AS gejala_list,
            COUNT(kg.kode_gejala) AS jumlah_gejala
            FROM kasus k
            JOIN penyakit p ON k.kode_penyakit = p.kode_penyakit
            LEFT JOIN kasus_gejala kg ON k.kode_kasus = kg.kode_kasus
            GROUP BY k.kode_kasus
            ORDER BY k.kode_kasus ASC";

    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

// --- FUNGSI SIMPAN/EDIT DATA ---
if ($action == 'save') {
    $mode = $_POST['mode'];
    $kode_kasus = $conn->real_escape_string($_POST['kode_kasus']);
    $nama_kasus = $conn->real_escape_string($_POST['nama_kasus']);
    $penyakit = $conn->real_escape_string($_POST['penyakit']);
    $gejala_arr = json_decode($_POST['gejala'], true); // Terima array dari checkbox
    $tgl = date('Y-m-d');

    if ($mode == 'tambah') {
        // Cek kode duplikat
        $stmt_cek = $conn->prepare("SELECT kode_kasus FROM kasus WHERE kode_kasus=?");
        $stmt_cek->bind_param("s", $kode_kasus);
        $stmt_cek->execute();
        $cek = $stmt_cek->get_result();
        if ($cek->num_rows > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Kode Kasus sudah digunakan!']);
            exit;
        }
        $stmt = $conn->prepare("INSERT INTO kasus (kode_kasus, nama_kasus, kode_penyakit, tanggal_input) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $kode_kasus, $nama_kasus, $penyakit, $tgl);
        $stmt->execute();
    } else {
        $stmt = $conn->prepare("UPDATE kasus SET nama_kasus=?, kode_penyakit=? WHERE kode_kasus=?");
        $stmt->bind_param("sss", $nama_kasus, $penyakit, $kode_kasus);
        $stmt->execute();

        // Hapus relasi gejala lama untuk diganti yang baru (update checkbox)
        $stmt_del = $conn->prepare("DELETE FROM kasus_gejala WHERE kode_kasus=?");
        $stmt_del->bind_param("s", $kode_kasus);
        $stmt_del->execute();
    }

    // Insert gejala-gejala yang dicentang
    if (!empty($gejala_arr)) {
        $stmt_g = $conn->prepare("INSERT INTO kasus_gejala (kode_kasus, kode_gejala) VALUES (?, ?)");
        foreach ($gejala_arr as $g) {
            $stmt_g->bind_param("ss", $kode_kasus, $g);
            $stmt_g->execute();
        }
    }

    echo json_encode(['status' => 'success', 'message' => 'Data Kasus berhasil disimpan']);
}

// --- FUNGSI HAPUS ---
if ($action == 'delete') {
    $kode = $_POST['kode_kasus'];
    $stmt = $conn->prepare("DELETE FROM kasus WHERE kode_kasus=?");
    $stmt->bind_param("s", $kode);
    $stmt->execute();
    echo json_encode(['status' => 'success']);
}
