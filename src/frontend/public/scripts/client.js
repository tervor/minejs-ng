
client = null;

// Class to wrap the socket.io client
function Client() {
	client = this;
	this.notifyHandlers = {};
	
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
	
	this.socket.on('notify', function(data) {
		var action = data.action;
		if (client.notifyHandlers.hasOwnProperty(action)) {
			var handlers = client.notifyHandlers[action];
			for (i = 0; i < handlers.length; i++)
				handlers[i]();
		}
	});
}

Client.prototype.on = function(event, callback) {
	this.socket.on(event, callback);
}

Client.prototype.emit = function(event, data) {
	this.socket.emit(event, data);
}

Client.prototype.onNotify = function(action, callback) {
	if (!this.notifyHandlers.hasOwnProperty(action))
		this.notifyHandlers[action] = [];
	this.notifyHandlers[action].push(callback);
}

Client.prototype.give = function(name, count) {
	this.command('give', { name: name, count: count });
}

Client.prototype.kit = function(name) {
	this.command('kit', { name: name });
}

Client.prototype.stacks = function(name, count) {
	this.command('stacks', { name: name, count: count });
}

Client.prototype.tp = function(target) {
	this.command('tp', { target: target });
}

Client.prototype.command = function(cmd, args) {
	args.cmd = cmd;
	this.socket.emit('command', args);
}
