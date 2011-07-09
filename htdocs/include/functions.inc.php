<?php

#functions

function getSmarty() {
    $smarty = new Smarty();
    $smarty->setTemplateDir('include/smarty/templates');
    $smarty->setCompileDir('include/smarty/templates_c');
    $smarty->setCacheDir('include/smarty/cache');
    //$smarty->caching = 0;
    $smarty->setConfigDir('include/smarty/configs');
    return $smarty;
}

function sendCommand($cmd, $opts = array()) {
    $optStr = "";
    if (count($opts)) {
        $first = true;
        foreach ($opts as $name => $value) {
            if ($first) {
                $optStr .= "?";
                $first = false;
            } else {
                $optStr .= "&";
            }
            $optStr .= $name . "=" . $value;
        }
    }

    return file_get_contents($GLOBALS['nodejsServer'] . "/" . $cmd . urlencode($optStr));
}

function getUsers() {
    return json_decode(sendCommand("users"));
}

function runScript($user, $lines) {
    $cmd = "";
    $first = true;
    foreach ($lines as $line) {
        if ($first) {
            $first = false;
        } else {
            $cmd .= chr(13);
        }
        $cmd .= $line;
    }

    sendCommand(str_replace("USER", $user, $cmd));
    return true;
}

function teleportUser($src, $dst) {
    sendCommand("tp " . $src . " " . $dst);
    return "User " . $src . " to " . $dst . " teleported";
}

function tellUser($user, $text) {
    sendCommand("tell", array("user" => $user, "text" => $text));
}

function giveItem($user, $id, $amount = 64, $stackable = 0) {
    sendCommand("tell", array("user" => $user, "text" => "Giving you " . $amount . " of " . $id));
    $cmd = "";
    if ($amount > $GLOBALS['maxitems']) {
        $amount = $GLOBALS['maxitems'];
    } elseif ($amount < 1) {

        #esc stackable hack, boolean value may be better?
        if ($stackable < 1) {
            $amount = 1;
        } else {
            $amount = 64;
        }
    }

    if (( $amount / 64 ) > 1) {
        $runs = round($amount / 64);
        for ($i = 1; $i <= $runs; $i++) {
            sendCommand("give", array("user" => $user, "id" => $id, "num" => "64"));
        }
        sendCommand("give", array("user" => $user, "id" => $id, "num" => ( $amount % 64 )));
    } else {
        sendCommand("give", array("user" => $user, "id" => $id, "num" => $amount));
    }

    return $amount;
}

?>
