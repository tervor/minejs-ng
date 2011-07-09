
var events = require('events');
var util = require('util');
var fs = require('fs');

// The CommandHandler class implements all the advanced commands that can be
// issued through the different interfaces (http, ingame, telnet) to the
// minejs server.
function CommandHandler(mcserver) {
	events.EventEmitter.call(this);
	this.mcserver = mcserver;
	
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].name = this.items[i].name.replace(' ', '_').toLowerCase();
	}
	
	console.log(util.inspect(this.items));
	
}

util.inherits(CommandHandler, events.EventEmitter);

// Load item list
CommandHandler.prototype.items = JSON.parse(fs.readFileSync('./src/items.json', 'ascii'));

// List of handlers to be called when commands are executed.
// Make sure that a handler function of type cmd_xxx(user, args) with the same name actually
// exists in this class for every registered command handler.
CommandHandler.prototype.cmd_handlers = {
	cmd_help: { name: "help", info: "Shows this help screen" },
	cmd_status: { name: "status", info: "Shows status information of the server" },
	cmd_give: { name: 'give', info: "Gives stacks of items" },
	cmd_items: { name: 'items', info: "List all items" },
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

CommandHandler.prototype.item_by_name_or_id = function(name) {
	for (var i = 0; i < this.items.length; i++) {
		item = this.items[i];
		if (item.name == name || item.id == name)
			return item;
	}
	
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

CommandHandler.prototype.cmd_give = function(user, args) {
	if (args.length != 2)
		return "invalid params";
	item = this.item_by_name_or_id(args[0]);
	if (item == null)
		return "invalid item";
	for (var i = 0; i < args[1]; i++)
		this.mcserver.give(user, item.id, item.stackable ? 64 : 0);
}

CommandHandler.prototype.cmd_items = function(user, args) {
	text = "";
	for (var i = 0; i < this.items.length; i++)
		text += this.items[i].name + " (" + this.items[i].id + ")\n";
	return text;
}

// Creates a command handler
function createCommandHandler(mcserver) {
	return new CommandHandler(mcserver);
}

module.exports.createCommandHandler = createCommandHandler;