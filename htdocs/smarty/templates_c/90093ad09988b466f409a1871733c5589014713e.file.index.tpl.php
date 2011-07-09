<?php /* Smarty version Smarty-3.0.7, created on 2011-07-09 02:35:03
         compiled from "templates/index.tpl" */ ?>
<?php /*%%SmartyHeaderCode:10580040104e17a237c0d970-93784128%%*/if(!defined('SMARTY_DIR')) exit('no direct access allowed');
$_smarty_tpl->decodeProperties(array (
  'file_dependency' => 
  array (
    '90093ad09988b466f409a1871733c5589014713e' => 
    array (
      0 => 'templates/index.tpl',
      1 => 1310169494,
      2 => 'file',
    ),
  ),
  'nocache_hash' => '10580040104e17a237c0d970-93784128',
  'function' => 
  array (
  ),
  'has_nocache_code' => false,
)); /*/%%SmartyHeaderCode%%*/?>
<html>
<head>
    <title>Minecraft Remote</title>
    <link type="text/css" href="http://mc.oom.ch/css/ui-lightness/jquery-ui-1.8.13.custom.css" rel="stylesheet" />	
    <link type="text/css" href="http://mc.oom.ch/custom.css" rel="stylesheet" />
    <script type="text/javascript" src="http://mc.oom.ch/js/jquery-1.5.1.min.js"></script>
    <script type="text/javascript" src="http://mc.oom.ch/js/jquery-ui-1.8.13.custom.min.js"></script>	
    <script type="text/javascript" src="http://alptroeim.ch/prototype.js"></script>
    <script type='text/javascript' src="http://mc.oom.ch/mcremote/remote.js"></script>
   <!--- <meta http-equiv="refresh" content="1024">--->
<script>

</script>
</head>
<body onload="init();">

<div style="float:left;">
<img src="icons/minecraft-icon.png" width="48" height="48">
</div>
<div style="float:left;">
<a href="." class="titleLink">Minecraft Remote 0.4</a>
</div>


<div style="float:left;">
    <div class="STlabel">Player:</div>
    <div class="STinput">
        <select name="user" id="STuserlist" onChange="changeUsername();">
            <?php  $_smarty_tpl->tpl_vars['userOnline'] = new Smarty_Variable;
 $_from = $_smarty_tpl->getVariable('usersOnline')->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
if ($_smarty_tpl->_count($_from) > 0){
    foreach ($_from as $_smarty_tpl->tpl_vars['userOnline']->key => $_smarty_tpl->tpl_vars['userOnline']->value){
?>
                <option value="<?php echo $_smarty_tpl->tpl_vars['userOnline']->value['name'];?>
">
	                <?php echo $_smarty_tpl->tpl_vars['userOnline']->value['name'];?>

	            </option>
            <?php }} ?>
        </select>
    </div>
 </div>
<div style="float:right;padding-right:0px;">
    <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
    <input type="hidden" name="cmd" value="_s-xclick">
    <input type="hidden" name="hosted_button_id" value="E3SRFXJRXBEAL">
    <input type="image" src="https://oom.ch/img/paypalbtn.gif" border="0" name="submigt" alt="Hilf uns unsere Server am laufen zu halten, spende für oom.ch!" style="width:62px;height:31px;border:0px;padding:0;">
    <img alt="" border="0" src="https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1" title="Keep our Servers online!">
    </form>
</div>
<div id="STatus" class="StatusText">&nbsp;</div> 
<form id="FormName" name="FormName" id="FormName" action="." style="clear:both;width:100%;"> 
<div id="ItemGrid" style="float:left;">
        <?php  $_smarty_tpl->tpl_vars['item'] = new Smarty_Variable;
 $_from = $_smarty_tpl->getVariable('items')->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
