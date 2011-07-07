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


/* http webservice */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': "text/plain;charset=UTF-8"});
	var uri = url.parse(req.url).pathname;
	if (uri == '/users') {
		res.end(JSON.stringify(mcserver.users));
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