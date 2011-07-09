<?php

# settings:
$GLOBALS['maxitems'] = 2047;
$GLOBALS['nodejsServer'] = "http://localhost:8000";
$GLOBALS['versionString'] = "0.5";

$items = json_decode(file_get_contents("include/items.json"), true);
$scripts = json_decode(file_get_contents("include/scripts.json"), true);

?>
