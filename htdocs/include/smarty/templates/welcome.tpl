<html>
    <head>
        <title>Minecraft Remote Welcome</title>
        <link type="text/css" href="include/css/ui-lightness/jquery-ui-1.8.13.custom.css" rel="stylesheet" />	
        <link type="text/css" href="include/css/custom.css" rel="stylesheet" />
        <script type="text/javascript" src="include/js/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="include/js/jquery-ui-1.8.13.custom.min.js"></script>	
        <script type="text/javascript" src="include/js/prototype.js"></script>
        <script type='text/javascript' src="remote.js"></script>
        <!--- <meta http-equiv="refresh" content="1024">--->
        <script>

        </script>
    </head>
    <body>
        <div style="float:left;">
            <img src="icons/minecraft-icon.png" width="48" height="48">
        </div>
        <div style="float:left;">
            <a href="." class="titleLink">Minecraft Remote {$versionString}</a>
        </div>

        <div style="float:left; clear: both;">
            <form action="?" method="POST">
                <input type="hidden" name="do" value="requestCode" />
                {if $return != ""}
                <div>Return: {$return}</div>
                {/if}
                {if $userCountOnline > 0}
                <div>Choose your Player to start Auth:</div>
                <div>
                    <select name="user" id="STuserlist" onChange="changeUsername();">
                        {foreach $usersOnline as $key => $value}
                        <option value="{$value}">
	                {$value}
                        </option>
                        {/foreach}
                    </select>
                    <input type="submit" name="submit" value="go" />
                </div>
                {else}
                <div>
                    No Users connected. Please connect to the Minecraft Server.
                </div>
                {/if}
            </form>
        </div>
    </body>
</html>        
