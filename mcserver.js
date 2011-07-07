
var spawn = require('child_process').spawn;

var config = require('./config.js').config;


// Constructor
function MCServer() {
	this.recv = "";
	this.users = [];
}

MCServer.prototype = {
	
	DISCONNECT: ".*\\[INFO\\] (.*) lost connection:.*",
	CONNECT: ".*\\[INFO\\] (.*) \\[.*\\] logged in with entity id \\d+ at .*",

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

	},
	
	send_cmd: function(args) {
		this.process.stdin.write(args.join(' ') + '\n');
	},
	
}



// Creates a minecraft server
function createMCServer() {
	return new MCServer();
}

module.exports.createMCServer = createMCServer;
