#!/usr/bin/env node

// Add module paths
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '/src');

var sys = require('sys'),
    fs = require('fs'),
    http = require('http'),
	url = require('url'),
    util = require('util');




// TODO move to utils or something
Array.prototype.has = function(v) {
	for (i = 0; i < this.length; i++)
		if (this[i] == v) return true;
	return false;
}

// Version number
var version = "0.0.1";

// Load configuration
var config = require('config').config;

// Create global logger
var Log = require('log');
log = new Log(config.log.level, fs.createWriteStream(config.log.file));
log.on('log', function(level, str) {
	console.log(str);
});

// Create singletons
var itemList = require('itemlist').instance;
var userList = require('userlist').instance;
var serverProperties = require('serverproperties').instance;

// Dump contents of itemList, userList and serverProperties
log.debug('Items:');
log.debug(util.inspect(itemList.items));
log.debug('Users:');
log.debug(util.inspect(userList.users));
log.debug('Server Properties:');
log.debug(util.inspect(serverProperties.properties));


log.info("minejs " + version + " - Minecraft Server Wrapper")


// Create minecraft server wrapper
var mcserver = require('mcserver').createMCServer();

mcserver.on('data', function(data) {
	log.info("minecraft: " + this.recv);
	for (var i = 0; i < monitorSessions.length; i++)
		monitorSessions[i].socket.write(data + "\n");
});

mcserver.on('exit', function() {
	process.exit(0);
});

mcserver.on('user_connect', function(user) {
	log.info("User '" + user + "' has connected to minecraft");
	mcserver.tell(user, "This server runs minejs " + version);
	mcserver.tell(user, "Enter '//help' for more information");
});

mcserver.on('user_disconnect', function(user) {
	log.info("User '" + user + "' has disconnected from minecraft");
});

mcserver.on('user_chat', function(user, text) {
	log.info("User '" + user + "' has said '" + text + "'");
});

mcserver.on('user_cmd', function(user, text) {
	log.info("User '" + user + "' has issued command '" + text + "' via console");

	// Command starts with a / character, otherwise it's invalid
	if (text.charAt(0) == '/') {
		text = text.slice(1, text.length);
		var ret = commandHandler.parse_execute(user, 'console', text);
		if (ret != null && ret != "success") {
			var lines = ret.split('\n');
			for (var i = 0; i < lines.length; i++)
				mcserver.tell(user, lines[i]);
		}
	}
});

mcserver.on('save_complete', function(user, text) {
	userList.updateFromPlayerDat();
});

userList.on('userAchievedItem', function(user, id) {
	mcserver.tell(user.name, "You have achieved item " + id);
});

// Create telnet server
var telnetserver = require('telnetserver.js').createTelnetServer();

// List of telnet monitor sessions
var monitorSessions = [];

telnetserver.on('connect', function(session) {
	log.info("User '" + session.user + "' has connected via telnet");
	if (session.user == "monitor") {
		session.socket.write("Monitoring minecraft server\n");
		monitorSessions.push(session);
	} else if (userList.userByName(session.user) == null) {
		session.socket.end("Unknown user!\n");
	}
});

telnetserver.on('disconnect', function(session) {
	log.info("User '" + session.user + "' has disconnected via telnet");
});

telnetserver.on('data', function(session, text) {
	if (text == "exit") {
		session.socket.end("Terminating\n");
		return;
	}

	if (session.user == "monitor") {
		mcserver.process.stdin.write(text + "\n");
		return;
	}
	
	log.info("User '" + session.user + "' has issued command '" + text + "' via telnet");
	var ret = commandHandler.parse_execute(session.user, 'telnet', text);
	session.socket.write(ret + "\n");
});

telnetserver.on('end', function(session) {
	if (session.user == "monitor")
		monitorSessions.splice(monitorSessions.indexOf(session), 1);
});


// Create web server
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': "text/plain;charset=UTF-8"});
	var u = url.parse(req.url, true);
	
	var cmd = u.pathname.substr(1, u.pathname.length);
	var cmd_handler = commandHandler.cmdHandlerByName(cmd);
	if (cmd_handler == null) {
		res.end(JSON.stringify("unknown command"));
	} else {
		var user = "none";
		if (u.query.hasOwnProperty("origin"))
			user = u.query.origin;
		var args = [];
		for (var i = 0; i < cmd_handler.args.length; i++) {
			var arg = cmd_handler.args[i];
			if (u.query.hasOwnProperty(arg)) {
				args.push(u.query[arg]);
			} else {
				args.push("");
			}
		}
		
		var ret = commandHandler.execute(user, 'web', cmd, args);
		res.end(JSON.stringify(ret));
	}
}).listen(config.web.port);

// Create command handler
var commandHandler = require('commandhandler').createCommandHandler(mcserver, userList, itemList, serverProperties);

// Create frontend
var frontend = require('frontend/frontend').instance;

frontend.on('connect', function(client) {
	log.info("User '" + client.user.name + "' has connected via socket.io");
	mcserver.say('<' + client.user.name + '> has connected to minejs');
});

frontend.on('disconnect', function(client) {
	log.info("User '" + client.user.name + "' has disconnected via socket.io");
	mcserver.say('<' + client.user.name + '> has disconnected from minejs');
});

frontend.on('chat', function(client, text) {
	mcserver.say('<' + client.user.name + '> ' + text);
});

mcserver.on('user_chat', function(user, text) {
	frontend.chat(user, text);
});

mcserver.on('user_connect', function(user) {
	frontend.chat(user, 'has connected to minecraft');
});

mcserver.on('user_disconnect', function(user) {
	frontend.chat(user, 'has disconnected from minecraft');
});

// Start
mcserver.start();
telnetserver.start();
process.stdin.resume();

// Echo STDIN to minecraft server, listen for ctrl-C
process.stdin.on('data', function (data) {
	if (data[0] == 0x03) {
		mcserver.stop();
	}
	mcserver.process.stdin.write(data);
	process.stdout.write(data);
});

process.on('SIGHUP', on_signal);
process.on('SIGINT', on_signal);
process.on('SIGTERM', on_signal);
process.on('SIGKILL', on_signal);

function on_signal() {
	mcserver.stop();
}

setInterval(function() {
	mcserver.save_all();
}, config.settings.save_interval * 1000);