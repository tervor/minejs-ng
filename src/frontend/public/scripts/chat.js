
var socket = null;

function chatWrite(user, text) {
	var element = $('#chat_output');
	element.html(element.html() + '<b>' + user + '</b> ' + text + "<br/>");
	element.attr({ scrollTop: element.attr("scrollHeight") });
}

function updateUserList() {
	$.getJSON('/users.json', function(data) {
		console.log('JSON success');
		console.log(data);
		var html = [];
		$.each(data, function(key, user) {
			html += user.name;
			if (user.isFrontend)
				html += ' [frontend]';
			if (user.isPlaying)
				html += ' [playing]';
			html += '<br/>'
		});
		$('#userlist').html(html);
	});
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
	socket.on('users', function(data) {
		
	});
	socket.on('notify', function(data) {
		if (data.action == 'updateUserList')
			updateUserList();
	});
	
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
	
	updateUserList();
	
	
});
