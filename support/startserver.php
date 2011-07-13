#!/usr/bin/php
<?php

echo "[minecraft] Initializing screen for server minecraft\n";
chdir(realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . "/../");
system("screen -dmS minecraft ./mine.js");

?>
