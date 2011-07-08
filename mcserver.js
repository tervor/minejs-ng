
var spawn = require('child_process').spawn;

var config = require('./config.js').config;

var util = require('util');

// Constructor
function MCServer() {
	this.recv = "";
	this.users = [];
}

// MCServer class definition
MCServer.prototype = {
	
	// List of handlers to be called when a line in the server log matches the regular expression.
	// Make sure that a handler function of type handle_xxx(args) with the same name actually
	// exists in this class for every registered log handler.
	log_handlers: {
		handle_connect: ".*\\[INFO\\] (.*) \\[.*\\] logged in with entity id \\d+ at .*",
		handle_disconnect: ".*\\[INFO\\] (.*) lost connection:.*",
		handle_user_chat: ".*\\[INFO\\] <(.*)> (.*)",
		handle_user_cmd: ".*\\[INFO\\] (.*) issued server command: (.*)",
	},
	
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
	
	// Called for every chunk of data received from the server's STDOUT and STDERR
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
	
	// Called for every new received line from the server's STDOUT and STDERR
	receive_line: function(line) {
		console.log(this.recv);
		
		// Check log handlers for matches
		for (handler in this.log_handlers) {
			m = this.recv.match(this.log_handlers[handler]);
			if (m) {
				args = m.splice(1, m.length - 1);
				this[handler](args);
			}
		}
	},
	
	handle_connect: function(args) {
		user = args[0];
		console.log("User " + user + " has connected");
		this.users.push(user);
	},
	
	handle_disconnect: function(args) {
		user = args[0];
		console.log("User " + user + " has disconnected");
		this.users.splice(this.users.indexOf(user), 1);
	},
	
	handle_user_chat: function(args) {
		this.user_chat(args[0], args[1]);
	},
	
	handle_user_cmd: function(args) {
		this.user_cmd(args[0], args[1]);
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
