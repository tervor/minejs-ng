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
        <input type="image" src="https://oom.ch/img/paypalbtn.gif" border="0" name="submigt"
               alt="Hilf uns unsere Server am laufen zu halten, spende für oom.ch!"
               style="width:62px;height:31px;border:0px;padding:0;">
        <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1"
             title="Keep our Servers online!">
    </form>
</div>
<div style="float:right;padding-right:20px;">
    <a href="?do=logout">[Logout {$loggedInUser}]</a>
</div>
<div id="STatus" class="StatusText">&nbsp;</div>
<form id="FormName" name="FormName" id="FormName" action="." style="clear:both;width:100%;">
    <div id="ItemGrid" style="float:left;">
        {foreach $items as $item}
        <abbr title="{$item.id}">
            <div id="box-{$item.id}" class="GridBox ItemGridBox" onmousemove="boxHover('{$item.id}')"
                 onmouseout="boxNormal('{$item.id}')">
                <div id="IncDecMinusButton-{$item.id}" class="incdecbuttonbox"
                     onclick="IncDecMinus('IncDecInput-{$item.id}')">-
                </div>
                <input type="text" id="IncDecInput-{$item.id}" value="{if $item.amount eq '0'}1{else}64{/if}"
                       class="incdecinputbox" DISABLED
                       onclick="giveItemById('{$item.id}','{$item.amount}','IncDecInput-{$item.id}')">

                <div id="IncDecPlusButton-{$item.id}" class="incdecbuttonbox"
                     onclick="IncDecPlus('IncDecInput-{$item.id}')">+
                </div>
                <div name="IconLayer-{$item.id}" style="height:100%;width:100%;"
                     onclick="giveItemById('{$item.id}','{$item.amount}','IncDecInput-{$item.id}')">
                    <div style="padding: 25% 29% 4% 29%;">
                        <!--- <img src="icons/gate.png" width="32" height="32" border="0"> -->
                        <img src="icons/{$item.id}.png" id=="ItemImg-{$item.id}" class="STicon" border="0">
                    </div>
                    <div name="Namelabel-{$item.id}" id="Namelabel-{$item.id}" class="Namelabel">{$item.name}</div>
                </div>
            </div>
        </abbr>
        {/foreach}
    </div>
</form>
<div id="scriptGrid" style="float:left;">
    {foreach $scripts as $script => $items}
    <div id="box-{$script}" class="GridBox ScriptGridBox" onclick="scriptByName('{$script}');"
         onmousemove="EXboxHover('box-{$script}','script','1','ScriptImg-{$script}')"
         onmouseout="boxHover('box-{$script}','script','0','ScriptImg-{$script}')">
        <div style="text-align: center;">
            <div name="IDlabel-{$script}" class="IDlabel">&nbsp;</div>
            <img src="icons/pack.png" id=="ScriptImg-{$script}" width="32" height="32" border="0">
            <div name="Namelabel-{$script}" class="Namelabel">{$script}</div>
        </div>
    </div>
    {/foreach}
</div>

<div id="teleportGrid" style="float:clear;">
    {foreach $teleportTargets as $key => $value}
    <div id="box-{$value}" class="GridBox TeleportGridBox" onclick="teleportByName('{$value}');"
         onmousemove="EXboxHover('box-{$value}','teleport','1','TeleportImg-{$value}')"
         onmouseout="EXboxHover('box-{$value}','teleport','0','TeleportImg-{$value}')">
        <center>
            <div name="IDlabel-{$value}" class="IDlabel">Teleport</div>
            <img src="icons/gate.png" id=="TeleportImg-{$value}" width="32" height="32" border="0">
            <div name="Namelabel-{$value}" class="Namelabel">to {$value}</div>
        </center>
    </div>
    {/foreach}
</div>


<!-- ajax test code --->
<form name="sendScreen" id="sendScreen" action="?" method="post">
    <input type="hidden" name="do" id="STdo" value="giveItem"/>
    <input type="hidden" name="itemId" id="STitem" value="0"/>
    <input type="hidden" name="stackable" id="STstackable" value="0"/>
    <input type="hidden" name="amount" id="STamount" value="1"/>
    <input type="hidden" name="script" id="STscript" value="0"/>
    <input type="hidden" name="dst" id="STdst" value="0"/>
</form>


<!--<hr>
<div id="debug" style="color:gray; font-size:10px;">
<strong>Debug Output</strong><br>
Facility name: {$facilityName}<br />
Connected users: {$userCountOnline}<br />
Return: {$return}
-->

</body>
</html>
