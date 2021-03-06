<?php

include('./db_connection.php');

// Return OK
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

// playerId
$player_id = $mysqli->real_escape_string($_GET["player_id"]);

$player_point_ids = array();
if ($player_id) {
    $result = $mysqli->query("SELECT point_id FROM uploads WHERE player_id='". $player_id ."'");
    while($r = $mysqli->fetch_assoc($result)) {
        $player_point_ids[] = $r['point_id'];
    }
}

// Select all players
$result = $mysqli->query("SELECT * FROM points");
if (!$result) {
    echo 'Could not run query: ' . $mysqli->error;
    exit;
}
$rows = array();
while($r = $mysqli->fetch_assoc($result)) {
    if (!in_array($r['id'], $player_point_ids))
        $rows[] = $r;
}

echo json_encode(utf8_converter($rows));