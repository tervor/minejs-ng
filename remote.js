/* Minecraft Screen Tool JS Kungfu
 6.2011 by escii
 7.2011 migration to mineJS - escii
*/


/*KISTE #3456*/
/*HALBES INV #1152*/
MaxLimitItems = 2048;


function IncDecPlus(inputBoxID) {
    var currentItemAmount = document.forms["FormName"].elements[inputBoxID].value;
    var tmmmp = parseInt(parseFloat(currentItemAmount));
    
    if (tmmmp == MaxLimitItems) {
        tmmmp = MaxLimitItems;
    } else if (tmmmp == 1) {
        tmmmp = tmmmp*2
    } else if (tmmmp == MaxLimitItems || tmmmp > MaxLimitItems  ) {
        tmmmp = MaxLimitItems;
    } else if (tmmmp == 0) {
        tmmmp=1;
    } else {
        tmmmp = tmmmp*2;
    };
    document.getElementById(inputBoxID).setAttribute("value",Math.floor(tmmmp));
};


function IncDecMinus(inputBoxID) {
    var currentItemAmount = document.forms["FormName"].elements[inputBoxID].value;
    var tmmmp = parseInt(parseFloat(currentItemAmount));
    
    if (tmmmp == MaxLimitItems  ||  tmmmp < MaxLimitItems && tmmmp > 1) {
        tmmmp = tmmmp/2
    } else if (tmmmp == 0) {
        tmmmp = 1;
    } else if (tmmmp > MaxLimitItems) {
        tmmmp = MaxLimitItems;
    } else {
        tmmmp = tmmmp/2;
    };
    document.getElementById(inputBoxID).setAttribute("value",Math.floor(tmmmp));
};


function boxHover(nakedID) {
                document.getElementById("box-"+nakedID).setAttribute("class", "GridBox ItemGridBoxHover");
                document.getElementById("IncDecMinusButton-"+nakedID).setAttribute("class","incdecbuttonboxHOVER");
                document.getElementById("IncDecPlusButton-"+nakedID).setAttribute("class","incdecbuttonboxHOVER");
                
                
};

function boxNormal(nakedID) {
                document.getElementById("box-"+nakedID).setAttribute("class", "GridBox ItemGridBox");
                document.getElementById("IncDecMinusButton-"+nakedID).setAttribute("class","incdecbuttonbox");
                document.getElementById("IncDecPlusButton-"+nakedID).setAttribute("class","incdecbuttonbox");
                
                
};

function EXboxHover(boxID,boxType,boxFlag,imgID,inputBoxID,nakedID) {
   switch (boxType) {
      case "item":
          switch (boxFlag) {
              case "0":
                document.getElementById(boxID).setAttribute("class","GridBox ItemGridBox");
            document.getElementById("IncDecMinusButton-"+nakedID).setAttribute("class","incdecbuttonbox");
                document.getElementById("IncDecPlusButton-"+nakedID).setAttribute("class","incdecbuttonbox");
                
                
                
                //*document.getElementById(inputBoxID).style.visibility='hidden';
                    /*document.getElementById($(imgID)).setAttribute("class","STicon");*/
                break;
              case "1":
                document.getElementById(boxID).setAttribute("class", "GridBox ItemGridBoxHover");
                //*document.getElementById(inputBoxID).style.visibility='visible';
       document.getElementById("IncDecMinusButton-"+nakedID).setAttribute("class","incdecbuttonboxHOVER");
                document.getElementById("IncDecPlusButton-"+nakedID).setAttribute("class","incdecbuttonboxHOVER");
                    /*document.getElementById($(imgID)).setAttribute("class", "STiconHover");*/
                break;
              default:
                    alert("Eyecandy error! Report to the Admins! if occurs often.");
                break;
            }
        break;
      case "script":
           switch (boxFlag) {
              case "0":
                document.getElementById(boxID).setAttribute("class","GridBox ScriptGridBox");
                /*document.getElementById(imgID).setAttribute("class","STicon");*/
                break;
              case "1":
                document.getElementById(boxID).setAttribute("class","GridBox ScriptGridBoxHover");
                /*document.getElementById(imgID).setAttribute("class","STiconHover");*/
                break;
              default:
                alert("Eyecandy error! Report to the Admins! if occurs often.");
                break;
            }
        break;
      case "teleport":
           switch (boxFlag) {
              case "0":
                document.getElementById(boxID).setAttribute("class","GridBox TeleportGridBox");
                /*document.getElementById(imgID).setAttribute("class","STicon");*/
                break;
              case "1":
                document.getElementById(boxID).setAttribute("class","GridBox TeleportGridBoxHover");
                /*document.getElementById(imgID).setAttribute("class","STiconHover");*/
                break;
              default:
                alert("Eyecandy error! Report to the Admins! if occurs often.");
                break;
            }
        break;
      default:
        alert("Eyecandy error! Report to the Admins! if occurs often.");
        break;
    }  
  


}


