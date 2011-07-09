
var events = require('events');
var util = require('util');

// The CommandHandler class implements all the advanced commands that can be
// issued through the different interfaces (http, ingame, telnet) to the
// minejs server.
function CommandHandler(mcserver) {
	events.EventEmitter.call(this);
	this.mcserver = mcserver;
}

util.inherits(CommandHandler, events.EventEmitter);


// List of handlers to be called when commands are executed.
// Make sure that a handler function of type cmd_xxx(user, args) with the same name actually
// exists in this class for every registered command handler.
CommandHandler.prototype.cmd_handlers = {
	cmd_help: { name: "help", info: "Shows this help screen" },
	cmd_status: { name: "status", info: "Shows status information of the server" },
}

// Parses and executes a command
// Returns null if unknown command, returns string otherwise
CommandHandler.prototype.execute = function(user, text) {
	// Split values into arguments
	var args = text.split(' ');
	var cmd = args[0];
	args = args.splice(1, args.length - 1);
	
	for (var handler in this.cmd_handlers)
		if (cmd == this.cmd_handlers[handler].name)
			return this[handler](user, args);
			
	return null;
}

// Commands -----------------------------------------------------------------

CommandHandler.prototype.cmd_help = function(user, args) {
	var text = "";
	text += "Available commands:\n";
	text += "(commands need to be prefixed with // from ingame console)\n";
	for (var cmd in this.cmd_handlers)
		text += this.cmd_handlers[cmd].name + " - " + this.cmd_handlers[cmd].info + "\n";
	return text;
}

CommandHandler.prototype.cmd_status = function(user, args) {
	return this.mcserver.stats_minejs + this.mcserver.stats_mcserver;
}

// Creates a command handler
function createCommandHandler(mcserver) {
	return new CommandHandler(mcserver);
}

module.exports.createCommandHandler = createCommandHandler;