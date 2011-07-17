$(document).ready(function() {
		
    initSocket();
    initChat();
    initDashboard();

    updateUserList();
    updateItemList();

    getItems();

    //TODO backend should send this at index.jason query
    MaxLimitItems = 2048;

    //hide yellow news feed phrase
    $("#effect").hide();

/* $(document.body).keypress(function(e) {
           if (e.which == 13) {
            console.log("11111")
         if (text.length > 200)
            console.log("2222")
         if (text.length > 0) {
            console.log("333333")}}
    }); */



    $('#sortable').click(function () {
        $("#chat").hide();
    });



    function switchPanel(p) {
        switch (p) {
            case 'map':
                if ($("#sortable")) {
                    $("map").remove();
                } else {
                    $('body').append('<div id="map" class="map"><iframe src="http://mc.oom.ch/map/#/67/64/110/-4/mcmapNormal" class="framer"></iframe></div>');
                }
                break;
            case 'dashboard':

                break;
            case 'home':

                break;
            case 'chat':

                break;
            default:
                alert("Something went wrong in calAmount")
        }
    }
});

//out of jQuery.ready functions.
function notify(effect, content) {
    // possible effects:    blind bounce clip drop explode fold highlight puff pulsate scale shake size slide
    console.log("DEBUG: " + effect);

    $('#notify').text(content);
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
