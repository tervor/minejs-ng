#!/bin/bash

USER="minecraft"
#NODE="$(which node)"
PATH="$( echo $0 | sed s/$(basename $0)//g )../"
#system("su " . $facility['user'] . " -l -s /bin/bash -c '" . realpath(dirname($_SERVER['SCRIPT_FILENAME']) . "/startserver.php") . " " . $argv[1] . "'");

su $USER -l -s /bin/bash -c $PATH/mine.js
