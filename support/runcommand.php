#!/usr/bin/php
<?php
require_once( realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . "/../htdocs/include/settings.inc.php");
require_once( realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . "/../htdocs/include/functions.inc.php");

switch ($argv[1]) {
    case "tell":
        echo sendCommand("tell", array("user" => $argv[2], "text" => $argv[3])) . "\n";
        break;

    case "users":
        echo "Users connected:\n";
        foreach (json_decode(sendCommand("users")) as $user) {
            echo "\t" . $user . "\n";
        }
        break;

    case "say":
        echo sendCommand("say", array("text" => $argv[2])) . "\n";
        break;


    default:
        echo "Options available:\n";
        echo "\ttell user 'text'\n";
        echo "\tsay 'text'\n";
        echo "\tusers\n";
}
?>
