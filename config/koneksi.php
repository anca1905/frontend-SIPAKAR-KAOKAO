<?php
$host = "localhost";
$user = "root";
$pass = "";
$db   = "gea";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Koneksi Gagal: " . $conn->connect_error);
}
