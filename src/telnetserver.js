
var config = require('../config.js').config;

var net = require('net');


// Constructor
function TelnetServer() {
	this.reset();
}

// TelnetServer class definition
TelnetServer.prototype = {

	// Resets the internals (user list etc.)
	reset: function() {
		this.running = false;
		this.terminate = false;
	},
	
	// Starts the telnet server
	start: function() {
		if (this.running)
			return;
			
		console.log("Starting telnet server on port " + config.telnet.port);
		
		this.reset();
		this.running = true;
		
		// Start tcp server
		this.server = net.createServer(function(socket) {
			socket.write("Welcome to minejs, enter !help for more information\n");
			socket.on('data', function(data) {
				this.receive_line(data.toString('ascii'));
			}.bind(this));
			socket.on('end', function() {
				// TODO anything to do?
			}.bind(this));
		}.bind(this)).listen(config.telnet.port);
	},
	
	stop: function() {
		if (!this.running)
			return;
			
		// TODO
		//this.server.stop()
	},
	
	receive_line: function() {
		
	},
	
	
	
}

// Creates a telnet server
function createTelnetServer() {
	return new TelnetServer();
}

module.exports.createTelnetServer = createTelnetServer;
