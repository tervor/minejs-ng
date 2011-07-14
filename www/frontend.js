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

    getItems();
    MaxLimitItems = 2048;
    $("#effect").hide();
    function getItems() {
        //read available items
        $.getJSON('items.json', function(data) {
            $('body').append('<div style="float:left;">total items: ' + data.length + '</div>');
            //$('body').append('<div>total items: '+data.length+'</div>');
            $.each(data, function(i, item) {
                // Process your data here
                //alert(item.name)
                //$('body').append('<div>'+item.name+'</div>');
                drawItem(item.id, item.name, item.amount)
            });
            drawItem("9999", "paypal", "1")
        });
    }

    function drawItem(id, name, amount) {
        $('#sortable').append(' \
            <div id="GridBox" class="GridBox ItemGridBox"> \
            <div id="ctlMinus" class="ctlPlMi" onclick="calAmount(\'' + id + '\',\'-\')">-</div> \
            <div id="varAmount-' + id + '" class="varAmountbox" DISABLED  onclick="actGiveItem(\'' + id + '\')">' + amount + '</div> \
            <div id="ctlPlus" class="ctlPlMi" onclick="calAmount(\'' + id + '\',\'+\')">+</div> \
            <div name="IconLayer-' + id + '" onclick="actGiveItem(\'' + id + '\')" > \
            <div style="padding: 25% 29% 4% 29%;"> \
            <img src="icons/' + id + '.pn" id=="ItemImg-' + id + '" class="STicon" border="0"></div> \
            <div name="Namelabel-' + id + '"  id="Namelabel-' + id + '" class="Namelabel">' + name + '</div></div> ');


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
    var amount = parseInt(parseFloat($('#varAmount-' + id).text()));
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
    var calNum = parseInt(parseFloat($('#varAmount-' + id).text()));
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
            if (calNum == MaxLimitItems || calNum < MaxLimitItems && calNum > 1) {
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
    $('#varAmount-' + id).text(Math.floor(calNum));
}

