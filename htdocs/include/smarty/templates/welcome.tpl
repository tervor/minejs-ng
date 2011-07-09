<html>
    {include file="head.tpl"}
    <body>
        <div style="float:left;">
            <img src="icons/minecraft-icon.png" width="48" height="48">
        </div>
        <div style="float:left;">
            <a href="." class="titleLink">Minecraft Remote {$versionString}</a>
        </div>

        <div style="float:left; clear: both;">
            {if $return != ""}
            <div>Return: {$return}</div>
            {/if}
            <form action="?" method="POST">
                <input type="hidden" name="do" value="requestCode" />
                {if $userCountOnline > 0}
                <div>Who are you?</div>
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
