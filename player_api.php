<?php

include('./db_connection.php');

// Return OK
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{    
    $id = mysql_real_escape_string($_POST["id"]);
    $latitude = mysql_real_escape_string($_POST["latitude"]);
    $longitude = mysql_real_escape_string($_POST["longitude"]);

    if ($id && $latitude && $longitude) 
    {
        // Update
        if (mysql_query("UPDATE players SET date=now(),id='". $id ."', latitude='". $latitude ."', longitude='". $longitude ."' WHERE id='".$id."'") === TRUE)
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
    $result = mysql_query("SELECT name,latitude,longitude FROM players");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    $rows = array();
    while($r = mysql_fetch_assoc($result)) {
        $rows[] = $r;
    }
    echo json_encode($rows);
}