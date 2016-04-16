<?php

// usage:
$name = $_POST["name"];
$latitude = $_POST["latitude"];
$longitude = $_POST["longitude"];

// Return OK
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

if (!$name || !$latitude || !$longitude) 
{
    echo json_encode(array('success' => false, 'message' => "Invalid input"));
} 
else 
{
    $servername = "localhost";
    $username = "deb88327_baas";
    $password = "banana";
    $databasename = "deb88327_eindspel";

    $conn = mysql_connect($servername, $username, $password);
    if (!$conn) {
        die('Not connected : ' . mysql_error());
    }

    // make foo the current db
    $db = mysql_select_db($databasename, $conn);
    if (!$db) {
        die ('Can\'t use ' . $databasename . ' : ' . mysql_error());
    }

    // Store or update
    if (mysql_query("INSERT INTO positions (name,latitude,longitude) VALUES ('" . $name . "', '" . $latitude . "', '" . $longitude . "') 
        ON DUPLICATE KEY UPDATE date=now(),name='". $name ."', latitude='". $latitude ."', longitude='". $longitude ."'") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Stored location of " . $name));
    } 
    else
    {
        echo json_encode(array('success' => false, 'message' => $conn->error));
    } 
}