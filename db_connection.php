<?php

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

function isToken($token)
{
    if (isset($token) && $token) {

        //verification values in BD
        $query = "SELECT id FROM players WHERE code='$token'";
        $sql = mysql_query($query);
        if (mysql_num_rows($sql) > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function generateUniqueToken($number)
{
    $arr = array('a', 'b', 'c', 'd', 'e', 'f',
                 'g', 'h', 'i', 'j', 'k', 'l',
                 'm', 'n', 'o', 'p', 'r', 's',
                 't', 'u', 'v', 'x', 'y', 'z',
                 'A', 'B', 'C', 'D', 'E', 'F',
                 'G', 'H', 'I', 'J', 'K', 'L',
                 'M', 'N', 'O', 'P', 'R', 'S',
                 'T', 'U', 'V', 'X', 'Y', 'Z',
                 '1', '2', '3', '4', '5', '6',
                 '7', '8', '9', '0');
    $token = "";
    for ($i = 0; $i < $number; $i++) {
        $index = rand(0, count($arr) - 1);
        $token .= $arr[$index];
    }

    if (isToken($token)) {
        return generateUniqueToken($number);
    } else {
        return $token;
    }
}