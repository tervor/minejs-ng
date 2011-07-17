function initChat() {

    $(document.body).keypress(function(e) {
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
        }
		console.log("key hit detected")
		if ($("#chat").is(":hidden")) {
			$("#chat").show();
			$('#chatinput').focus();
		}

    });

    $('#chattitle').click(function () {
        $("#chat").hide();
    });

    $('#chattrigger').hover(function() {
		console.log("chattrigger hover");
        $("#chat").show();
    });

    $('#chatinput').blur(function() {
        $('#chat').hide();
    });

    $('#chainput').focus();
    $('#chat')
        .draggable({ handle: "div.chattitle" })
        .resizable({ grid: [50, 50] })
		.hover(
			function () {
				$(this).show();
			},
  			function () {
				$(this).hide();
			}
		);
}

function chatWrite(user, text) {
    var element = $('#chatoutput');
    element.html(element.html() + '<b>' + user + '</b> ' + text + "<br/>");
    element.attr({ scrollTop: element.attr("scrollHeight") });
}
