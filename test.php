<?php 
include('config/koneksi.php');
$r = $conn->query('SELECT * FROM admin');
if ($r) {
    if($r->num_rows > 0) {
        $rows = $r->fetch_all(MYSQLI_ASSOC);
        file_put_contents('test.txt', json_encode($rows));
        echo "WRITTEN";
    } else {
        echo "TABLE_EMPTY";
    }
} else {
    echo "ERROR: " . $conn->error;
}
?>