function giveItemById(itemID,itemStackable,inputBoxID) {
    var currentItemAmount = document.forms["FormName"].elements[inputBoxID].value; /*prompt("Menge? (1-512)","")*/;
    
    document.getElementById('STdo').value =  "giveItem";
    document.getElementById('STuser').value =  document.getElementById('STuserlist').value;
    document.getElementById('STitem').value =  itemID;
    document.getElementById('STamount').value =  currentItemAmount;
    document.getElementById('STscript').value =  "";
    document.getElementById('STstackable').value = itemStackable;
    sendForm();
};

function teleportByName(teleportToUser) {
    document.getElementById('STdo').value =  "teleport";
    document.getElementById('STuser').value =  document.getElementById('STuserlist').value;
    document.getElementById('STdst').value =  teleportToUser;
    sendForm();
};

function scriptByName(scritpName) {
    document.getElementById('STdo').value =  "runScript";
    document.getElementById('STuser').value =  document.getElementById('STuserlist').value;
    document.getElementById('STscript').value = scritpName;
    sendForm();
};   

function sendForm() {
    delivItem =  document.getElementById('STitem').value 
    delivAmount =  document.getElementById('STamount').value 
    delivUser =  document.getElementById('STuserlist').value
    /*document.sendScreen.submit();*/
     document.getElementById('STatus').innerHTML = "Auftrag wird ausgeführt! ..einen klitze kleine moment bitte..."
     document.getElementById('STatus').style.color = "yellow"
	new Ajax.Request('http://mc.oom.ch/mcremote/index.php', {
		parameters: $('sendScreen').serialize(true),
			onFailure: function(){ 
			alert('Something went wrong') ;
		},
		onSuccess:  function(){ 
	
		},
		onComplete: function(ruessel) {
            var currentTime = new Date()
            var hours = currentTime.getHours()
            var minutes = currentTime.getMinutes()
            var seconds = currentTime.getSeconds()

            document.getElementById('STatus').innerHTML = delivAmount + " ID: " + delivItem + " an " + delivUser + " ausgeliefert um " + hours + " Uhr " + minutes + "min. " + seconds + "sec." ; 
            setTimeout('', 1000);
		}
	});
}


function setCookie(c_name,value,exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=c_name + "=" + c_value;

}

function getCookie(c_name) {
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++) {
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name) {
            return unescape(y);
        }
    }
}

function checkCookie() {
    var username=getCookie("username");
    if (username!=null && username!="") {
        document.getElementById('STuser').value =  username;
        document.getElementById('STuserlist').value = username;
    } else {
        username=prompt("Dein Minecraft Benutzername:","");
        if (username!=null && username!="") {
            setCookie("username",username,365);
        }
        document.getElementById('STuser').value =  username;
        document.getElementById('STuserlist').value = username;
    }
} 

function changeUsername() {
    newUsername=document.getElementById('STuserlist').value;
    setCookie("username",newUsername,365);
};






