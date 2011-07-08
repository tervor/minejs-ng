#!/usr/bin/env node

var config = require('./config.js').config;



var sys = require('sys'),
    fs = require('fs'),
    http = require('http'),
	url = require('url'),
    util = require('util');

console.log("minejs - Minecraft Server Wrapper")
console.log("Node Memory Usage "+util.inspect(process.memoryUsage()));

// Create and start minecraft server
var mcserver = require('./mcserver.js').createMCServer();
mcserver.start();


//sys.puts("\n\nMinecraft launched on PID: " + minecraft.pid);
//sys.puts("Webconsole available on  http://127.0.0.1:1337/ ");

function requestUsers(req, res) {
	
}

function requestSay(req, res) {
	
}


/* http webservice */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': "text/plain;charset=UTF-8"});
	var u = url.parse(req.url, true);
	if (u.pathname == '/users') {
		res.end(JSON.stringify(mcserver.users));
	} else if (u.pathname == '/say') {
		try {
			mcserver.say(u.query.text);
			res.end("success");
		} catch (err) {
			res.end("failed");
		}
	} else if (u.pathname == '/tell') {
		try {
			mcserver.tell(u.query.user, u.query.text);
			res.end("success");
		} catch (err) {
			res.end("failed");
		}
	} else if (u.pathname == '/give') {
		try {
			mcserver.give(u.query.user, u.query.id, u.query.num);
			res.end("success");
		} catch (err) {
			res.end("failed");
		}
	} else {
		res.end("unknown request");
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


mcserver.process.on('exit', function(code) {
	console.log("Terminated");
	process.exit(0);
});


var counter = 1;
setInterval(function() {
	mcserver.say(counter++);
}, 2000);