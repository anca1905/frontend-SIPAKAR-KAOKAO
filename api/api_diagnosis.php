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


// ===========================================================================
// SIKLUS UTAMA CASE-BASED REASONING (CBR) - PROSES DIAGNOSIS
// ===========================================================================
// Sistem Pakar ini menggunakan metode Case-Based Reasoning (CBR) dengan 4 tahapan utama:
// 1. RETRIEVE: Mengambil kasus-kasus terdahulu yang mirip dari basis pengetahuan.
// 2. REUSE: Menggunakan kembali informasi kasus lama untuk menghitung tingkat kemiripan (Similarity)
//    dengan gejala masukan pengguna menggunakan rumus MANHATTAN DISTANCE.
// 3. REVISE: Mengevaluasi solusi kasus yang paling mirip (dalam sistem ini ditampilkan ke pengguna).
// 4. RETAIN: Menyimpan hasil diagnosis baru ke dalam riwayat sebagai basis kasus baru/pengetahuan baru.
// ===========================================================================

// ---------------------------------------------------------------------------
// TAHAP CBR: PERSIAPAN & NORMALISASI
// ---------------------------------------------------------------------------
// Mengambil total jumlah seluruh gejala yang ada di sistem (basis data).
// Nilai $total_fitur ini digunakan sebagai penyebut/pembagi dalam normalisasi perhitungan similarity.
$total_fitur = $conn->query("SELECT COUNT(*) as total FROM gejala")->fetch_assoc()['total'];

// ---------------------------------------------------------------------------
// TAHAP 1 CBR: RETRIEVE (MENGAMBIL KASUS LAMA)
// ---------------------------------------------------------------------------
// Kita mengambil semua basis kasus (kasus penyakit tanaman kakao terdahulu) dari tabel 'kasus' 
// serta relasi gejalanya ('kasus_gejala') dan solusi penyakitnya.
$sql_kasus = "SELECT k.kode_kasus, k.nama_kasus, p.kode_penyakit, p.nama_penyakit, p.solusi,
              GROUP_CONCAT(kg.kode_gejala) as gejala_list
              FROM kasus k
              JOIN penyakit p ON k.kode_penyakit = p.kode_penyakit
              LEFT JOIN kasus_gejala kg ON k.kode_kasus = kg.kode_kasus
              GROUP BY k.kode_kasus, k.nama_kasus, p.kode_penyakit, p.nama_penyakit, p.solusi";
$res_kasus = $conn->query($sql_kasus);

$final_ranking = [];

