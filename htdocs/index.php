<!DOCTYPE HTML>
<?php
session_set_cookie_params(60 * 60 * 24 * 30);
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
    #no connection to nodejs
    $smarty->assign("return", "Unable to connect to minejs nodejs server. Please retry later.");
    $smarty->display('message.tpl');
} else {
    #are we already logged in?
    if (empty($_SESSION['loggedIn'])) {
        #Auth starts here
        if ($_REQUEST['do'] == "requestCode") {
            #authenticating user view
            $_SESSION['user'] = $_REQUEST['user'];

            if (empty($_SESSION['authCode'])) {
                $_SESSION['authCode'] = rand(1000, 9999);
            }

            tellUser($_REQUEST['user'], "Your Auth Code for McRemote is: " . $_SESSION['authCode']);

            $smarty->assign("return", $_SESSION['message']);
            unset($_SESSION['message']);
            $smarty->display('auth.tpl');
        } else if ($_REQUEST['do'] == "authMe") {
            #authenticating user check
            if ($_SESSION['authCode'] == $_REQUEST['authCode']) {
                #sucessfully logged in
                $_SESSION['message'] = "Logged in!";
                $_SESSION['loggedIn'] = true;
            } else {
                #wrong code recieved
                $smarty->assign("return", "Wrong auth code!");
                $_SESSION['message'] = "Wrong auth code!";
            }
            header("Location: ?");
        } else {
            #redirect to load default page
            $smarty->assign("return", $_SESSION['message']);
            $_SESSION['message'] = "";
            $smarty->display('welcome.tpl');
        }
    } else if ($_REQUEST['do'] == "logout") {
        #Log me out
        setcookie(session_id(), "", time() - 3600);
        session_destroy();
        session_write_close();
        header("Location: ?");
    } else {
        #we are already logged in
        $smarty->assign("loggedInUser", $_SESSION['user']);
        if (in_array($_SESSION['user'], $usersOnline)) {
            #this user is online on the minecraft server

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
                            echo "<b>Gave " . $_SESSION['user'] . " " . $gave . "x " . $name . ".</b>";
                        } else {
                            echo "<b>ERROR: ItemID Not available: " . $_REQUEST['itemId'];
                        }
                    } else {
                        echo "<b>ERROR: Missing fields (user|itemId)</b>";
                    }
                    break;
                    
                case "runScript":
                    runScript($_SESSION['user'], $scripts[$_REQUEST['script']]);
                    echo "Ran script " . $_REQUEST['script'] . " for user " . $_SESSION['user'];
                    break;

                case "usersOnline":
                    echo json_encode($usersOnline);
                    break;

                case "listItems":
                    echo json_encode($items);
                    break;

                case "listScripts":
                    echo json_encode($scripts);
                    break;

                case "teleport":
                    teleportUser($_SESSION['user'], $_REQUEST['dst']);
                    echo "Teleported " . $_SESSION['user'] . " to " . $_REQUEST['dst'];
                    break;

                default:
                    $smarty->assign("return", "<i>Ready for action</i>");
                    $smarty->display('loggedin.tpl');
            }

            
        } else {
            #this user is not online on the minecraft server
            $smarty->assign("return", "Please login to the Minecraft Server.");
            $smarty->display('message.tpl');
        }
    }
}
?>
