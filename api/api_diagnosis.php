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
// TAHAP 1: AMBIL DATA KASUS LAMA
// ---------------------------------------------------------------------------
$sql_kasus = "SELECT k.kode_kasus, k.nama_kasus, p.kode_penyakit, p.nama_penyakit, p.solusi,
              GROUP_CONCAT(kg.kode_gejala) as gejala_list
              FROM kasus k
              JOIN penyakit p ON k.kode_penyakit = p.kode_penyakit
              LEFT JOIN kasus_gejala kg ON k.kode_kasus = kg.kode_kasus
              GROUP BY k.kode_kasus, k.nama_kasus, p.kode_penyakit, p.nama_penyakit, p.solusi";
$res_kasus = $conn->query($sql_kasus);

$final_ranking = [];

// ---------------------------------------------------------------------------
// TAHAP 2: HITUNG MANHATTAN DISTANCE SESUAI SKRIPSI (TABEL 4.11 - 4.15)
// ---------------------------------------------------------------------------
while ($row = $res_kasus->fetch_assoc()) {
    $k_kode   = $row['kode_kasus'];
    $nama_k   = $row['nama_kasus'];
    $kode_p   = $row['kode_penyakit'];
    $nama_p   = $row['nama_penyakit'];
    $solusi_p = $row['solusi'];

    // Ambil kelompok gejala khusus untuk kasus lama ini (Misal: G01 s/d G05 saja)
    $gejala_kasus = $row['gejala_list'] ? explode(',', $row['gejala_list']) : [];

    if (empty($gejala_kasus)) continue;

    // Nilai N (Jumlah gejala) adalah jumlah gejala pada masing-masing kasus lama (Sesuai Skripsi)
    $jumlah_n_kasus = count($gejala_kasus);

    $distance = 0;

    // Looping hanya fokus pada gejala yang ada di kasus lama (Dihitung per blok kasus)
    foreach ($gejala_kasus as $g) {
        $v_kasus = 1; // Nilainya pasti 1 karena ini adalah gejala milik kasus lama
        $v_user  = in_array($g, $gejala_user) ? 1 : 0; // Cek apakah user mencentangnya

        // Rumus Manhattan Distance (Selisih mutlak)
        $distance += abs($v_kasus - $v_user);
    }

    // Konversi ke persentase kemiripan (Similarity)
    $similarity = $jumlah_n_kasus > 0
        ? max(0, (($jumlah_n_kasus - $distance) / $jumlah_n_kasus) * 100)
        : 0;

    if ($similarity > 0) {
        // Jika ada beberapa kasus untuk penyakit yang sama, simpan persentase yang paling besar
        if (!isset($final_ranking[$kode_p]) || $similarity > $final_ranking[$kode_p]['persen']) {
            $final_ranking[$kode_p] = [
                'nama'      => $nama_p,
                'kasus_ref' => $nama_k,
                'distance'  => $distance,
                'persen'    => round($similarity, 2),
                'solusi'    => $solusi_p
            ];
        }
    }
}

// ---------------------------------------------------------------------------
// TAHAP 3: KESIMPULAN HASIL DIAGNOSIS
// ---------------------------------------------------------------------------
if (empty($final_ranking)) {
    echo json_encode([
        'status' => 'success',
        'hasil' => null,
        'message' => 'Tidak ada kasus yang cocok ditemukan dalam basis kasus.'
    ]);
    exit;
}

// Urutkan dari persentase kemiripan tertinggi
uasort($final_ranking, function ($a, $b) {
    return $b['persen'] <=> $a['persen'];
});

// Ambil penyakit yang berada di urutan pertama (paling mirip)
reset($final_ranking);
$kode_terpilih = key($final_ranking);
$pemenang      = $final_ranking[$kode_terpilih];

// ---------------------------------------------------------------------------
// TAHAP 4: SIMPAN KE RIWAYAT (RETAIN)
// ---------------------------------------------------------------------------
$tgl       = date('Y-m-d');
$hasil_txt = $pemenang['nama'];
$nilai_txt = $pemenang['persen'] . '%';

$stmt = $conn->prepare("INSERT INTO riwayat (tanggal, nama_petani, lokasi, hasil_diagnosis, nilai_cf) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $tgl, $nama_petani, $lokasi, $hasil_txt, $nilai_txt);
$stmt->execute();

// Kirim ke Frontend
echo json_encode([
    'status'             => 'success',
    'penyakit'           => $pemenang['nama'],
    'nilai'              => $pemenang['persen'],
    'distance'           => $pemenang['distance'],
    'solusi'             => $pemenang['solusi'],
    'kasus_referensi'    => $pemenang['kasus_ref'],
    'detail_perhitungan' => array_values($final_ranking)
]);
