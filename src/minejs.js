#!/usr/bin/env node

// Add module paths
require.paths.unshift(__dirname);
require.paths.unshift(__dirname + '/../');

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
	log.info("minecraft: " + data);
	for (var i = 0; i < monitorTelnetClients.length; i++)
		monitorTelnetClients[i].socket.write(data + "\n");
});

mcserver.on('exit', function() {
	process.exit(0);
});

mcserver.on('connect', function(username) {
	log.info("User '" + username + "' has connected to minecraft");
	mcserver.tell(username, "This server runs minejs " + version);
	mcserver.tell(username, "Enter '//help' for more information");
	var user = userList.userByName(username);
	if (user) {
		user.isPlaying = true;
		frontend.notify('updateUserList');
	}
});

mcserver.on('disconnect', function(username) {
	log.info("User '" + username + "' has disconnected from minecraft");
	var user = userList.userByName(username);
	if (user) {
		user.isPlaying = false;
		frontend.notify('updateUserList');
	}
});

mcserver.on('chat', function(username, text) {
	log.info("User '" + username + "' has said '" + text + "'");
});

mcserver.on('cmd', function(username, text) {
	log.info("User '" + username + "' has issued command '" + text + "' via console");

	// Command starts with a / character, otherwise it's invalid
	if (text.charAt(0) == '/') {
		text = text.slice(1, text.length);
		var ret = commandHandler.parse_execute(username, 'console', text);
		if (ret != null && ret != "success") {
			var lines = ret.split('\n');
			for (var i = 0; i < lines.length; i++)
				mcserver.tell(username, lines[i]);
		}
	}
});

mcserver.on('saved', function() {
	userList.updateFromPlayerDat();
});

userList.on('userAchievedItem', function(user, id) {
	mcserver.tell(user.name, "You have achieved item " + id);
});

// Create telnet server
var telnetserver = require('telnetserver.js').createTelnetServer();

// List of telnet monitor clients
var monitorTelnetClients = [];

telnetserver.on('connect', function(client) {
	log.info("User '" + client.username + "' has connected via telnet");
	if (client.username == "monitor") {
		client.socket.write("Monitoring minecraft server\n");
		monitorTelnetClients.push(client);
	} else if (userList.userByName(client.username) == null) {
		client.socket.end("Unknown user!\n");
	}
});

telnetserver.on('disconnect', function(client) {
	log.info("User '" + client.username + "' has disconnected via telnet");
});

telnetserver.on('data', function(client, text) {
	if (text == "exit") {
		client.socket.end("Terminating\n");
		return;
	}

	if (client.username == "monitor") {
		mcserver.process.stdin.write(text + "\n");
		return;
	}
	
	log.info("User '" + client.username + "' has issued command '" + text + "' via telnet");
	var ret = commandHandler.parse_execute(client.username, 'telnet', text);
	client.socket.write(ret + "\n");
});

telnetserver.on('end', function(client) {
	if (client.username == "monitor")
		monitorTelnetClients.splice(monitorTelnetClients.indexOf(client), 1);
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
	client.sendChatHistory();
	frontend.chat(client.user.name, 'has connected');
	client.user.isFrontend = true;
	frontend.notify('updateUserList');
});

frontend.on('disconnect', function(client) {
	log.info("User '" + client.user.name + "' has disconnected via socket.io");
	mcserver.say('<' + client.user.name + '> has disconnected from minejs');
	frontend.chat(client.user.name, 'has disconnected');
	client.user.isFrontend = false;
	frontend.notify('updateUserList');
});

frontend.on('chat', function(client, text) {
	mcserver.say('<' + client.user.name + '> ' + text);
});

mcserver.on('chat', function(username, text) {
	frontend.chat(username, text);
});

mcserver.on('connect', function(username) {
	frontend.chat(username, 'has connected to minecraft');
});

mcserver.on('disconnect', function(username) {
	frontend.chat(username, 'has disconnected from minecraft');
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
	mcserver.saveAll();
}, config.settings.save_interval * 1000);