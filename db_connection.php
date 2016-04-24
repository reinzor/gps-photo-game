<?php

$servername = "localhost";
$username = "deb88327_baas";
$password = "banana";
$databasename = "deb88327_eindspel";

mysql_set_charset("utf8");
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

function utf8_converter($array)
{
    array_walk_recursive($array, function(&$item, $key){
        if(!mb_detect_encoding($item, 'utf-8', true)){
            $item = utf8_encode($item);
        }
    });
    return $array;
}

function sanitizeFileName($dangerous_filename, $platform = 'Unix')
{
    if (in_array(strtolower($platform), array('unix', 'linux'))) {
        // our list of "dangerous characters", add/remove characters if necessary
        $dangerous_characters = array(" ", '"', "'", "&", "/", "\\", "?", "#");
    }
    else {
        // no OS matched? return the original filename then...
        return $dangerous_filename;
    }

    // every forbidden character is replace by an underscore
    return str_replace($dangerous_characters, '_', $dangerous_filename);
}

function generateToken($number)
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
    return $token;
}

function generateUniqueToken($number)
{
    $token = generateToken($number);

    if (isToken($token)) {
        return generateUniqueToken($number);
    } else {
        return $token;
    }
}