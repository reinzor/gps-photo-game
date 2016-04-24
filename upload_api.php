<?php

include('./db_connection.php');

// Return JSON
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{    
    if (isset($_POST['pointId']) && isset($_POST['playerId']) && isset($_POST['imageData']))
    {
        // get post vars:
        $point_id = $_POST["pointId"];
        $player_id = $_POST["playerId"];
        $base64_string = $_POST["imageData"];
        
        $filename = date('Y-m-d_H-i-s') . "_" . generateToken(10) . ".jpg";
        $output_file = getcwd() . "/upload/" . $filename;

        $ifp = fopen($output_file, "wb"); 

        $data = explode(',', $base64_string);

        fwrite($ifp, base64_decode($data[1])); 
        fclose($ifp); 

        if (mysql_query("INSERT INTO uploads (point_id,player_id,filename) VALUES ('" . $point_id . "', '" . $player_id . "', '" . $filename . "')") === TRUE)
        {
            // Now get the number of uploads for the user:
            $num_uploads = mysql_num_rows(mysql_query("SELECT id FROM uploads WHERE player_id='". $player_id ."'"));

            echo json_encode(array('success' => true, 'num_uploads' => $num_uploads, 'message' => "Added upload"));
        }
        else
        {
            echo json_encode(array('success' => false, 'message' => $conn->error));
        }
    } else {
        echo json_encode(array('success' => false, 'message' => "Invalid input: " . $point_id . " - " . $player_id));
    }
}
else
{  
    // Get all players
    $result = mysql_query("SELECT * FROM players");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    $players = array();
    while($r = mysql_fetch_assoc($result)) {
        $players[$r['id']] = $r['name'];
    }

    // Get all points
    $result = mysql_query("SELECT * FROM points");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    $points = array();
    while($r = mysql_fetch_assoc($result)) {
        $points[$r['id']] = $r['name'];
    }

    // Select all uploads
    $result = mysql_query("SELECT * FROM uploads");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    $rows = array();
    while($r = mysql_fetch_assoc($result)) {
        $upload = array();
        $upload['filename'] = $r['filename'];
        $upload['player'] = $players[$r['player_id']];
        $upload['point'] = $points[$r['point_id']];
        $upload['point_id'] = $r['point_id'];

        $rows[] = $upload;
    }
    echo json_encode(utf8_converter($rows));
}