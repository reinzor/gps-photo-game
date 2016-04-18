<?php

include('./db_connection.php');

// Return OK
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

// Select all players
$result = mysql_query("SELECT * FROM points");
if (!$result) {
    echo 'Could not run query: ' . mysql_error();
    exit;
}
$rows = array();
while($r = mysql_fetch_assoc($result)) {
    $rows[] = $r;
}
echo json_encode($rows);