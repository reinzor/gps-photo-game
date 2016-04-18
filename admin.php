<?php

include('./db_connection.php');

$action = $_GET['action'];
$name = mysql_real_escape_string($_GET["name"]);
$id = mysql_real_escape_string($_GET["id"]);
$latitude = mysql_real_escape_string($_GET["latitude"]);
$longitude = mysql_real_escape_string($_GET["longitude"]);
$description = mysql_real_escape_string($_GET["description"]);
$image = mysql_real_escape_string($_GET["image"]);

if ($action == "add_player" && $name)
{
    $generated_id = generateUniqueToken(8);
    if (mysql_query("INSERT INTO players (id,name) VALUES ('" . $generated_id . "', '" . $name . "')") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Inserted new team " . $generated_id . ", " . $name));
    }
    else
    {
        echo json_encode(array('success' => false, 'message' => $conn->error));
    }
} elseif($action == "delete_player" && $id)
{
    if (mysql_query("DELETE FROM players WHERE id='" . $id . "'") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Deleted" . $id));
    }
    else
    {
        echo json_encode(array('success' => false, 'message' => $conn->error));
    }
} elseif($action == "add_point" && $name && $image && $description && $longitude && $latitude)
{
    if (mysql_query("INSERT INTO points (name,image,longitude,latitude,description) VALUES ('" . $name . "', '" . $image . "', '" . $longitude . "', '" . $latitude . "', '" . $description . "')") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Inserted new point " . $name));
    }
    else
    {
        echo json_encode(array('success' => false, 'message' => $conn->error));
    }
} elseif($action == "delete_point" && $id)
{
    if (mysql_query("DELETE FROM points WHERE id='" . $id . "'") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Deleted" . $id));
    }
    else
    {
        echo json_encode(array('success' => false, 'message' => $conn->error));
    }
}

?>

<html>
<head>
<title>
Eindspel Baas van Horst aan de Maas 2015
</title>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
<div class="container">

<h1><a href="admin.php">Admin page Eindspel Baas van Horst aan de Maas 2016</a></h1>
<h2>Players</h2>
    
<ul>
    <?php
    // Select all qr teams
    $result = mysql_query("SELECT * FROM players");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    if (mysql_num_rows($result) > 0) {
        while ($row = mysql_fetch_assoc($result)) {
            echo '<li>['.$row['id'].'] '.$row['name'].' ('.$row['longitude'].', '.$row['latitude'].') - <a href="/?id='.$row['id'].'">Page</a> <a href="/admin.php?action=delete_player&id='.$row['id'].'">Delete</a></li>';
        }
    }
    ?>
</ul>

<form action="admin.php" method="GET">
    <input type="text" name="name">
    <input type="hidden" name="action" value="add_player" />
    <input type="submit" value="Add new player">
</form>

<h2>Points</h2>
    
<ul>
    <?php
    // Select all qr teams
    $result = mysql_query("SELECT * FROM points");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    if (mysql_num_rows($result) > 0) {
        while ($row = mysql_fetch_assoc($result)) {
            echo '<li>['.$row['id'].'] '.$row['name'].' ('.$row['longitude'].', '.$row['latitude'].') - <img src="'.$row['image'].'" width="200px" /> <a href="/admin.php?action=delete_point&id='.$row['id'].'">Delete</a></li>';
        }
    }
    ?>
</ul>

<form action="admin.php" method="GET">
    <input type="text" name="name" placeholder="name">
    <input type="text" name="description" placeholder="description">
    <input type="text" name="latitude" placeholder="latitude">
    <input type="text" name="longitude" placeholder="longitude">
    <input type="text" name="image" placeholder="image">
    <input type="hidden" name="action" value="add_point" />
    <input type="submit" value="Add new point">
</form> 

</div>
</body>
</html>