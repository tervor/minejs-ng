
var spawn = require('child_process').spawn;

var config = require('./config.js').config;


// Constructor
function MCServer() {
}

// Starts the minecraft server
MCServer.prototype.start = function() {
	args = config.server.java_args.concat(['-jar', config.server.jar]).concat(config.server.server_args);
	console.log('Starting minecraft server with: ' + config.server.java + ' ' + args.join(' '));
	// Spawn the child process
    this.process = spawn(config.server.java, args, { cwd: config.server.dir });
	this.process.stdout.on('data', this.on_stdout_data);
	this.process.stderr.on('data', this.on_stderr_data);
	this.process.on('exit', this.on_exit);
}

// Stops the minecraft server
MCServer.prototype.stop = function() {
	console.log('Stopping minecraft server');
	this.process.stdin.write('stop\n');
	this.process.stdin.end();
}

MCServer.prototype.on_stdout_data = function(data) {
    console.log("stdout: " + data);
}

MCServer.prototype.on_stderr_data = function(data) {
    console.log("stderr: " + data);
}

MCServer.prototype.on_exit = function(code) {
    console.log("child process exited with code " + code);
}


// Creates a minecraft server
function createMCServer() {
	return new MCServer();
}

module.exports.createMCServer = createMCServer;
