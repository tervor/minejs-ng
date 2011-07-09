<?php

#load config
require_once( realpath(dirname($_SERVER['SCRIPT_FILENAME'])) . "/facilities.inc.php");

#load the facility
if (! empty($GLOBALS['facilityid'])) {
	$facility = $cfg[$GLOBALS['facilityid']];
} else if (  empty($cfg[$argv[1]]['name']) ) {
	echo "Please specify facility!\n";
	exit();
} else {
 $facility = $cfg[$argv[1]];
}

?>
