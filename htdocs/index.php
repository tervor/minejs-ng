<?php

session_start();
header('Access-Control-Allow-Origin: *');

require_once("include/settings.inc.php");
require_once("include/functions.inc.php");
require_once("include/smarty/libs/Smarty.class.php");


## magic starts here ##
$smarty = getSmarty();
$usersOnline = getUsers();

# assign smarty vars
$smarty->assign("userCountOnline", count($usersOnline));
$smarty->assign("usersOnline", $usersOnline);
$smarty->assign("teleportTargets", $usersOnline);
$smarty->assign("availItems", count($items));
$smarty->assign("maxItems", $GLOBALS['maxitems']);
$smarty->assign("items", $items);
$smarty->assign("scripts", $scripts);

if ($usersOnline == false) {
    echo "<b>ERROR:</b> Unable to communicate with server. Please retry";
    exit();
} else {
    switch ($_REQUEST['do']) {
        case "giveItem":
            if ((!empty($_REQUEST['user']) ) && (!empty($_REQUEST['itemId']) )) {
                $name = false;
                foreach ($items as $item) {
                    if ($item['id'] == $_REQUEST['itemId']) {
                        $name = $item['name'];
                    }
                }
                if (!empty($name)) {
                    $gave = giveItem($_REQUEST['user'], $_REQUEST['itemId'], $_REQUEST['amount'], $_REQUEST['stackable']);
                    $smarty->assign("return", "<b>Gave " . $_REQUEST['user'] . " " . $gave . "x " . $name . ".</b>");
                } else {
                    $smarty->assign("return", "<b>ERROR: ItemID Not available: " . $_REQUEST['itemId']);
                }
            } else {
                $smarty->assign("return", "<b>ERROR: Missing fields (user|itemId)</b>");
            }
            break;
        case "runScript":
            runScript($_REQUEST['user'], $scripts[$_REQUEST['script']]);
            $smarty->assign("return", "Ran script " . $_REQUEST['script'] . " for user " . $_REQUEST['user']);
            break;

        case "teleport":
            teleportUser($_REQUEST['user'], $_REQUEST['dst']);
            $smarty->assign("return", "Teleported " . $_REQUEST['user'] . " to " . $_REQUEST['dst']);
            break;

        default:
            $smarty->assign("return", "<i>Ready for action</i>");
    }
}
$smarty->display('index.tpl');
?>
