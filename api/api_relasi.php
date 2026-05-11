<?php
header('Content-Type: application/json');
include '../config/koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// READ - ambil semua relasi dengan join
if ($action == 'read') {
    $sql = "SELECT a.id, g.nama_gejala, g.kode_gejala, p.nama_penyakit, p.kode_penyakit, a.bobot
            FROM aturan a
            JOIN penyakit p ON a.kode_penyakit = p.kode_penyakit
            JOIN gejala g ON a.kode_gejala = g.kode_gejala
            ORDER BY p.kode_penyakit ASC, g.kode_gejala ASC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

// SAVE (tambah atau edit)
if ($action == 'save') {
    $id    = isset($_POST['id']) ? $_POST['id'] : '';
    $gejala  = $conn->real_escape_string($_POST['gejala']);
    $penyakit = $conn->real_escape_string($_POST['penyakit']);
    $bobot   = floatval($_POST['bobot']);

    if ($bobot < 1 || $bobot > 5) {
        echo json_encode(['status' => 'error', 'message' => 'Bobot harus antara 1 sampai 5']);
        exit;
    }

    if ($id !== '') {
        // MODE EDIT
        $stmt = $conn->prepare("UPDATE aturan SET kode_gejala=?, kode_penyakit=?, bobot=? WHERE id=?");
        $stmt->bind_param("ssdi", $gejala, $penyakit, $bobot, $id);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Relasi berhasil diperbarui']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui relasi']);
        }
    } else {
        // MODE TAMBAH - cek duplikasi
        $stmt_cek = $conn->prepare("SELECT id FROM aturan WHERE kode_penyakit=? AND kode_gejala=?");
        $stmt_cek->bind_param("ss", $penyakit, $gejala);
        $stmt_cek->execute();
        $cek = $stmt_cek->get_result();
        
        if ($cek->num_rows > 0) {
            echo json_encode(['status' => 'error', 'message' => 'Relasi gejala-penyakit ini sudah ada!']);
        } else {
            $stmt = $conn->prepare("INSERT INTO aturan (kode_gejala, kode_penyakit, bobot) VALUES (?, ?, ?)");
            $stmt->bind_param("ssd", $gejala, $penyakit, $bobot);
            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Relasi berhasil disimpan']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan relasi']);
            }
        }
    }
}

// DELETE
if ($action == 'delete') {
    $id = intval($_POST['id']);
    $stmt = $conn->prepare("DELETE FROM aturan WHERE id=?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus']);
    }
}
