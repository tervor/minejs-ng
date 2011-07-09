<html>
    <head>
        <title>Minecraft Remote Auth</title>
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
        <div style="float:right;padding-right:20px;">
             <a href="?do=logout">[Reset]</a>
        </div>

        <div style="float:left; clear: both;">
            <form action="?" method="POST">
                <input type="hidden" name="do" value="authMe" />
                {if $return != ""}
                <div>Return: {$return}</div>
                {/if}
                <div>
                    Please enter your AuthCode from Minecraft:<br />
                    <input type="text" name="authCode" size="4"/>
                    <input type="submit" name="submit" value="go" />
                </div>
            </form>
        </div>
    </body>
</html>        
