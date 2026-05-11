<?php
header('Content-Type: application/json');
include '../config/koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($action == 'read') {
    $sql = "SELECT a.id, p.nama_penyakit, p.kode_penyakit, g.nama_gejala, g.kode_gejala 
            FROM aturan a
            JOIN penyakit p ON a.kode_penyakit = p.kode_penyakit
            JOIN gejala g ON a.kode_gejala = g.kode_gejala
            ORDER BY p.kode_penyakit ASC";

    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

// Baca dikelompokkan per penyakit (untuk tampilan tabel basis kasus)
if ($action == 'read_grouped') {
    $sql = "SELECT p.kode_penyakit, p.nama_penyakit,
                GROUP_CONCAT(g.kode_gejala ORDER BY g.kode_gejala ASC SEPARATOR ',') AS kode_gejala_list,
                COUNT(a.id) AS jumlah_gejala
            FROM aturan a
            JOIN penyakit p ON a.kode_penyakit = p.kode_penyakit
            JOIN gejala g ON a.kode_gejala = g.kode_gejala
            GROUP BY p.kode_penyakit, p.nama_penyakit
            ORDER BY p.kode_penyakit ASC";

    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

if ($action == 'save') {
    $penyakit = $conn->real_escape_string($_POST['penyakit']);
    $gejala   = $conn->real_escape_string($_POST['gejala']);
    $bobot    = isset($_POST['bobot']) ? floatval($_POST['bobot']) : 1;

    if ($bobot < 1 || $bobot > 5) {
        echo json_encode(['status' => 'error', 'message' => 'Bobot harus antara 1 sampai 5']);
        exit;
    }

    // Cek duplikasi
    $stmt_cek = $conn->prepare("SELECT id FROM aturan WHERE kode_penyakit=? AND kode_gejala=?");
    $stmt_cek->bind_param("ss", $penyakit, $gejala);
    $stmt_cek->execute();
    $cek = $stmt_cek->get_result();

    if ($cek->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Gejala ini sudah ada pada penyakit tersebut.']);
    } else {
        $stmt = $conn->prepare("INSERT INTO aturan (kode_penyakit, kode_gejala, bobot) VALUES (?, ?, ?)");
        $stmt->bind_param("ssd", $penyakit, $gejala, $bobot);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Aturan berhasil disimpan']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan']);
        }
    }
}

if ($action == 'delete') {
    $id = intval($_POST['id']);
    $stmt = $conn->prepare("DELETE FROM aturan WHERE id=?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    echo json_encode(['status' => 'success']);
}

// Hapus semua aturan berdasarkan kode_penyakit
if ($action == 'delete_by_penyakit') {
    $kode = $conn->real_escape_string($_POST['kode_penyakit']);
    $stmt = $conn->prepare("DELETE FROM aturan WHERE kode_penyakit=?");
    $stmt->bind_param("s", $kode);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus']);
    }
}
