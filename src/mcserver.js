
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var events = require('events');
var util = require('util');
var fs = require('fs');
var path = require('path');

var nbt = require('nbt');

var config = require('config').config;


// The MCServer class implements a wrapper around the minecraft server.
// The following events are emitted by this class:
// 'exit' - when the server was terminated by the user (using stop())
// 'connect' (username) - when a user has connected to the minecraft server
// 'disconnect' (username) - when a user has disconnected from the minecraft server
// 'chat' (username, text) - when a user has typed a chat message
// 'cmd' (username, text) - when a user has typed an unknown command
// 'saved' - when the world has been saved
function MCServer() {
	// Call super constructor
	events.EventEmitter.call(this);
	
	this.reset();
}

util.inherits(MCServer, events.EventEmitter);


// List of handlers to be called when a line in the server log matches the regular expression.
// Make sure that a handler function of type logHandlerXXX(args) with the same name actually
// exists in this class for every registered log handler.
MCServer.prototype.logHandlers = {
	logHandlerConnect: 		".*\\[INFO\\] (.*) \\[.*\\] logged in with entity id \\d+ at .*",
	logHandlerDisconnect: 	".*\\[INFO\\] (.*) lost connection:.*",
	logHandlerChat: 		".*\\[INFO\\] <(.*)> (.*)",
	logHandlerCmd: 			".*\\[INFO\\] (.*) (issued server command|tried command): (.*)",
	logHandlerSaved: 		".*\\[INFO\\] CONSOLE: Save complete\.",
}

// Resets the internals (user list etc.)
MCServer.prototype.reset = function() {
	this.receiveBuf = "";
	this.users = [];
	this.running = false;
	this.terminate = false;
	this.serverStatus = {};
}

