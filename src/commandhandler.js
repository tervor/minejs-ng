
var events = require('events');
var util = require('util');
var fs = require('fs');

var config = require('../config.js').config;
var whitelist = require('./whitelist.js').createWhiteList();
var serverproperties = require('./properties.js').createServerProperties();


// The CommandHandler class implements all the advanced commands that can be
// issued through the different interfaces (http, ingame, telnet) to the
// minejs server.
function CommandHandler(mcserver) {
	events.EventEmitter.call(this);
	this.mcserver = mcserver;
	
	// TODO this should move somewhere else, or to the JSON file itself
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].info = this.items[i].name;
		this.items[i].name = this.items[i].name.replace(' ', '_').toLowerCase();
	}
}

util.inherits(CommandHandler, events.EventEmitter);

// Load item list
CommandHandler.prototype.items = JSON.parse(fs.readFileSync('./src/items.json', 'ascii'));

// List of handlers to be called when commands are executed.
// Make sure that a handler function of type cmd_xxx(user, mode, args) with the same name actually
// exists in this class for every registered command handler.
CommandHandler.prototype.cmd_handlers = {
	cmd_help: 		{	name: "help", args: [],
						info: "Shows help screen" },
	cmd_say: 		{	name: "say", args: ['text'],
						info: "Say something" },
	cmd_tell: 		{	name: "tell", args: ['user', 'text'],
						info: "Tells user something" },
	cmd_users: 		{	name: "users", args: [],
						info: "Shows user list" }, 
	cmd_status: 	{	name: "status", args: [],
						info: "Shows server status" },
	cmd_give: 		{	name: 'give', args: ['name', 'count'],
						info: "Gives items" },
	cmd_stack: 		{	name: 'stack', args: ['name', 'count'],
						info: "Gives stacks" },
	cmd_items: 		{	name: 'items', args: ['prefix'],
						info: "List items with prefix" },
	cmd_tp: 		{	name: 'tp', args: ['target'],
	 					info: "Teleport to target" },
	cmd_restart: 	{	name: 'restart', args: [],
						info: "Restarts the server" },
	cmd_save: 		{	name: 'save', args: ['action'],
						info: "Save on/off" },
	cmd_whitelist: 	{	name: 'whitelist', args: ['action', 'name'],
						info: "Edit whitelist" },
	cmd_properties: {	name: 'properties', args: ['action', 'name', 'value'],
						info: "Edit server properties" },
}

// Parses and executes a command
// Returns null if unknown command, returns string otherwise
CommandHandler.prototype.parse_execute = function(user, mode, text) {
	// Split values into arguments
	var args = text.split(' ');
	var cmd = args[0];
	args = args.splice(1, args.length - 1);
			
	return this.execute(user, mode, cmd, args);
}

CommandHandler.prototype.execute = function(user, mode, cmd, args) {
	for (var handler in this.cmd_handlers)
		if (cmd == this.cmd_handlers[handler].name)
			return this[handler](user, mode, args);
	return "unknown command";
}

