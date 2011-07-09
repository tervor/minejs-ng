#!/usr/bin/env node

var config = require('./config.js').config;



var sys = require('sys'),
    fs = require('fs'),
    http = require('http'),
	url = require('url'),
    util = require('util');

console.log("minejs - Minecraft Server Wrapper")


// Create minecraft server wrapper
var mcserver = require('./src/mcserver.js').createMCServer();

mcserver.on('exit', function() {
	process.exit(0);
});

mcserver.on('user_connect', function(user) {
	console.log("User '" + user + "' has connected");
});

mcserver.on('user_disconnect', function(user) {
	console.log("User '" + user + "' has disconnected");
});

mcserver.on('user_chat', function(user, text) {
	console.log("User '" + user + "' has said '" + text + "'");
});

mcserver.on('user_cmd', function(user, text) {
	console.log("User '" + user + "' has issued command '" + text + "'");

	// Command starts with a / character, otherwise it's invalid
	if (text.charAt(0) == '/') {
		text = text.slice(1, text.length);
		var ret = cmdhandler.parse_execute(user, 'string', text);
		if (ret != null) {
			var lines = ret.split('\n');
			for (var i = 0; i < lines.length; i++)
				mcserver.tell(user, lines[i]);
		}
	}
});

// Create telnet server
var telnetserver = require('./src/telnetserver.js').createTelnetServer();


// Create command handler
var cmdhandler = require('./src/commandhandler.js').createCommandHandler(mcserver);



// Start
mcserver.start();
telnetserver.start();



/* http webservice */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': "text/plain;charset=UTF-8"});
	var u = url.parse(req.url, true);
	
	var cmd = u.pathname.substr(1, u.pathname.length);
	var cmd_handler = cmdhandler.cmd_handler_by_name(cmd);
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
		
		var ret = cmdhandler.execute(user, 'json', cmd, args);
		res.end(JSON.stringify(ret));
	}
}).listen(config.web.port);


process.stdin.resume();

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



var counter = 1;
setInterval(function() {
	mcserver.say(counter++);
}, 10000);
