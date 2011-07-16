
// Global socket
socket = null;

function initSocket() {
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
		if (data.action == 'userListChanged')
			updateUserList();
	});
}
