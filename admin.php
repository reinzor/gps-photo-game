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
} elseif($action == "open_all")
{
    if (mysql_query("UPDATE players SET open=1 ") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Opened all teams!"));
    }
    else
    {
        echo json_encode(array('success' => false, 'message' => $conn->error));
    }
} elseif($action == "close_all")
{
    if (mysql_query("UPDATE players SET open=0") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Closed all teams!"));
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
} elseif($action == "delete_all_uploads")
{
    if (mysql_query("DELETE FROM uploads") === TRUE)
    {
        echo json_encode(array('success' => true, 'message' => "Deleted all uploads"));
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

<h2>Different views</h2>

<ul>
    <li><a href="/map.html">Map</a></li>
    <li><a href="/photos.html">Photos</a></li>
    <li><a href="/stats.html">Stats</a></li>
</ul> 

<h2>Danger zone</h2>

<ul>
    <li><a onclick="return confirm('Delete all uploads??')" href="/admin.php?action=delete_all_uploads">Clear uploads</a></li>
    <li><a onclick="return confirm('Sure?')" href="/admin.php?action=open_all">Open all teams</a> </li>
    <li><a onclick="return confirm('Sure?')" href="/admin.php?action=close_all">Close all teams</a></li>
</ul>   

<h2>Players</h2>
    
<table class="table">
    <tr><th>#</ht><th>open</th><th>name</th><th>link</th><th>position</th><th>actions</th></tr>
    <?php
    // Select all qr teams
    $result = mysql_query("SELECT * FROM players ORDER BY name");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    if (mysql_num_rows($result) > 0) {
        $i = 0;
        while ($row = mysql_fetch_assoc($result)) {
            ++$i;
            echo '<tr><td>'.$i.'</td><td>'.$row['open'].'</td><td>'.$row['name'].'</td><td>http://eindspel.baasvanhorstaandemaas.nl?id='.$row['id'].'</td><td><small>('.number_format($row['latitude'],2).', '.number_format($row['longitude'],2).')</small></td><td><a onclick="return confirm(\'Are you sure?\')" href="/admin.php?action=delete_player&id='.$row['id'].'">Delete</a></td></tr>';
        }
    }
    ?>
</table>

<form action="admin.php" method="GET">
    <input type="text" name="name">
    <input type="hidden" name="action" value="add_player" />
    <input type="submit" value="Add new player">
</form>

<h2>Points</h2>
    
<table class="table">
    <tr><th>#</ht><th>name</th><th>description</th><th>position</th><th>image</th><th>actions</th></tr>
    <?php
    // Select all qr teams
    $result = mysql_query("SELECT * FROM points");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    if (mysql_num_rows($result) > 0) {
        $i = 0;
        while ($row = mysql_fetch_assoc($result)) {
            ++$i;
            echo '<tr><td>'.$i.'</td><td>'.$row['name'].'</td><td>'.$row['description'].'</td><td><small>('.number_format($row['latitude'],4).', '.number_format($row['longitude'],4).')</small></td><td><img src="'.$row['image'].'" width="200px" /></td><td><a onclick="return confirm(\'Are you sure?\')" href="/admin.php?action=delete_point&id='.$row['id'].'">Delete</a></td></td>';
        }
    }
    ?>
</table>

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