CommandHandler.prototype.cmd_handler_by_name = function(cmd) {
	for (var handler in this.cmd_handlers)
		if (cmd == this.cmd_handlers[handler].name)
			return this.cmd_handlers[handler];
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

CommandHandler.prototype.cmd_help = function(user, mode, args) {
	if (args.length != 0)
		return "invalid params";
	var text = "";
	var objs = [];
	text += "Available commands:\n";
	for (var cmd in this.cmd_handlers) {
		var handler = this.cmd_handlers[cmd];
		if (mode == 'console')
			text += "//";
		text += handler.name;
		if (handler.args.length > 0)
			text += " [" + handler.args.join("] [") + "]";
		text += " - " + handler.info + "\n";
		objs.push({ name: handler.name, args: handler.args, info: handler.info });
	}
	
	return this.return_by_mode(mode, text, text, objs);
}

CommandHandler.prototype.cmd_say = function(user, mode, args) {
	if (args.length != 1)
		return "invalid params";
	this.mcserver.say(args[0]);
	return "success";
}

CommandHandler.prototype.cmd_tell = function(user, mode, args) {
	if (args.length != 2)
		return "invalid params";
	this.mcserver.tell(args[0], args[1]);
	return "success";
}

CommandHandler.prototype.cmd_users = function(user, mode, args) {
	var text = this.mcserver.users.join(',');
	var objs = this.mcserver.users;
	return this.return_by_mode(mode, text, text, objs);
}

CommandHandler.prototype.cmd_status = function(user, mode, args) {
	if (args.length != 0)
		return "invalid params";
	return this.mcserver.stats_minejs + this.mcserver.stats_mcserver;
}

CommandHandler.prototype.cmd_give = function(user, mode, args) {
	if (args.length == 1)
		args.push(1);
	if (args.length != 2)
		return "invalid params";
	var item = this.item_by_name_or_id(args[0]);
	if (item == null)
		return "invalid item";
	var left = args[1];
	var stacks = 0;
	while (left > 0) {
		var num = left > item.amount ? item.amount : left;
		console.log("left=" + left + " num=" + num);
		this.mcserver.give(user, item.id, num);
		left -= num;
		stacks++;
		if (stacks >= config.settings.max_stacks)
			break;
	}
	return "success";
}

CommandHandler.prototype.cmd_stack = function(user, mode, args) {
	if (args.length == 1)
		args.push(1);
	if (args.length != 2)
		return "invalid params";
	var item = this.item_by_name_or_id(args[0]);
	if (item == null)
		return "invalid item";
	var stacks = args[1];
	if (stacks > config.settings.max_stacks)
		stacks = config.settings.max_stacks;
	for (var i = 0; i < stacks; i++)
		this.mcserver.give(user, item.id, item.amount);
	return "success";
}

CommandHandler.prototype.cmd_items = function(user, mode, args) {
	var text = "";
	var objs = [];
	for (var i = 0; i < this.items.length; i++) {
		var item = this.items[i];
		if (args.length > 0)
			if (item.name.substr(0, args[0].length) != args[0])
				continue;
		text += item.name + " (" + item.id + ")\n";
		objs.push({ id: item.id, name: item.name, info: item.info, amount: item.amount });
	}
	return this.return_by_mode(mode, text, text, objs);
}

CommandHandler.prototype.cmd_tp = function(user, mode, args) {
	if (args.length != 1)
		return "invalid params";
	this.mcserver.tp(user, args[0]);
	return "success";
}

CommandHandler.prototype.cmd_restart = function(user, mode, args) {
	if (args.length != 0)
		return "invalid params";
	this.mcserver.restart();
	return "success";
}

CommandHandler.prototype.cmd_save = function(user, mode, args) {
	if (args.length != 1)
		return "invalid params";
	switch (args[0]) {
	case 'on':
		this.mcserver.save_on();
		this.mcserver.save_all();
		break;
	case 'off':
		this.mcserver.save_off();
		this.mcserver.save_all();
		break;
	default:
		return "invalid action";
	}
	return "success";
}

CommandHandler.prototype.cmd_whitelist = function(user, mode, args) {
	if (args.length < 1) {
		args.push('');
	}
	switch (args[0]) {
	case 'add':
		if (args.length != 2)
			return "invalid params";
		whitelist.add(args[1]);
		break;
	case 'remove':
		if (args.length != 2)
			return "invalid params";
		whitelist.remove(args[1]);
		break;
	default:
		var text = whitelist.whitelist.join(', ');
		var objs = whitelist.whitelist;
		return this.return_by_mode(mode, text, text, objs);
	}
	return "success";
}

CommandHandler.prototype.cmd_properties = function(user, mode, args) {
	if (args.length < 1) {
		args.push('');
	}
	switch (args[0]) {
	case 'set':
		if (args.length != 3)
			return "invalid params";
		if (!serverproperties.set(args[1], args[2]))
			return "invalid name";
		break;
	case 'get':
		if (args.length != 2)
			return "invalid params";
		var value = serverproperties.get(args[1]);
		return value == null ? "invalid name" : value;
	default:
		var text = "";
		for (var property in serverproperties.properties)
			text += property + "=" + serverproperties.properties[property] + "\n";
		var objs = serverproperties.properties;
		return this.return_by_mode(mode, text, text, objs);
	}
	return "success";
}

CommandHandler.prototype.return_by_mode = function(mode, console, telnet, web)
{
	switch (mode) {
	case 'console':
		return console;
	case 'telnet':
		return telnet;
	case 'web':
		return web;
	}
	
	return null;
}

// Creates a command handler
function createCommandHandler(mcserver) {
	return new CommandHandler(mcserver);
}

module.exports.createCommandHandler = createCommandHandler;