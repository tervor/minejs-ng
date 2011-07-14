
var socket = null;

window.onload =function() {
	if (socket == null)
		socket = io.connect('http://localhost:9000');
	socket.on('news', function (data) {
		console.log(data);
		socket.emit('my other event', { my: 'data' });
	});
	
	$('#chat_input').keypress(function(e) {
		if (e.which == 13) {
			text = $('#chat_input');
			socket.emit('chat', { text: text.val() });
			text.val('');
		}
	});
}
