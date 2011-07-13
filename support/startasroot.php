#!/usr/bin/php
<?php

echo "[mcserver] Initializing env for user minecraft\n";
system("su oxi -l -s /bin/bash -c " . realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . "/startserver.php");

?>
