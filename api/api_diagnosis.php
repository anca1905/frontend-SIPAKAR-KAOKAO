<?php
header('Content-Type: application/json');
include '../config/koneksi.php';

// Terima Data dari Frontend
$input       = json_decode(file_get_contents('php://input'), true);
$gejala_user = isset($input['gejala']) ? $input['gejala'] : [];
$nama_petani = isset($input['nama']) ? $input['nama'] : '';
$lokasi      = isset($input['lokasi']) ? $input['lokasi'] : '';

if (empty($gejala_user)) {
    echo json_encode(['status' => 'error', 'message' => 'Tidak ada gejala dipilih']);
    exit;
}

// ---------------------------------------------------------------------------
// TAHAP 1: Total fitur gejala untuk normalisasi
// ---------------------------------------------------------------------------
$total_fitur = $conn->query("SELECT COUNT(*) as total FROM gejala")->fetch_assoc()['total'];

// ---------------------------------------------------------------------------
// TAHAP 2: Hitung Manhattan Distance per Kasus
// ---------------------------------------------------------------------------
$sql_kasus = "SELECT k.kode_kasus, k.nama_kasus, p.kode_penyakit, p.nama_penyakit, p.solusi,
              GROUP_CONCAT(kg.kode_gejala) as gejala_list
              FROM kasus k
              JOIN penyakit p ON k.kode_penyakit = p.kode_penyakit
              LEFT JOIN kasus_gejala kg ON k.kode_kasus = kg.kode_kasus
              GROUP BY k.kode_kasus, k.nama_kasus, p.kode_penyakit, p.nama_penyakit, p.solusi";
$res_kasus = $conn->query($sql_kasus);

$final_ranking = [];

while ($row = $res_kasus->fetch_assoc()) {
    $k_kode   = $row['kode_kasus'];
    $nama_k   = $row['nama_kasus'];
    $kode_p   = $row['kode_penyakit'];
    $nama_p   = $row['nama_penyakit'];
    $solusi_p = $row['solusi'];

    // Ambil gejala kasus dari hasil GROUP_CONCAT
    $gejala_kasus = $row['gejala_list'] ? explode(',', $row['gejala_list']) : [];

    if (empty($gejala_kasus)) continue;

    // Hitung Manhattan Distance
    $gabungan = array_unique(array_merge($gejala_kasus, $gejala_user));
    $distance = 0;
    foreach ($gabungan as $g) {
        $v_kasus = in_array($g, $gejala_kasus) ? 1 : 0;
        $v_user  = in_array($g, $gejala_user)  ? 1 : 0;
        $distance += abs($v_kasus - $v_user);
    }

    // Konversi ke similarity persen
    $similarity = $total_fitur > 0
        ? max(0, (($total_fitur - $distance) / $total_fitur) * 100)
        : 0;

    if ($similarity > 0) {
        // Jika kasus dengan penyakit yang sama sudah ada, simpan yang lebih tinggi
        if (!isset($final_ranking[$kode_p]) || $similarity > $final_ranking[$kode_p]['persen']) {
            $final_ranking[$kode_p] = [
                'nama'      => $nama_p,
                'kasus_ref' => $nama_k,
                'persen'    => round($similarity, 2),
                'solusi'    => $solusi_p
            ];
        }
    }
}

// ---------------------------------------------------------------------------
// TAHAP 3: Tidak ada kemiripan
// ---------------------------------------------------------------------------
if (empty($final_ranking)) {
    echo json_encode([
        'status' => 'success',
        'hasil' => null,
        'message' => 'Tidak ada kasus yang cocok ditemukan dalam basis kasus.'
    ]);
    exit;
}

// Urutkan dari similarity tertinggi (Diperbaiki untuk PHP 7.2)
uasort($final_ranking, function ($a, $b) {
    return $b['persen'] <=> $a['persen'];
});

$kode_terpilih = array_key_first($final_ranking);
$pemenang      = $final_ranking[$kode_terpilih];

// ---------------------------------------------------------------------------
// TAHAP 4: Simpan ke riwayat & kirim response
// ---------------------------------------------------------------------------
$tgl       = date('Y-m-d');
$hasil_txt = $pemenang['nama'];
$nilai_txt = $pemenang['persen'] . '%';

$stmt = $conn->prepare("INSERT INTO riwayat (tanggal, nama_petani, lokasi, hasil_diagnosis, nilai_cf) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $tgl, $nama_petani, $lokasi, $hasil_txt, $nilai_txt);
$stmt->execute();

echo json_encode([
    'status'             => 'success',
    'penyakit'           => $pemenang['nama'],
    'nilai'              => $pemenang['persen'],
    'solusi'             => $pemenang['solusi'],
    'kasus_referensi'    => $pemenang['kasus_ref'],
    'detail_perhitungan' => array_values($final_ranking)
]);
