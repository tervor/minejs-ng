
client = null;


function initClient() {
	client = new Client();
}

// Class to wrap the socket.io client
function Client() {
	console.log('initializing socket.io');
	this.socket = io.connect();
	
	// Connection events
	this.socket.on('connect', function(data) {
		client.socket.emit('sid', { sid: config.sid });
	});
	this.socket.on('accept', function(data) {
		console.log('connection accepted');
	});
	this.socket.on('deny', function(data) {
		console.log('connection denied');
	});
	
	// TODO this needs to be generic
	this.socket.on('notify', function(data) {
		if (data.action == 'userListChanged')
			chat.updateUserList();
	});
}

Client.prototype.on = function(event, callback) {
	this.socket.on(event, callback);
}

Client.prototype.emit = function(event, data) {
	this.socket.emit(event, data);
}

Client.prototype.give = function(name, count) {
	this.command('give', { name: name, count: count });
}

Client.prototype.stacks = function(name, count) {
	this.command('stacks', { name: name, count: count });
}

Client.prototype.command = function(cmd, args) {
	args.cmd = cmd;
	this.socket.emit('command', args);
}
