
var spawn = require('child_process').spawn;
var events = require('events');
var util = require('util');

var config = require('config').config;


// The MCServer class implements a wrapper around the minecraft server.
// The following events are emitted by this class:
// 'exit' - when the server was terminated by the user (using stop())
// 'user_connect' (user) - when a user has connected to the minecraft server
// 'user_disconnect' (user) - when a user has disconnected from the minecraft server
// 'user_chat' (user, text) - when a user has typed a chat message
// 'user_cmd' (user, text) - when a user has typed an unknown command
function MCServer() {
	// Call super constructor
	events.EventEmitter.call(this);
	
	this.reset();
}

util.inherits(MCServer, events.EventEmitter);


// List of handlers to be called when a line in the server log matches the regular expression.
// Make sure that a handler function of type log_handler_xxx(args) with the same name actually
// exists in this class for every registered log handler.
MCServer.prototype.log_handlers = {
	log_handler_connect: ".*\\[INFO\\] (.*) \\[.*\\] logged in with entity id \\d+ at .*",
	log_handler_disconnect: ".*\\[INFO\\] (.*) lost connection:.*",
	log_handler_user_chat: ".*\\[INFO\\] <(.*)> (.*)",
	log_handler_user_cmd: ".*\\[INFO\\] (.*) (issued server command|tried command): (.*)",
	log_handler_save_complete: ".*\\[INFO\\] CONSOLE: Save complete\.",
}

// Resets the internals (user list etc.)
MCServer.prototype.reset = function() {
	this.recv = "";
	this.users = [];
	this.running = false;
	this.terminate = false;
	this.stats_minejs = "";
	this.stats_mcserver = "";
}

// Starts the minecraft server
MCServer.prototype.start = function() {
	if (this.running)
		return;

	this.reset();
	this.running = true;

	var args = config.server.java_args.concat(['-jar', config.server.jar]).concat(config.server.server_args);
	log.info('Starting minecraft server with: ' + config.server.java + ' ' + args.join(' '));

	// Spawn the child process
	this.process = spawn(config.server.java, args, { cwd: config.server.dir });

	// Read from STDIN and STDERR
	this.process.stdout.on('data', function(data) {
		this.receive(data);
	}.bind(this));
	this.process.stderr.on('data', function(data) {
		this.receive(data);
	}.bind(this));

	// Check for exit
	this.process.on('exit', function(code) {
		this.running = false;
	    log.info("Minecraft server terminated (code=" + code + ")");
		if (this.terminate) {
			// Server terminated on user request
			this.emit('exit');
		} else {
			// Server terminated unexpectedly -> restart
			log.info("Minecraft server terminated unexpectedly -> restarting server");
			this.start();
		}
	}.bind(this));

	// Spawn monitor task
	setInterval(function() {
		this.update_monitoring();
	}.bind(this), 5000);
}

// Stops the minecraft server
MCServer.prototype.stop = function() {
	if (!this.running)
		return;
		
	log.info('Stopping minecraft server');
	this.running = false;
	this.terminate = true;
	this.process.stdin.write("\nstop\n");
}
	
// Restarts the minecraft server
MCServer.prototype.restart = function() {
	if (!this.running)
		return;
		
	log.info('Restarting minecraft server');
	this.running = false;
	this.process.stdin.write("\nstop\n");
}

// Minecraft server native commands -----------------------------------------

// Commands not yet implemented/obsolete:
// help, stop, save-all, save-off, save-on, list, time

MCServer.prototype.kick = function(user) {
	this.send_cmd(['kick', user]);
}

MCServer.prototype.ban = function(user) {
	this.send_cmd(['ban', user]);
}

MCServer.prototype.pardon = function(user) {
	this.send_cmd(['pardon', user]);
}

MCServer.prototype.ban_ip = function(user) {
	this.send_cmd(['ban-ip', user]);
}

MCServer.prototype.pardon_ip = function(user) {
	this.send_cmd(['pardon-ip', user]);
}

MCServer.prototype.op = function(user) {
	this.send_cmd(['op', user]);
}

MCServer.prototype.deop = function(user) {
	this.send_cmd(['deop', user]);
}

MCServer.prototype.tp = function(user1, user2) {
	this.send_cmd(['tp', user1, user2]);
}

MCServer.prototype.give = function(user, id, num) {
	this.send_cmd(['give', user, id, num]);
}

MCServer.prototype.tell = function(user, text) {
	this.send_cmd(['tell', user, text]);
}

MCServer.prototype.say = function(text) {
	this.send_cmd(['say', text]);
}

MCServer.prototype.save_all = function() {
	this.send_cmd(['save-all']);
}

MCServer.prototype.save_off = function() {
	this.send_cmd(['save-off']);
}

MCServer.prototype.save_on = function() {
	this.send_cmd(['save-on']);
}



// Implementation -----------------------------------------------------------

// Called regularly to collect monitoring information
MCServer.prototype.update_monitoring = function() {
	this.stats_minejs = util.inspect(process.memoryUsage());
	this.stats_mcserver = "";
	var jstat = spawn('/bin/sh', ['-c', 'jstat -gcutil ' + this.process.pid]); 
	jstat.stdout.on('data', function(data) {
		this.stats_mcserver += data.toString('ascii');
	}.bind(this));
	jstat.on('exit', function(code) {
		// nothing
	}.bind(this));
}
	
// Called for every chunk of data received from the server's STDOUT and STDERR
MCServer.prototype.receive = function(data) {
	for (var i = 0; i < data.length; i++) {
		var c = data.toString('ascii', i, i + 1);
		if (c == '\n') {
			this.receive_line(this.recv);
			this.recv = "";
		} else
			this.recv += c;
	}
}

// Called for every new received line from the server's STDOUT and STDERR
MCServer.prototype.receive_line = function(line) {
	this.emit('data', this.recv);
	
	// Check log handlers for matches
	for (handler in this.log_handlers) {
		var m = this.recv.match(this.log_handlers[handler]);
		if (m) {
			var args = m.splice(1, m.length - 1);
			this[handler](args);
		}
	}
}
	
// Log output handlers ------------------------------------------------------
	
MCServer.prototype.log_handler_connect = function(args) {
	var user = args[0];
	this.users.push(user);
	this.emit('user_connect', user);
}

MCServer.prototype.log_handler_disconnect = function(args) {
	var user = args[0];
	this.users.splice(this.users.indexOf(user), 1);
	this.emit('user_disconnect', user);
}

MCServer.prototype.log_handler_user_chat = function(args) {
	this.emit('user_chat', args[0], args[1]);
}

MCServer.prototype.log_handler_user_cmd = function(args) {
	this.emit('user_cmd', args[0], args[2]);
}

MCServer.prototype.log_handler_save_complete = function(args) {
	this.emit('save_complete');
}

// Implementation -----------------------------------------------------------

MCServer.prototype.send_cmd = function(args) {
	if (!this.running)
		return;
	this.process.stdin.write(args.join(' ') + '\n');
}



// Creates a minecraft server
function createMCServer() {
	return new MCServer();
}

module.exports.createMCServer = createMCServer;
