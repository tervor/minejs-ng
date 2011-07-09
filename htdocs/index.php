<!DOCTYPE HTML>
<?php

session_start();

require_once("include/settings.inc.php");
require_once("include/functions.inc.php");
require_once("include/smarty/libs/Smarty.class.php");


## magic starts here ##
$smarty = getSmarty();
$usersOnline = getUsers();

# assign smarty vars
$smarty->assign("userCountOnline", count($usersOnline));
$smarty->assign("usersOnline", $usersOnline);
$smarty->assign("versionString", $GLOBALS['versionString']);

$status = sendCommand("status");
if (empty($status)) {
    echo "<b>ERROR:</b> Unable to connect to Minecraft server. Please retry later.";
    exit();
} else {
    if (empty($_SESSION['loggedIn'])) {
        #Auth starts here
        if ($_REQUEST['do'] == "requestCode") {
            $_SESSION['user'] = $_REQUEST['user'];

            if (empty($_SESSION['authCode'])) {
                $_SESSION['authCode'] = rand(1000, 9999);
            }

            tellUser($_REQUEST['user'], "Your Auth Code for McRemote is: " . $_SESSION['authCode']);

            $smarty->assign("return", $_SESSION['message']);
            unset($_SESSION['message']);
            $smarty->display('auth.tpl');
        } else if ($_REQUEST['do'] == "authMe") {
            if ($_SESSION['authCode'] == $_REQUEST['authCode']) {
                $_SESSION['message'] = "Logged in!";
                $_SESSION['loggedIn'] = true;
            } else {
                $_SESSION['message'] = "Wrong auth code!";
            }
            header("Location: ?");
        } else {
            $smarty->assign("return", "");
            $smarty->display('welcome.tpl');
        }
    } else if ($_REQUEST['do'] == "logout") {
        #Log me out
        setcookie(session_id(), "", time() - 3600);
        session_destroy();
        session_write_close();
        header("Location: ?");
    } else {
        $smarty->assign("loggedInUser", $_SESSION['user']);
        
        $tpTargets = array();
        foreach ($usersOnline as $user) {
            if ($user != $_SESSION['user']) {
                array_push($tpTargets, $user);
            }
        }
        $smarty->assign("teleportTargets", $tpTargets);
        $smarty->assign("availItems", count($items));
        $smarty->assign("maxItems", $GLOBALS['maxitems']);
        $smarty->assign("items", $items);
        $smarty->assign("scripts", $scripts);

        switch ($_REQUEST['do']) {
            case "giveItem":
                if (!empty($_REQUEST['itemId'])) {
                    $name = false;
                    foreach ($items as $item) {
                        if ($item['id'] == $_REQUEST['itemId']) {
                            $name = $item['name'];
                        }
                    }
                    if (!empty($name)) {
                        $gave = giveItem($_SESSION['user'], $_REQUEST['itemId'], $_REQUEST['amount'], $_REQUEST['stackable']);
                        $smarty->assign("return", "<b>Gave " . $_SESSION['user'] . " " . $gave . "x " . $name . ".</b>");
                    } else {
                        $smarty->assign("return", "<b>ERROR: ItemID Not available: " . $_REQUEST['itemId']);
                    }
                } else {
                    $smarty->assign("return", "<b>ERROR: Missing fields (user|itemId)</b>");
                }
                break;
            case "runScript":
                runScript($_SESSION['user'], $scripts[$_REQUEST['script']]);
                $smarty->assign("return", "Ran script " . $_REQUEST['script'] . " for user " . $_SESSION['user']);
                break;

            case "teleport":
                teleportUser($_SESSION['user'], $_REQUEST['dst']);
                $smarty->assign("return", "Teleported " . $_SESSION['user'] . " to " . $_REQUEST['dst']);
                break;

            default:
                $smarty->assign("return", "<i>Ready for action</i>");
        }

        $smarty->display('loggedin.tpl');
    }
}
?>
