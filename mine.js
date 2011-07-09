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
		var ret = cmdhandler.execute(user, text);
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


function requestUsers(req, res) {
	
}

function requestSay(req, res) {
	
}


/* http webservice */
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': "text/plain;charset=UTF-8"});
	var u = url.parse(req.url, true);
	
	
    switch (u.pathname) {
        case "/users":
		    res.end(JSON.stringify(mcserver.users));
            break;
        case "/say":
            try {
			    mcserver.say(u.query.text);
			    res.end("success");
		    } catch (err) {
			    res.end("failed");
		    }
            break;
        case "/tell":
		    try {
			    mcserver.tell(u.query.user, u.query.text);
			    res.end("success");
		    } catch (err) {
			    res.end("failed");
		    }
            break;
        case "/give":
      		try {
			    mcserver.give(u.query.user, u.query.id, u.query.num);
			    res.end("success");
		    } catch (err) {
			    res.end("failed");
		    }
            break;
        case "/tp":
            res.end("not implemented yet");
            break;
        case "/op":
            res.end("not implemented yet");
            break;
        case "/list":
            res.end("not implemented yet");
            break;
        case "/deop":
            res.end("not implemented yet");
            break;
        case "/kick":
            res.end("not implemented yet");
            break;
        case "/ban":
            res.end("not implemented yet");
            break;
        case "/unban":
             res.end("not implemented yet");
            break;
        case "/adduser":
            /*write user to whitelist.txt*/
            res.end("not implemented yet");
            break;
        case "/deluser":
            /*delete user from whitelist.txt*/
            res.end("not implemented yet");
            break;
        case "/restart":
            /* restart minecraft server*/
            res.end("not implemented yet");
            break;
        case "/status":
            try {
			    mcserver.status();
			    console.log("status success");
			    res.end("success");
			   
		    } catch (err) {
			    console.log("status failed");
			    res.end("failed");
		    }
            break;
        default:
            res.end("unknown request");
            break;
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



/*
mcserver.process.on('exit', function(code) {
	if (mcserver.terminate) {
		console.log("Terminated");
		process.exit(0);
	}
});
*/


var counter = 1;
setInterval(function() {
	mcserver.say(counter++);
}, 10000);
