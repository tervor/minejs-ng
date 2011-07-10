
var net = require('net');
var events = require('events');
var util = require('util');

var config = require('../config.js').config;


function Session(server, socket) {
	this.server = server;
	this.socket = socket;
	this.user = null;
	
	this.socket.write("Welcome to minejs, enter help for more information\n");
	this.socket.write("Please enter your username: ");
	this.socket.on('data', function(data) {
		this.receive_line(data.toString('ascii').replace('\n', '').replace('\r', ''));
	}.bind(this));
	socket.on('end', function() {
		// TODO anything to do?
	}.bind(this));
}

Session.prototype.receive_line = function(line) {
	if (this.user == null) {
		this.user = line;
	} else {
		this.server.emit('data', this, line);
	}
}

// Constructor
function TelnetServer() {
	events.EventEmitter.call(this);
	this.reset();
}

util.inherits(TelnetServer, events.EventEmitter);

// Resets the internals (user list etc.)
TelnetServer.prototype.reset = function() {
	this.running = false;
	this.terminate = false;
},

// Starts the telnet server
TelnetServer.prototype.start = function() {
	if (this.running)
		return;
		
	console.log("Starting telnet server on port " + config.telnet.port);
	
	this.reset();
	this.running = true;
	
	// Start tcp server
	this.server = net.createServer(function(socket) {
		var session = new Session(this, socket);
	}.bind(this)).listen(config.telnet.port);
},

TelnetServer.prototype.stop = function() {
	if (!this.running)
		return;
		
	// TODO
	//this.server.stop()
}
	

// Creates a telnet server
function createTelnetServer() {
	return new TelnetServer();
}

module.exports.createTelnetServer = createTelnetServer;
