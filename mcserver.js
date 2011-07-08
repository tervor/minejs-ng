
var spawn = require('child_process').spawn;

var config = require('./config.js').config;

var util = require('util');

// Constructor
function MCServer() {
	this.recv = "";
	this.users = [];
}

MCServer.prototype = {
	
	DISCONNECT: ".*\\[INFO\\] (.*) lost connection:.*",
	CONNECT: ".*\\[INFO\\] (.*) \\[.*\\] logged in with entity id \\d+ at .*",
	CHAT: ".*\\[INFO\\] <(.*)> (.*)",
	COMMAND: ".*\\[INFO\\] (.*) issued server command: (.*)",

	// Starts the minecraft server
	start: function() {
		args = config.server.java_args.concat(['-jar', config.server.jar]).concat(config.server.server_args);
		console.log('Starting minecraft server with: ' + config.server.java + ' ' + args.join(' '));
		// Spawn the child process
	    this.process = spawn(config.server.java, args, { cwd: config.server.dir });
	
		this.process.stdout.on('data', function(data) {
			this.receive(data);
		}.bind(this));
		
		this.process.stderr.on('data', function(data) {
			this.receive(data);
		}.bind(this));
		
		this.process.on('exit', this.on_exit);
	},
	
	// Stops the minecraft server
	stop: function() {
		console.log('Stopping minecraft server');
		this.process.stdin.write("\nstop\n");
	},

	say: function(text) {
		this.send_cmd(['say', text]);
	},
	
	tell: function(user, text) {
		this.send_cmd(['tell', user, text]);
	},
	
	give: function(user, id, num) {
		this.send_cmd(['give', user, id, num]);
	},

	status: function() {
	    // UNSTABLE - maybe this output should only be available in console
		this.send_cmd(['say', 'STATUS:']);
		this.send_cmd(['say', 'Minecraft JVM is running on PID: '+this.process.pid]);
		//this.send_cmd(['say', 'NodeMem: '+util.inspect(process.memoryUsage())]);
		console.log('NodeJS Process Memory Status: \n'+util.inspect(process.memoryUsage()));
		var jstat = spawn('/bin/sh', ['-c', ' jstat -gcutil'+this.process.pid]); 
        jstat.stderr.on("data", function (data) {
		for (i = 0; i < data.length; i++) {
			c = data.toString('ascii', i, i + 1);
			if (c == '\n') {
				console.log("c is: "+c);
			} else
				this.recv += c; 
		    }
		   //debug
           console.log("data is: "+data);
        }); 
	},

	on_exit: function(code) {
	    console.log("Minecraft server exited with code " + code);
	},
	
	receive: function(data) {
		for (i = 0; i < data.length; i++) {
			c = data.toString('ascii', i, i + 1);
			if (c == '\n') {
				this.receive_line(this.recv);
				this.recv = "";
			} else
				this.recv += c;
		}
	},
	
	receive_line: function(line) {
		console.log(this.recv);
		
		m = this.recv.match(this.CONNECT);
		if (m) {
			user = m[1];
			console.log("User " + user + " has connected");
			this.users.push(user);
			console.log(this.users);
		}
		
		m = this.recv.match(this.DISCONNECT);
		if (m) {
			user = m[1];
			console.log("User " + user + " has disconnected");
			this.users.splice(this.users.indexOf(user), 1);
			console.log(this.users);
		}
		
		m = this.recv.match(this.CHAT);
		if (m) {
			this.user_chat(m[1], m[2]);
		}
		
		m = this.recv.match(this.COMMAND);
		if (m) {
			this.user_cmd(m[1], m[2]);
		}

	},
	
	send_cmd: function(args) {
		this.process.stdin.write(args.join(' ') + '\n');
	},
	
	user_chat: function(user, text) {
		console.log("User " + user + " says " + text);
	},
	
	user_cmd: function(user, text) {
		console.log("XX User " + user + " sent command " + text);

		values = text.split(' ');
		if (values[0] == "random") {
			this.tell(user, "test");
//			for (i = 1; i <= 10; i++)
				this.give(user, 4, 100);
		}
	},
	
}



// Creates a minecraft server
function createMCServer() {
	return new MCServer();
}

module.exports.createMCServer = createMCServer;