// Starts the minecraft server
MCServer.prototype.start = function() {
	if (this.running)
		return;

	this.reset();
	this.running = true;

	var args = config.server.javaArgs.concat(['-jar', config.server.jar]).concat(config.server.serverArgs);
	var cmdline = config.server.java + ' ' + args.join(' ');
	log.info('Starting minecraft server with: ' + cmdline);
	// Stop any minecraft server running with same command line
	exec('ps', function(error, stdout, stderr) {
		if (error) {
			log.warn('failed to check for running minecraft server (error code:' + error.code + ')');
		} else {
			var lines = stdout.split('\n');
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				var m = line.match('([0-9]*) .* ' + cmdline.replace('.', '\.') + '.*');
				if (m) {
					log.info('Killing zombie minecraft server with pid ' + m[1]);
					process.kill(m[1], 'SIGTERM');
				}
			}
		}
		
		// Spawn the child process
		this.process = spawn(config.server.java, args, { cwd: config.server.dir });

		// Read player infos
		this.readPlayerInfos();

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
	}.bind(this));

	// Spawn monitor task
	setInterval(function() {
		this.updateMonitoring();
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
// help, stop, list, time

MCServer.prototype.kick = function(username) {
	if (this.users.has(username))
		this.sendCmd(['kick', username]);
}

MCServer.prototype.ban = function(username) {
	if (this.users.has(username))
		this.sendCmd(['ban', username]);
}

MCServer.prototype.pardon = function(username) {
	if (this.users.has(username))
		this.sendCmd(['pardon', username]);
}

MCServer.prototype.banIP = function(username) {
	if (this.users.has(username))
		this.sendCmd(['ban-ip', username]);
}

MCServer.prototype.pardonIP = function(username) {
	if (this.users.has(username))
		this.sendCmd(['pardon-ip', username]);
}

MCServer.prototype.op = function(username) {
	if (this.users.has(username))
		this.sendCmd(['op', username]);
}

MCServer.prototype.deop = function(username) {
	if (this.users.has(username))
		this.sendCmd(['deop', username]);
}

MCServer.prototype.tp = function(username1, username2) {
	if (this.users.has(username1) && this.users.has(username2))
		this.sendCmd(['tp', username1, username2]);
}

MCServer.prototype.give = function(username, id, num) {
	if (this.users.has(username))
		this.sendCmd(['give', username, id, num]);
}

MCServer.prototype.tell = function(username, text) {
	if (this.users.has(username))
		this.sendCmd(['tell', username, text]);
}

MCServer.prototype.say = function(text) {
	this.sendCmd(['say', text]);
}

MCServer.prototype.saveAll = function() {
	this.sendCmd(['save-all']);
}

MCServer.prototype.saveOff = function() {
	this.sendCmd(['save-off']);
}

MCServer.prototype.saveOn = function() {
	this.sendCmd(['save-on']);
}

// Implementation -----------------------------------------------------------

// Called regularly to collect monitoring information
MCServer.prototype.updateMonitoring = function() {
	var usage = process.memoryUsage();
	this.serverStatus.minejsHeapTotal = usage.heapTotal;
	this.serverStatus.minejsHeapUsed = usage.heapUsed;
	var jstat = spawn('/bin/sh', ['-c', 'jstat -gcutil ' + this.process.pid]); 
	jstat.stdout.on('data', function(data) {
		// TODO parse and add to this.serverStatus
		// this.statsMCServer += data.toString('ascii');
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
			this.receiveLine(this.receiveBuf);
			this.receiveBuf = '';
		} else {
			this.receiveBuf += c;
		}
	}
}

// Called for every new received line from the server's STDOUT and STDERR
MCServer.prototype.receiveLine = function(line) {
	this.emit('data', line);
	
	// Check log handlers for matches
	for (handler in this.logHandlers) {
		var m = line.match(this.logHandlers[handler]);
		if (m) {
			var args = m.splice(1, m.length - 1);
			this[handler](args);
		}
	}
}
	
// Log output handlers ------------------------------------------------------
	
MCServer.prototype.logHandlerConnect = function(args) {
	var username = args[0];
	if (!this.users.has(username))
		this.users.push(username);
	this.emit('connect', username);
}

MCServer.prototype.logHandlerDisconnect = function(args) {
	var username = args[0];
	this.users.splice(this.users.indexOf(username), 1);
	this.emit('disconnect', username);
}

MCServer.prototype.logHandlerChat = function(args) {
	this.emit('chat', args[0], args[1]);
}

MCServer.prototype.logHandlerCmd = function(args) {
	this.emit('cmd', args[0], args[2]);
}

MCServer.prototype.logHandlerSaved = function(args) {
	this.emit('saved');
	this.readPlayerInfos();
}

// Implementation -----------------------------------------------------------

MCServer.prototype.sendCmd = function(args) {
	if (!this.running)
		return;
	this.process.stdin.write(args.join(' ') + '\n');
}

// Reads all player.dat files
MCServer.prototype.readPlayerInfos = function() {
	// TODO get from server properties
	var world = 'world';
	var playerDir = config.server.dir + '/' + world + '/players/';
	// Go through all files in the player directory
	fs.readdir(playerDir, function(error, files) {
		if (!files) {
			log.warning('Cannot read from players directory in ' + playerDir);
			return;
		}
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			// Skip _tmp_.dat file
			if (file == '_tmp_.dat')
				continue;
			(function() {
				// Check if user exists
				var username = files[i].substr(0, files[i].length - 4);
				// Read NBT file
				fs.readFile(playerDir + file, function(error, data) {
					// Parse NBT file
					nbt.parse(data, function(error, result) {
						this.updatePlayerInfo(username, result);
					}.bind(this));
				}.bind(this));
			}.bind(this))();
		}
	}.bind(this));
}

MCServer.prototype.updatePlayerInfo = function(username, data) {
	this.emit('playerInfo', username, data);
}


// Creates a minecraft server
function createMCServer() {
	return new MCServer();
}

module.exports.createMCServer = createMCServer;
