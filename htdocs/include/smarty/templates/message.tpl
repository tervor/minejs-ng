<html>
    {include file="head.tpl"}
    <body onload="init();">

        <div style="float:left;">
            <img src="icons/minecraft-icon.png" width="48" height="48">
        </div>
        <div style="float:left;">
            <a href="." class="titleLink">Minecraft Remote {$versionString}</a>
        </div>


       <div style="float:right;padding-right:0px;">
            <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
                <input type="hidden" name="cmd" value="_s-xclick">
                <input type="hidden" name="hosted_button_id" value="E3SRFXJRXBEAL">
                <input type="image" src="https://oom.ch/img/paypalbtn.gif" border="0" name="submigt" alt="Hilf uns unsere Server am laufen zu halten, spende für oom.ch!" style="width:62px;height:31px;border:0px;padding:0;">
                <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" title="Keep our Servers online!">
            </form>
        </div>
        {if $loggedInUser != ""}
        <div style="float:right;padding-right:20px;">
             <a href="?do=logout">[Logout {$loggedInUser}]</a>
        </div>
        {/if}
        <div id="STatus" class="StatusText">&nbsp;</div> 
        <div style="clear:both;">{$return}</div>

    </body></html>
