
var spawn = require('child_process').spawn;

var config = require('./config.js').config;

var util = require('util');

// Constructor
function MCServer() {
	this.reset();
}

// MCServer class definition
MCServer.prototype = {
	
	// List of handlers to be called when a line in the server log matches the regular expression.
	// Make sure that a handler function of type log_handler_xxx(args) with the same name actually
	// exists in this class for every registered log handler.
	log_handlers: {
		log_handler_connect: ".*\\[INFO\\] (.*) \\[.*\\] logged in with entity id \\d+ at .*",
		log_handler_disconnect: ".*\\[INFO\\] (.*) lost connection:.*",
		log_handler_user_chat: ".*\\[INFO\\] <(.*)> (.*)",
		log_handler_user_cmd: ".*\\[INFO\\] (.*) issued server command: (.*)",
	},
	
	// List of handlers to be called when user commands are executed.
	// Make sure that a handler function of type user_cmd_xxx(user, args) with the same name actually
	// exists in this class for every registered user command handler.
	user_cmd_handlers: {
		user_cmd_help: "!help",
		user_cmd_status: "!status",
	},
	
	// Resets the internals (user list etc.)
	reset: function() {
		this.recv = "";
		this.users = [];
		this.running = false;
		this.terminate = false;
		this.stats_minejs = "";
		this.stats_mcserver = "";
	},
	
	// Starts the minecraft server
	start: function() {
		if (this.running)
			return;
		
		this.reset();
		this.running = true;
		
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
		
		this.process.on('exit', function(code) {
		    console.log("Minecraft server terminated (code=" + code + ")");
			if (this.terminate) {
				// Server terminated on user request
				// TODO this needs to be removed and MCServer needs to emit 'exit' signal which is handled in mine.js
				process.exit(0);
			} else {
				// Server terminated unexpectedly -> restart
				console.log("Minecraft server terminated unexpectedly -> restarting server");
				this.start();
			}
		}.bind(this));
		
		// Spawn monitor task
		setInterval(function() {
			this.update_monitoring();
		}.bind(this), 5000);
	},
	
	// Stops the minecraft server
	stop: function() {
		if (!this.running)
			return;
			
		console.log('Stopping minecraft server');
		this.running = false;
		this.terminate = true;
		this.process.stdin.write("\nstop\n");
	},
	
	// Restarts the minecraft server
	restart: function() {
		if (!this.running)
			return;
			
		console.log('Restarting minecraft server');
		this.running = false;
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

	// Called regularly to collect monitoring information
	update_monitoring: function() {
		this.stats_minejs = util.inspect(process.memoryUsage());
		this.stats_mcserver = "";
		jstat = spawn('/bin/sh', ['-c', 'jstat -gcutil ' + this.process.pid]); 
		jstat.stdout.on('data', function(data) {
			this.stats_mcserver += data.toString('ascii');
		}.bind(this));
		jstat.on('exit', function(code) {
			console.log("stats_minejs = " + this.stats_minejs);
			console.log("stats_mcserver = " + this.stats_mcserver);
		}.bind(this));
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
		console.log("minecraft: " + this.recv);
		
		// Check log handlers for matches
		for (handler in this.log_handlers) {
			m = this.recv.match(this.log_handlers[handler]);
			if (m) {
				args = m.splice(1, m.length - 1);
				this[handler](args);
			}
		}
	},
	
	// Log output handlers --------------------------------------------------
	
	log_handler_connect: function(args) {
		user = args[0];
		console.log("User " + user + " has connected");
		this.users.push(user);
	},
	
	log_handler_disconnect: function(args) {
		user = args[0];
		console.log("User " + user + " has disconnected");
		this.users.splice(this.users.indexOf(user), 1);
	},
	
	log_handler_user_chat: function(args) {
		this.user_chat(args[0], args[1]);
	},
	
	log_handler_user_cmd: function(args) {
		this.user_cmd(args[0], args[1]);
	},
	
	// User command handlers ------------------------------------------------
	
	user_cmd_help: function(user, args) {
		this.tell(user, "Commands available:");
		this.tell(user, "!help   - Shows this help screen");
		this.tell(user, "!status - Shows status information of the server");
	},
	
	user_cmd_status: function(user, args) {
		this.tell(user, this.stats_minejs +"\n" + this.stats_mcserver);
	},
	
	// Implementation -------------------------------------------------------
	
	send_cmd: function(args) {
		this.process.stdin.write(args.join(' ') + '\n');
	},
	
	user_chat: function(user, text) {
		console.log("User " + user + " says " + text);
	},
	
	user_cmd: function(user, text) {
		console.log("User " + user + " sent command " + text);
		
		// Split values into arguments
		args = text.split(' ');
		cmd = args[0];
		args = args.splice(1, args.length - 1);
		
		for (handler in this.user_cmd_handlers)
			if (cmd == this.user_cmd_handlers[handler])
				this[handler](user, args);
	},
	
}



// Creates a minecraft server
function createMCServer() {
	return new MCServer();
}

module.exports.createMCServer = createMCServer;
