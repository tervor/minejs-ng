<?php
#functions
function getSmarty () {
	$smarty = new Smarty();
	$smarty->setTemplateDir('templates');
	$smarty->setCompileDir('include/smarty/templates_c');
	$smarty->setCacheDir('include/smarty/cache');
	//$smarty->caching = 0;
	$smarty->setConfigDir('include/smarty/configs');
	return $smarty;
}

function sendCommand ($cmd) {
 return exec ( realpath(dirname($_SERVER['SCRIPT_FILENAME'])) .
 				"/sendcommand.php " . $GLOBALS['facilitid'] . " '" . $cmd . "'");
}

function getUsers () {
	$noresponse = true;
	$search = "Connected players:";
	$count = 0;
	while ($noresponse) {
		if ($count) sleep(2);
		$count++;
		$return = sendCommand("list");
		if (strpos($return, $search) ) {
			#found our string!
			$noresponse = false;
			$usrStr = substr($return, ( strpos($return, $search) + strlen($search) ) );
			if (strlen($usrStr)) {
				$tmpArray = array(); #array("name" => "john")
				foreach (explode(",", $usrStr) as $user) {
					array_push($tmpArray, array("name" => trim($user)));
				}
				return $tmpArray;
			} else {
				return array();
			}
		} elseif ($count > 1) {
			#emergency exit
			return false;
		}
	}
}

function runScript ($user, $lines) {
	$cmd = "";
	$first = true;
	foreach ($lines as $line) {
		if ($first) {
			$first=false;
		} else {
			$cmd .= chr(13);
		}
		$cmd .= $line;
	}

	sendCommand(str_replace("USER", $user, $cmd));
	return true;
}

function teleportUser ($src, $dst) {
	sendCommand("tp " . $src . " " . $dst);
	return "User " . $src . " to " . $dst . " teleported";
}

function giveItem ($user, $id, $amount = 64, $stackable = 0) {
	$cmd = "";
	if ($amount > $GLOBALS['maxitems']) {
		$amount = $GLOBALS['maxitems'];
	} elseif ($amount < 1) {
	    
	    #esc stackable hack, boolean value may be better?
	    if ( $stackable < 1 ) {
	        $amount = 1;
	    } else {
	        $amount = 64;
	    }
	}

	if ( ( $amount / 64 ) > 1 ) {
		$runs = round ( $amount / 64 ); 	
		for ($i = 1; $i <= $runs; $i++) {
			$cmd .= "give " . $user . " " . $id . " 64" . chr(13);
		}
		$cmd .= "give " . $user . " " . $id . " " . ( $amount % 64 );

	} else {
		$cmd = "give " . $user . " " . $id . " " . $amount;
	}
	
	sendCommand($cmd);
	return $amount;
}

?>
