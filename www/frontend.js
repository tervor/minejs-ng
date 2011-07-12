//program start aaaaaaaaaaaaaaaaaaaaaaaaa
$(document).ready(function() {
    getItems()
    MaxLimitItems = 2048;

    function getItems() {
        //read available items
        $.getJSON('items.json', function(data) {
            $('body').append('<div>total items: ' + data.length + '</div>');
            //$('body').append('<div>total items: '+data.length+'</div>');
            $.each(data, function(i, item) {
                // Process your data here
                //alert(item.name)
                //$('body').append('<div>'+item.name+'</div>');
                drawItem(item.id, item.name, item.amount)
            });
        });
    }

    function drawItem(id, name, amount) {
        //   onmouseover="boxHover(\''+id+'\');" onmouseout="$(this)(\''+id+'\')"
        $('#sortable').append(' \
            <div id="GridBox" class="GridBox ItemGridBox"> \
            <div id="ctlMinus" class="ctlPlMi" onclick="IncDecMinus(\'IncDecInput-' + id + ')">-</div> \
            <div id="IncDecInput-' + id + '" value="' + amount + '" class="incdecinputbox"  \
            DISABLED  onclick="giveItemById(\'' + id + '\',\'' + amount + '\',\'IncDecInput-' + amount + '\')"></div> \
            <div id="ctlPlus" class="ctlPlMi" onclick="IncDecPlus(\'' + id + '\')">+</div> \
            <div name="IconLayer-' + id + '" onclick="giveItemById(\'' + id + '\',\'' + amount + '\',\'IncDecInput-' + id + '\')" > \
            <div style="padding: 25% 29% 4% 29%;"> \
            <img src="icons/' + id + '.pn" id=="ItemImg-' + id + '" class="STicon" border="0"></div> \
            <div name="Namelabel-' + id + '"  id="Namelabel-' + id + '" class="Namelabel">' + name + '</div></div> ');


        //register handlers
        //$("div.GridBox").hover(function () { $(this).effect("pulsate", { times:3 }, 2000); });
        //pulsate(this);

       /* $("div.GridBox").hover(function () {
            $(this).effect("pulsate", { times:3 }, 2000);
        });*/
        //pulsate(this);


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


function boxHover(nakedID) {
    document.getElementById("box-" + nakedID).setAttribute("class", "GridBox ItemGridBoxHover");
    document.getElementById("IncDecMinusButton-" + nakedID).setAttribute("class", "incdecbuttonboxHOVER");
    document.getElementById("IncDecPlusButton-" + nakedID).setAttribute("class", "incdecbuttonboxHOVER");


}

function boxNormal(nakedID) {

    document.getElementById("box-" + nakedID).setAttribute("class", "GridBox ItemGridBox");
    document.getElementById("IncDecMinusButton-" + nakedID).setAttribute("class", "incdecbuttonbox");
    document.getElementById("IncDecPlusButton-" + nakedID).setAttribute("class", "incdecbuttonbox");


}

function IncDecPlus(nackedID) {
    // var currentItemAmount = document.forms["FormName"].elements[inputBoxID].value;
    currentItemAmount = $('IncDecInput-' + nackedID).attr("value");


    var tmmmp = parseInt(parseFloat(currentItemAmount));

    if (tmmmp == MaxLimitItems) {
        tmmmp = MaxLimitItems;
    } else if (tmmmp == 1) {
        tmmmp = tmmmp * 2
    } else if (tmmmp == MaxLimitItems || tmmmp > MaxLimitItems) {
        tmmmp = MaxLimitItems;
    } else if (tmmmp == 0) {
        tmmmp = 1;
    } else {
        tmmmp = tmmmp * 2;
    }
    document.getElementById('IncDecInput-' + nackedID).setAttribute("value", Math.floor(tmmmp));
}


function IncDecMinus(nackedID) {

    //    var currentItemAmount = document.forms["FormName"].elements[inputBoxID].value;
    currentItemAmount = $('IncDecInput-' + nackedID).attr("value");


    var tmmmp = parseInt(parseFloat(currentItemAmount));

    if (tmmmp == MaxLimitItems || tmmmp < MaxLimitItems && tmmmp > 1) {
        tmmmp = tmmmp / 2
    } else if (tmmmp == 0) {
        tmmmp = 1;
    } else if (tmmmp > MaxLimitItems) {
        tmmmp = MaxLimitItems;
    } else {
        tmmmp = tmmmp / 2;
    }
    document.getElementById('IncDecInput-' + nackedID).setAttribute("value", Math.floor(tmmmp));
}