// Looping untuk memproses dan mencocokkan setiap kasus lama dengan gejala yang diinput user saat ini.
while ($row = $res_kasus->fetch_assoc()) {
    $k_kode   = $row['kode_kasus'];
    $nama_k   = $row['nama_kasus'];
    $kode_p   = $row['kode_penyakit'];
    $nama_p   = $row['nama_penyakit'];
    $solusi_p = $row['solusi'];

    // Ambil daftar gejala yang dimiliki oleh Kasus Lama ini
    $gejala_kasus = $row['gejala_list'] ? explode(',', $row['gejala_list']) : [];

    if (empty($gejala_kasus)) continue;

    // Cek apakah ada irisan (gejala yang cocok). Jika tidak ada sama sekali, anggap tidak berkaitan dan lewati.
    $irisan = array_intersect($gejala_kasus, $gejala_user);
    if (count($irisan) == 0) continue;

    // -----------------------------------------------------------------------
    // TAHAP 2 CBR: REUSE - PROSES PERHITUNGAN RUMUS KEMIRIPAN (SIMILARITY)
    // -----------------------------------------------------------------------
    // Sesuai permintaan: Perhitungan HANYA mengevaluasi gejala yang dimiliki oleh Kasus Lama ini.
    // Gejala dari penyakit lain yang dipilih user tidak ikut dihitung (tidak menambah penalti jarak).
    
    $distance = 0;
    
    // Hitung MANHATTAN DISTANCE (hanya pada ruang dimensi gejala kasus ini):
    foreach ($gejala_kasus as $g) {
        // v_kasus pasti 1 karena $g diambil dari $gejala_kasus
        $v_kasus = 1;
        $v_user  = in_array($g, $gejala_user) ? 1 : 0;
        $distance += abs($v_kasus - $v_user); // Menambahkan 1 ke jarak jika user tidak memilih gejala ini
    }

    // Konversi Manhattan Distance ke Nilai Similarity (Kemiripan) dalam bentuk Persentase:
    // Pembaginya adalah jumlah gejala pada Kasus Lama ini (bukan total seluruh gejala di sistem).
    $total_fitur_kasus = count($gejala_kasus);
    $similarity = $total_fitur_kasus > 0
        ? max(0, (($total_fitur_kasus - $distance) / $total_fitur_kasus) * 100)
        : 0;


    // 4. RANKING & SELEKSI KASUS TERBAIK
    //    Simpan hasil perhitungan kemiripan ke dalam array ranking.
    //    Gunakan Manhattan Distance (City Block) sebagai ukuran kemiripan:
    //    Semakin KECIL nilai distance, semakin MIRIP kasus tersebut.
    if ($similarity > 0) {
        // Jika kasus dengan penyakit yang sama sudah ada di daftar, simpan hanya yang distance-nya terkecil (paling mirip)
        if (!isset($final_ranking[$kode_p]) || $distance < $final_ranking[$kode_p]['distance']) {
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
// TAHAP 3 CBR: REVISE (EVALUASI HASIL DIAGNOSIS KASUS TERBAIK)
// ---------------------------------------------------------------------------
if (empty($final_ranking)) {
    echo json_encode([
        'status' => 'success',
        'hasil' => null,
        'message' => 'Tidak ada kasus yang cocok ditemukan dalam basis kasus.'
    ]);
    exit;
}

// Urutkan seluruh penyakit dari nilai Manhattan Distance (City Block) terkecil ke terbesar.
// Nilai distance terkecil = paling mirip dengan gejala user.
uasort($final_ranking, function ($a, $b) {
    return $a['distance'] <=> $b['distance'];
});

// Ambil peringkat teratas (penyakit dengan nilai Similarity tertinggi) sebagai hasil akhir diagnosis.
reset($final_ranking);
$kode_terpilih = key($final_ranking);
$pemenang      = $final_ranking[$kode_terpilih];

// ---------------------------------------------------------------------------
// TAHAP 4 CBR: RETAIN (MENYIMPAN KASUS / RIWAYAT BARU)
// ---------------------------------------------------------------------------
// Hasil diagnosis baru beserta identitas petani disimpan ke dalam tabel 'riwayat'.
// Data riwayat ini berfungsi sebagai rekam medis sekaligus dapat di-review oleh admin 
// untuk dimasukkan kembali sebagai kasus baru di masa mendatang guna memperkaya basis kasus.
$tgl       = date('Y-m-d');
$hasil_txt = $pemenang['nama'];
$nilai_txt = 'Jarak: ' . $pemenang['distance'];

$stmt = $conn->prepare("INSERT INTO riwayat (tanggal, nama_petani, lokasi, hasil_diagnosis, nilai_cf) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $tgl, $nama_petani, $lokasi, $hasil_txt, $nilai_txt);
$stmt->execute();

// Kirimkan response JSON ke Frontend (landing page) untuk ditampilkan ke user
echo json_encode([
    'status'             => 'success',
    'penyakit'           => $pemenang['nama'],
    'nilai'              => $pemenang['persen'],
    'distance'           => $pemenang['distance'],
    'solusi'             => $pemenang['solusi'],
    'kasus_referensi'    => $pemenang['kasus_ref'],
    'detail_perhitungan' => array_values($final_ranking)
]);

