

function initChat() {
	$('#chat_input').keypress(function(e) {
		if (e.which == 13) {
			var input = $('#chat_input');
			var text = input.val().toString();
			if (text.length > 200)
				text = text.substr(0, 200);
			if (text.length > 0) {
				chatWrite(config.user, text);
				socket.emit('chat', { text: text});
				input.val('');
				
			}
		}
	});
}

function chatWrite(user, text) {
	var element = $('#chat_output');
	element.html(element.html() + '<b>' + user + '</b> ' + text + "<br/>");
	element.attr({ scrollTop: element.attr("scrollHeight") });
}
