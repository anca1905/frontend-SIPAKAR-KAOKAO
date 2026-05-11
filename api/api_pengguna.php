<?php
header('Content-Type: application/json');
include '../config/koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : 'list';

// Daftar pengguna unik beserta statistik diagnosis
if ($action === 'list') {
    $sql = "SELECT
                nama_petani,
                lokasi,
                COUNT(*) AS jumlah_diagnosis,
                MIN(tanggal) AS pertama_diagnosis,
                MAX(tanggal) AS terakhir_diagnosis,
                GROUP_CONCAT(DISTINCT hasil_diagnosis ORDER BY tanggal DESC SEPARATOR ' | ') AS riwayat_penyakit
            FROM riwayat
            GROUP BY nama_petani, lokasi
            ORDER BY jumlah_diagnosis DESC, terakhir_diagnosis DESC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

// Riwayat detail satu pengguna berdasarkan nama_petani
if ($action === 'detail') {
    $nama = $conn->real_escape_string($_GET['nama'] ?? '');
    $sql  = "SELECT id, tanggal, lokasi, hasil_diagnosis, nilai_cf
             FROM riwayat
             WHERE nama_petani = '$nama'
             ORDER BY tanggal DESC";
    $result = $conn->query($sql);
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode($data);
}

// Hapus satu riwayat diagnosis berdasarkan id
if ($action === 'delete') {
    $id   = intval($_POST['id']);
    $stmt = $conn->prepare("DELETE FROM riwayat WHERE id = ?");
    $stmt->bind_param("i", $id);
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Riwayat berhasil dihapus']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus']);
    }
}

// Statistik ringkas untuk dashboard
if ($action === 'stats') {
    $total_pengguna = $conn->query("SELECT COUNT(DISTINCT nama_petani) as total FROM riwayat")->fetch_assoc()['total'];
    $total_diagnosis = $conn->query("SELECT COUNT(*) as total FROM riwayat")->fetch_assoc()['total'];
    $bulan_ini = $conn->query("SELECT COUNT(*) as total FROM riwayat WHERE MONTH(tanggal)=MONTH(CURDATE()) AND YEAR(tanggal)=YEAR(CURDATE())")->fetch_assoc()['total'];
    echo json_encode([
        'total_pengguna'  => $total_pengguna,
        'total_diagnosis' => $total_diagnosis,
        'bulan_ini'       => $bulan_ini
    ]);
}
?>