function randomSpam() {
	//*setTimeout('', 1000);
            var spam = new Array ();
spam[0] = "Expect Bugs and ERRORS! this tool is under heavy development =P";
spam[1] = "Help us to keep our Server online guys!>";
spam[2] = "La Grande Arche de la D&eacute;fense";
spam[3] = "What do you want to build today?";
spam[4] = "Nice to see you again m8!";
spam[5] = "..hee bssshht! Einstein RockZZz! ";
spam[6] = "Don't look at the Bugs first!'";
spam[7] = "Ich bin auch ein Tram";
spam[8] = "....sssssssssssSSsssssSSs..OOM!!!";
spam[9] = "*Give me a Cookie!*";
spam[10] = "O_x omg! we got Twintowers";
spam[11] = "PUSH THE BUTTON!";
spam[12] = "Colosseum Bauarbeiter immer nocht vermisst!";
spam[13] = "exotische Setzlinge und Zierh&ouml;lzer @ Tom&prime;s Arboretum zum selber hacken!";
spam[14] = "time for a competition?";
spam[15] = "&real;&spades;&part;&clubs;&sum;&hearts;&prod;&alefsym;&diams; 	";
spam[16] = "Neuer Spawnpunkt im bau... :)";
spam[17] = "these aren't the droids you're looking for";
spam[18] = "Apartmets for Rent ats WTC Gold and Diamond Tower";
spam[19] = "Have you ever been to Spheresville?";
spam[20] = "Kroklokwafzi? Semememi! Seiokrontro - prafriplo: Bifzi, bafzi; hulalemi: quasti basti bo...";
spam[21] = "Did you ever jam with our Stepsequencers?";
spam[22] = "What did the miner do when he heard a faint sssssss....";
spam[23] = "What a nice HousssssSsssSSssSSSsSSSSSSSSSe!";
spam[24] = "Break on through to the other side!";
spam[25] = "1.7 released!";
spam[26] = "Meet us at the Waldrock Open-Air (29./30. Juli 2011)";
spam[27] = "Meet Miners at the NetGame Convention (2011)";
spam[28] = "Pistons are now available";
spam[29] = "Voxelman live at Stepsequencer in Soundgarden";


var i = Math.floor((spam.length)*Math.random())
    document.getElementById('STatus').innerHTML = spam[i] ;  
}


/*


function pulsingtext()
var j=5;
var step=2;
var col1="silver";
var col2="DARKSLATEGRAY";
var tmp;

{
 document.all.txt1.innerHTML="<span style='font-size:"+j+"px;color:"+col1+";'>Pulsing text</span>";
 document.all.txt2.innerHTML="<span style='font-size:"+(105-j)+"px;color:"+col2+"'>Pulsing text</span>";
 j+=step;
 if (j>100 || j<5) {step=-step;tmp=col1;col1=col2;col2=tmp;}
 setTimeout("pulsingtext()",60);
}

pulsingtext();





 */
 
 var Pulser = function (){

    if ($(this).val() == "") {
        $(this).pulse({ backgroundColors: ['#ffffee', '#fff'] });
    }
    else {
        $(this).css({'background-color': '#fff'}).stop();
    } }
    
    
    
    


function getInternetExplorerVersion()
// Returns the version of Internet Explorer or a -1
// (indicating the use of another browser).
{
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

function checkVersion()
{
  var msg = "You're not using Internet Explorer.";
  var ver = getInternetExplorerVersion();

  if ( ver > -1 )
  {
    if ( ver >= 8.0 ) 
      alert("You're using a recent copy of Internet Explorer. This site is not supporting Internet Explorer, some things may not work, please try with another browser.");
    else
      msg = "You should upgrade your copy of Internet Explorer. This site is not supporting Internet Explorer, some things may not work, please try with another browser.";
  } else {
    msg = "not an IE client"
  }
  
}
 



    
  function init() {
checkVersion()

    checkCookie();
randomSpam()
/*
$("STatus").click(function () { $(this).effect("pulsate", { times:3 }, 2000); }); 
*/
}; 



