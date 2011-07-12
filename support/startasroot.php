#!/usr/bin/php
<?php

echo "[mcserver] Initializing env for user minecraft\n";
system("su minecraft -l -s /bin/bash -c ./startserver.php");

?>
