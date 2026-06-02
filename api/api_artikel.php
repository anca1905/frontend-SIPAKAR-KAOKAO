<?php
/**
 * api_artikel.php
 * CRUD untuk tabel artikel dan kategori_artikel
 *
 * Actions:
 *  GET  ?action=read_artikel                → semua artikel (publik, dengan kategori)
 *  GET  ?action=read_artikel&id=X           → satu artikel by id
 *  GET  ?action=read_kategori               → semua kategori
 *  POST ?action=save_artikel                → tambah/edit artikel
 *  POST ?action=delete_artikel              → hapus artikel
 *  POST ?action=save_kategori               → tambah/edit kategori
 *  POST ?action=delete_kategori             → hapus kategori
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

include '../config/koneksi.php';

// ─── pastikan tabel ada ──────────────────────────────────────────
$conn->query("
    CREATE TABLE IF NOT EXISTS `kategori_artikel` (
        `id`    INT AUTO_INCREMENT PRIMARY KEY,
        `nama`  VARCHAR(100) NOT NULL,
        `slug`  VARCHAR(100) NOT NULL UNIQUE,
        `warna` VARCHAR(30)  DEFAULT 'penyakit'
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

$conn->query("
    CREATE TABLE IF NOT EXISTS `artikel` (
        `id`           INT AUTO_INCREMENT PRIMARY KEY,
        `id_kategori`  INT DEFAULT NULL,
        `judul`        VARCHAR(255) NOT NULL,
        `slug`         VARCHAR(255) NOT NULL UNIQUE,
        `gambar_url`   TEXT,
        `penulis`      VARCHAR(100) DEFAULT 'Admin BPP Toari',
        `tanggal`      DATE DEFAULT (CURRENT_DATE),
        `waktu_baca`   INT  DEFAULT 4,
        `excerpt`      TEXT,
        `isi`          LONGTEXT,
        `protokol`     TEXT,
        `status`       ENUM('publish','draft') DEFAULT 'publish',
        FOREIGN KEY (`id_kategori`) REFERENCES `kategori_artikel`(`id`) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");

// Seed kategori default jika masih kosong
$ck = $conn->query("SELECT COUNT(*) AS c FROM kategori_artikel")->fetch_assoc();
if ((int)$ck['c'] === 0) {
    $conn->query("INSERT INTO kategori_artikel (nama,slug,warna) VALUES
        ('Penyakit','penyakit','penyakit'),
        ('Hama','hama','hama')");
}

$action = $_GET['action'] ?? '';

// ════════════════════════════════════════════════
//  READ KATEGORI
// ════════════════════════════════════════════════
if ($action === 'read_kategori') {
    $rows = [];
    $r    = $conn->query("SELECT * FROM kategori_artikel ORDER BY id");
    while ($row = $r->fetch_assoc()) $rows[] = $row;
    echo json_encode($rows);
    exit;
}

// ════════════════════════════════════════════════
//  READ ARTIKEL
// ════════════════════════════════════════════════
if ($action === 'read_artikel') {
    $id       = isset($_GET['id'])   ? (int)$_GET['id']        : 0;
    $slug     = isset($_GET['slug']) ? $conn->real_escape_string($_GET['slug']) : '';
    $kat_slug = isset($_GET['kategori']) ? $conn->real_escape_string($_GET['kategori']) : '';

    $where = "WHERE a.status = 'publish'";
    if ($id)       $where = "WHERE a.id = $id";
    elseif ($slug) $where = "WHERE a.slug = '$slug'";
    elseif ($kat_slug) $where .= " AND k.slug = '$kat_slug'";

    // Admin mode – lihat semua status
    if (isset($_GET['all'])) $where = str_replace("WHERE a.status = 'publish'", 'WHERE 1', $where);

    $sql  = "SELECT a.*, k.nama AS nama_kategori, k.slug AS slug_kategori, k.warna
             FROM artikel a
             LEFT JOIN kategori_artikel k ON a.id_kategori = k.id
             $where
             ORDER BY a.tanggal DESC, a.id DESC";
    $rows = [];
    $r    = $conn->query($sql);
    while ($row = $r->fetch_assoc()) $rows[] = $row;
    echo json_encode($id || $slug ? ($rows[0] ?? null) : $rows);
    exit;
}

// ════════════════════════════════════════════════
//  SAVE ARTIKEL (tambah / edit)
// ════════════════════════════════════════════════
if ($action === 'save_artikel') {
    $id          = isset($_POST['id'])          ? (int)$_POST['id'] : 0;
    $id_kategori = isset($_POST['id_kategori']) ? (int)$_POST['id_kategori'] : 0;
    $judul       = $conn->real_escape_string(trim($_POST['judul']       ?? ''));
    $gambar_url  = $conn->real_escape_string(trim($_POST['gambar_url']  ?? ''));
    $penulis     = $conn->real_escape_string(trim($_POST['penulis']     ?? 'Admin BPP Toari'));
    $tanggal     = $conn->real_escape_string(trim($_POST['tanggal']     ?? date('Y-m-d')));
    $waktu_baca  = (int)($_POST['waktu_baca']  ?? 4);
    $excerpt     = $conn->real_escape_string(trim($_POST['excerpt']     ?? ''));
    $isi         = $conn->real_escape_string(trim($_POST['isi']         ?? ''));
    $protokol    = $conn->real_escape_string(trim($_POST['protokol']    ?? ''));
    $status      = ($_POST['status'] ?? 'publish') === 'draft' ? 'draft' : 'publish';

    if (!$judul) { echo json_encode(['status'=>'error','message'=>'Judul wajib diisi']); exit; }

    // Buat slug unik dari judul
    $slug_base = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $judul));
    $slug_base = trim($slug_base, '-');
    $slug      = $slug_base;
    $count     = 1;
    // Pastikan slug unik (kecuali saat edit dengan id yang sama)
    while (true) {
        $esc_slug = $conn->real_escape_string($slug);
        $ex = $conn->query("SELECT id FROM artikel WHERE slug='$esc_slug'" . ($id ? " AND id != $id" : ""))->fetch_assoc();
        if (!$ex) break;
        $slug = $slug_base . '-' . $count++;
    }
    $slug = $conn->real_escape_string($slug);

    $id_kat_val = $id_kategori ? $id_kategori : 'NULL';

    if ($id) {
        $sql = "UPDATE artikel SET
            id_kategori = $id_kat_val,
            judul       = '$judul',
            slug        = '$slug',
            gambar_url  = '$gambar_url',
            penulis     = '$penulis',
            tanggal     = '$tanggal',
            waktu_baca  = $waktu_baca,
            excerpt     = '$excerpt',
            isi         = '$isi',
            protokol    = '$protokol',
            status      = '$status'
            WHERE id    = $id";
    } else {
        $sql = "INSERT INTO artikel
            (id_kategori,judul,slug,gambar_url,penulis,tanggal,waktu_baca,excerpt,isi,protokol,status)
            VALUES ($id_kat_val,'$judul','$slug','$gambar_url','$penulis','$tanggal',$waktu_baca,'$excerpt','$isi','$protokol','$status')";
    }

    if ($conn->query($sql)) {
        echo json_encode(['status'=>'success','message'=>'Artikel berhasil disimpan','slug'=>$slug]);
    } else {
        echo json_encode(['status'=>'error','message'=>$conn->error]);
    }
    exit;
}

// ════════════════════════════════════════════════
//  DELETE ARTIKEL
// ════════════════════════════════════════════════
if ($action === 'delete_artikel') {
    $id = (int)($_POST['id'] ?? 0);
    if ($conn->query("DELETE FROM artikel WHERE id = $id")) {
        echo json_encode(['status'=>'success','message'=>'Artikel dihapus']);
    } else {
        echo json_encode(['status'=>'error','message'=>$conn->error]);
    }
    exit;
}

// ════════════════════════════════════════════════
//  SAVE KATEGORI
// ════════════════════════════════════════════════
if ($action === 'save_kategori') {
    $id    = isset($_POST['id'])    ? (int)$_POST['id'] : 0;
    $nama  = $conn->real_escape_string(trim($_POST['nama']  ?? ''));
    $warna = $conn->real_escape_string(trim($_POST['warna'] ?? 'penyakit'));
    if (!$nama) { echo json_encode(['status'=>'error','message'=>'Nama wajib diisi']); exit; }

    $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $nama));
    $slug = $conn->real_escape_string(trim($slug, '-'));

    if ($id) {
        $sql = "UPDATE kategori_artikel SET nama='$nama', slug='$slug', warna='$warna' WHERE id=$id";
    } else {
        $sql = "INSERT INTO kategori_artikel (nama,slug,warna) VALUES ('$nama','$slug','$warna')";
    }
    if ($conn->query($sql)) echo json_encode(['status'=>'success','message'=>'Kategori disimpan']);
    else echo json_encode(['status'=>'error','message'=>$conn->error]);
    exit;
}

// ════════════════════════════════════════════════
//  DELETE KATEGORI
// ════════════════════════════════════════════════
if ($action === 'delete_kategori') {
    $id = (int)($_POST['id'] ?? 0);
    if ($conn->query("DELETE FROM kategori_artikel WHERE id = $id")) {
        echo json_encode(['status'=>'success','message'=>'Kategori dihapus']);
    } else {
        echo json_encode(['status'=>'error','message'=>$conn->error]);
    }
    exit;
}

echo json_encode(['status'=>'error','message'=>'Action tidak dikenal']);
