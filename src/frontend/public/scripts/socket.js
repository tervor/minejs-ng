
// Global socket
socket = null;


function initSocket() {
	if (socket == null) {
		console.log('initializing socket.io');
		socket = io.connect();
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
		chat.output('chat', data.user, data.text);
	});
	socket.on('console', function(data) {
		chat.output('console', null, data.text);
	});
	socket.on('monitor', function(data) {
		chat.output('monitor', null, data.text);
	});
	socket.on('users', function(data) {
		
	});
	socket.on('notify', function(data) {
		if (data.action == 'userListChanged')
			chat.updateUserList();
	});
}

function clientGive(name, count) {
	clientCommand('give', { name: name, count: count });
}

function clientStacks(name, count) {
	clientCommand('stacks', { name: name, count: count });
}

function clientCommand(cmd, args)
{
	args.cmd = cmd;
	socket.emit('command', args);
}