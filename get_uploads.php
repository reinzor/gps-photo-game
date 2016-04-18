<?php

// Return OK
header("HTTP/1.1 200 OK");
header('Content-type: application/json');

$files = array_values(array_diff(scandir(getcwd() . "/upload"), array('.', '..')));

echo json_encode($files);