//program start 
$(document).ready(function() {

    /* render dock
     $('#dock').Fisheye(
     {
     maxWidth: 50,
     items: 'a',
     itemsText: 'span',
     container: '.dock-container',
     itemWidth: 40,
     proximity: 90,
     halign : 'center'
     }
     );
     */


    renderMain();

    getItems();

    MaxLimitItems = 2048;

    $("#effect").hide();

    function renderMain() {
        console.log("renderbody");
        $('#body').append('<!--- dirty hack ---> \
<div class="minejs"><ul id="sortable" style="display: none;"></ul></div> \
    <div class="header"> \
            <div class="logo"> \
                <img src="https://oom.ch/img/oom60.png"> \
            </div> \
            <div class="navigation"> \
                <a href="http://mc.oom.ch/" target="_blank"> \
                <div id="navigationEntry">Home</div> \
                </a> \
                <div id="navigationEntry" onclick="showConsole();">Console</div> \
                <div id="navigationEntry" onclick="panelMap();">Map</div> \
                <div id="navigationEntry">Wiki</div> \
                <div id="navigationEntry"> \
                <a href="http://www.minecraft.net/game/" target="_blank"> \
                Minecraft \
                </a></div> \
            <div id="navigationEntry">Game</div> \
            <div id="effect" class="ui-widget-content ui-corner-all"> \
                <h3 class="ui-widget-header ui-corner-all">Show</h3> \
            <div id="inform"> \
                empty \
            </div> \
    </div> \
</div>');

        console.log("renderbody done")
    }

    function getItems() {
        $.getJSON('/items.json', function(data) {
            $('body').append('<div style="float:left;">total items: ' + data.length + '</div>');
            $.each(data, function(i, item) {
                drawItem(item.id, item.name, item.amount)
            });
            drawItem("9999", "paypal", "1")
        });
    }

    function drawItem(id, name, amount) {
        $('#sortable').append('<!--add item---> \
            <div id="GridBox" class="GridBox ItemGridBox"> \
            <div id="ctlMinus" class="ctlPlMi" onclick="calAmount(' + id + ' ,\'-'\)">-</div> \
            <div id="varAmount-\' + id +'" class="varAmountbox" DISABLED  onclick="actGiveItem(\' id + \')">' + amount + ' < /div> \
            <div id="ctlPlus" class="ctlPlMi" onclick="calAmount(\' \ id + '\',\'+\')">+</div> \
            <div name="IconLayer- \ id + '" onclick="actGiveItem(\' \ id + '\')" > \
                <div style="padding: 25% 29% 4% 29%;"> \
                    <img src="/icons/ \ id + '.png" id=="ItemImg- \ id + '" class="STicon" border="0"></div>
                \
                    <div name="Namelabel- \ id + '"  id="Namelabel- \ id + '" class="Namelabel">'+ name + '</div>
                </div>
            ');


            //register handlers
            //$("div.GridBox").hover(function () { $(this).effect("pulsate", { times:0 }, 2); });


            $(function() {
                $("#sortable").sortable({
                    revert: true,
                    snap: true,
                    grid: [ 100, 100 ],
                    opacity: 0.6,
                    dropOnEmpty: false,
                    receive: function(e, ui) {
                        console.log('dropped');
                    }

            });
            });


            }
            });

            function actGiveItem(id) {
                var amount = parseInt(parseFloat($('#varAmount- \ id).text()));
                console.log("DEBUG id is: " + id + " amount is: " + amount);
                inform("fade", "DEBUG id is: " + id + " amount is: " + amount);
                }

            function inform(effect, content) {
                // possible effects:    blind bounce clip drop explode fold highlight puff pulsate scale shake size slide
                console.log("DEBUG: " + effect);

                $('#inform').text(content);
                // most effect types need no options passed by default
                var options = {};
            // some effects have required parameters
            if (effect === "scale") {
                options = { percent: 100 };
            } else if (effect === "size") {
                options = { to: { width: 280, height: 185 } };
            }

            // run the effect
            $("#effect").show(effect, options, 500, callback);

            return false;


            //callback function to bring a hidden box back
            function callback() {
                setTimeout(function() {
                    $("#effect:visible").removeAttr("style").fadeOut();
                }, 300);
            }

            }


            function calAmount(id, action) {
                var calNum = parseInt(parseFloat($('#varAmount- \ id).text()));
                switch (action) {
                case '+':
                if (calNum == MaxLimitItems) {
                calNum = MaxLimitItems;
                } else if (calNum == 1) {
                calNum = calNum * 2
                } else if (calNum == MaxLimitItems || calNum > MaxLimitItems) {
                calNum = MaxLimitItems;
                } else if (calNum == 0) {
                calNum = 1;
                } else {
                calNum = calNum * 2;
                }
            break;
            case '-':
            if (calNum == MaxLimitItems || calNum
                < MaxLimitItems && calNum > 1) {
                    calNum = calNum / 2
                    } else if (calNum == 0) {
                    calNum = 1;
                    } else if (calNum > MaxLimitItems) {
                    calNum = MaxLimitItems;
                    } else {
                    calNum = calNum / 2;
                    }
                break;
                default:
                alert("Something went wrong in calAmount")
                }
                console.log("DEBUG id: " + id + " action: " + action + " calNum: " + calNum);
                $('#varAmount- \ id).text(Math.floor(calNum));
                }

                function panelMap() {

                    if ($("#sortable")) {
                    $("map").remove();
                    } else {
                    $('body').append('<div id="map" class="map"><iframe src="http://mc.oom.ch/map/#/67/64/110/-4/mcmapNormal" class="framer"></iframe></div>');
                    }

                }


                function panelConsole() {

                    alert("console")
                    /* if ($("#sortable")) {
                     $("map").remove();
                     } else {* /
                    //       $('body').append('<div id="map" class="map"><iframe src="http://mc.oom.ch/map/#/67/64/110/-4/mcmapNormal" class="framer"></iframe></div>');
                    //}};

                }
