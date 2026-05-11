<?php 
include('config/koneksi.php');
$h = password_hash('admin', PASSWORD_DEFAULT);
$conn->query("UPDATE admin SET password='$h' WHERE username='admin'");
echo 'PASS_RESET';
?>
