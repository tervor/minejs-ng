<html>
    {include file="head.tpl"}
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
