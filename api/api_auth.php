<?php
session_start();
header('Content-Type: application/json');
include '../config/koneksi.php';

$action = isset($_GET['action']) ? $_GET['action'] : '';

// Create table if not exists just to be safe
$conn->query("CREATE TABLE IF NOT EXISTS admin (id INT AUTO_INCREMENT PRIMARY KEY, nama_lengkap VARCHAR(100), username VARCHAR(50), password VARCHAR(255))");

if ($action == 'login') {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM admin WHERE username = ?");
    $stmt->bind_param("s", $user);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        if (password_verify($pass, $row['password']) || $pass == $row['password']) {
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_nama'] = $row['nama_lengkap'];
            echo json_encode(['status' => 'success', 'nama' => $row['nama_lengkap'], 'token' => base64_encode(json_encode(['user'=>$user, 'time'=>time()]))]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Password salah']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Username tidak ditemukan']);
    }
}

if ($action == 'register') {
    $nama = $_POST['nama'] ?? '';
    $user = $_POST['username'] ?? '';
    $pass = password_hash($_POST['password'] ?? '', PASSWORD_DEFAULT);

    $stmt_cek = $conn->prepare("SELECT id FROM admin WHERE username=?");
    $stmt_cek->bind_param("s", $user);
    $stmt_cek->execute();
    $cek = $stmt_cek->get_result();
    
    if ($cek->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Username sudah terpakai']);
    } else {
        $stmt = $conn->prepare("INSERT INTO admin (nama_lengkap, username, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $nama, $user, $pass);
        if ($stmt->execute()) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal mendaftar']);
        }
    }
}
?>
