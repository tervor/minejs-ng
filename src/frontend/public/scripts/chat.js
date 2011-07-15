
var socket = null;

function chatWrite(user, text) {
	var element = $('#chat_output');
	element.html(element.html() + '<b>' + user + '</b> ' + text + "<br/>");
	element.attr({ scrollTop: element.attr("scrollHeight") });
}

$(document).ready(function() {
	if (socket == null) {
		socket = io.connect(config.host);
	}
	socket.on('connect', function(data) {
		console.log('connected to ' + config.host + ' via socket.io');
		console.log('sid = ' + config.sid);
		socket.emit('sid', { sid: config.sid });
	});
	socket.on('accept', function(data) {
		console.log('connection accepted');
	});
	socket.on('deny', function(data) {
		console.log('connection denied');
	});
	socket.on('chat', function(data) {
		chatWrite(data.user, data.text);
	});
	
	$('#chat_input').keypress(function(e) {
		if (e.which == 13) {
			var input = $('#chat_input');
			var text = input.val().toString();
			chatWrite(config.user, text);
			socket.emit('chat', { text: text});
			input.val('');
		}
	});
});
