<?php

include('./db_connection.php');

// Return OK
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{    
    $id = $mysqli->real_escape_string($_POST["id"]);
    $latitude = $mysqli->real_escape_string($_POST["latitude"]);
    $longitude = $mysqli->real_escape_string($_POST["longitude"]);

    if ($id && $latitude && $longitude) 
    {
        // Update
        if ($mysqli->query("UPDATE players SET date=now(),id='". $id ."', latitude='". $latitude ."', longitude='". $longitude ."' WHERE id='".$id."'") === TRUE)
        {
            echo json_encode(array('success' => true, 'message' => "Updated location of " . $id));
        } 
        else
        {
            echo json_encode(array('success' => false, 'message' => $conn->error));
        }     
    } 
    else 
    {
        echo json_encode(array('success' => false, 'message' => "Invalid input"));
    }
}
else
{
    // Select all players
    $result = $mysqli->query("SELECT name,latitude,longitude FROM players");
    if (!$result) {
        echo 'Could not run query: ' . $mysqli->error;
        exit;
    }
    $rows = array();
    while($r = $mysqli->fetch_assoc($result)) {
        $rows[] = $r;
        //echo $r['name'] . "-" . mb_detect_encoding($r['name']) . "\n";
    }
    echo json_encode(utf8_converter($rows));
}