if ($_smarty_tpl->_count($_from) > 0){
    foreach ($_from as $_smarty_tpl->tpl_vars['item']->key => $_smarty_tpl->tpl_vars['item']->value){
?>
        <abbr title="<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
">
            <div id="box-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="GridBox ItemGridBox" onmousemove="boxHover('<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
')" onmouseout="boxNormal('<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
')" >
                <div id="IncDecMinusButton-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="incdecbuttonbox" onclick="IncDecMinus('IncDecInput-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
')">-</div>
                <input type="text" id="IncDecInput-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" value="<?php if ($_smarty_tpl->tpl_vars['item']->value['stackable']=='0'){?>1<?php }else{ ?>64<?php }?>" class="incdecinputbox"  DISABLED  onclick="giveItemById('<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
','<?php echo $_smarty_tpl->tpl_vars['item']->value['stackable'];?>
','IncDecInput-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
')"  >
                <div id="IncDecPlusButton-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="incdecbuttonbox" onclick="IncDecPlus('IncDecInput-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
')">+</div>
                <div name="IconLayer-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" style="height:100%;width:100%;"  onclick="giveItemById('<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
','<?php echo $_smarty_tpl->tpl_vars['item']->value['stackable'];?>
','IncDecInput-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
')" >
                    <div style="padding: 25% 29% 4% 29%;">
                         <!--- <img src="icons/gate.png" width="32" height="32" border="0"> -->
                        <img src="icons/<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
.png" id=="ItemImg-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="STicon" border="0">
                    </div>
                <div name="Namelabel-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
"  id="Namelabel-<?php echo $_smarty_tpl->tpl_vars['item']->value['id'];?>
" class="Namelabel"><?php echo $_smarty_tpl->tpl_vars['item']->value['name'];?>
</div>
             </div>
            </div>
        </abbr>
        <?php }} ?>
</div>
</form>
<div id="scriptGrid" style="float:left;">
        <?php  $_smarty_tpl->tpl_vars['items'] = new Smarty_Variable;
 $_smarty_tpl->tpl_vars['script'] = new Smarty_Variable;
 $_from = $_smarty_tpl->getVariable('scripts')->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
if ($_smarty_tpl->_count($_from) > 0){
    foreach ($_from as $_smarty_tpl->tpl_vars['items']->key => $_smarty_tpl->tpl_vars['items']->value){
 $_smarty_tpl->tpl_vars['script']->value = $_smarty_tpl->tpl_vars['items']->key;
?>
                <div id="box-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
"  class="GridBox ScriptGridBox"  onclick="scriptByName('<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
');" onmousemove="EXboxHover('box-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
','script','1','ScriptImg-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
')" onmouseout="boxHover('box-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
','script','0','ScriptImg-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
')">
                    <center>
                        <div name="IDlabel-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
" class="IDlabel">&nbsp;</div>
                        <img src="icons/pack.png" id=="ScriptImg-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
" width="32" height="32" border="0">
                        <div name="Namelabel-<?php echo $_smarty_tpl->tpl_vars['script']->value;?>
" class="Namelabel"><?php echo $_smarty_tpl->tpl_vars['script']->value;?>
</div>
                    </center>
                </div>
        <?php }} ?>
</div>

<div id="teleportGrid" style="float:clear;">
        <?php  $_smarty_tpl->tpl_vars['teleportDest'] = new Smarty_Variable;
 $_from = $_smarty_tpl->getVariable('teleportTargets')->value; if (!is_array($_from) && !is_object($_from)) { settype($_from, 'array');}
if ($_smarty_tpl->_count($_from) > 0){
    foreach ($_from as $_smarty_tpl->tpl_vars['teleportDest']->key => $_smarty_tpl->tpl_vars['teleportDest']->value){
?>
                <div id="box-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
"  class="GridBox TeleportGridBox" onclick="teleportByName('<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
');" onmousemove="EXboxHover('box-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
','teleport','1','TeleportImg-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
')" onmouseout="EXboxHover('box-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
','teleport','0','TeleportImg-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
')">
                <center>
                    <div name="IDlabel-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
" class="IDlabel">Teleport</div>
                    <img src="icons/gate.png" id=="TeleportImg-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
" width="32" height="32" border="0">
                    <div name="Namelabel-<?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
" class="Namelabel">to <?php echo $_smarty_tpl->tpl_vars['teleportDest']->value['name'];?>
</div>
                </center>
                </div>
        <?php }} ?>
</div>



<!-- ajax test code --->
<form name="sendScreen" id="sendScreen" action="?" method="post"> 
    <input type="hidden" name="do" id="STdo" value="giveItem"/> 
    <input type="hidden" name="user" id="STuser" value="nobody"/> 
    <input type="hidden" name="itemId" id="STitem" value="0"/>
    <input type="hidden" name="stackable" id="STstackable" value="0"/>
    <input type="hidden" name="amount" id="STamount" value="1"/>
    <input type="hidden" name="script" id="STscript" value="0"/>
    <input type="hidden" name="dst" id="STdst" value="0"/>     
</form>


<!--<hr>
<div id="debug" style="color:gray; font-size:10px;">
<strong>Debug Output</strong><br>
Facility name: <?php echo $_smarty_tpl->getVariable('facilityName')->value;?>
<br />
Connected users: <?php echo $_smarty_tpl->getVariable('userCountOnline')->value;?>
<br />
Return: <?php echo $_smarty_tpl->getVariable('return')->value;?>

-->

</body></html>
