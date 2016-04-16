<?php

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

// usage:
$name = $_POST["name"];
$base64_string = $_POST["imageData"];

// Return OK
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

if ($name && $base64_string && is_string($name) && is_string($base64_string)) {
    $name = sanitizeFileName($name);

    $output_file = getcwd() . "/upload/" . $name . "_" . date('Y-m-d_H-i-s') . ".jpg";

    $ifp = fopen($output_file, "wb"); 

    $data = explode(',', $base64_string);

    fwrite($ifp, base64_decode($data[1])); 
    fclose($ifp); 

    echo json_encode(array('success' => true, 'message' => "Wrote file to " . $output_file));
} else {
    echo json_encode(array('success' => false, 'message' => "Invalid input"));
}