function initChat() {
    $('#chatinput').keypress(function(e) {
        if (e.which == 13) {
            var input = $('#chatinput');
            var text = input.val().toString();
            if (text.length > 200)
                text = text.substr(0, 200);
            if (text.length > 0) {
                chatWrite(config.user, text);
                socket.emit('chat', { text: text});
                input.val('');

            }
            if ($("#chat").is(":hidden")) {
                $("#chat").show();
                $('#chatinput').focus();
            }
        }
    });

    $('#chattitle').click(function () {
        $("#chat").hide();
    });

    $('#chattrigger').hover(function() {
        $("#chat").show();
    });

    $('#chatinput').blur(function() {
        $('#chat').hide();
    });

    $('#chainput').focus();
    $('#chat')
        .draggable()
        .resizable({ grid: [50, 50] });
}

function chatWrite(user, text) {
    var element = $('#chatoutput');
    element.html(element.html() + '<b>' + user + '</b> ' + text + "<br/>");
    element.attr({ scrollTop: element.attr("scrollHeight") });
}
