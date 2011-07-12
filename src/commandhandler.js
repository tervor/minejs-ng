
var events = require('events');
var util = require('util');
var fs = require('fs');

var config = require('../config.js').config;


// The CommandHandler class implements all the advanced commands that can be
// issued through the different interfaces (http, ingame, telnet) to the
// minejs server.
function CommandHandler(mcserver, userlist, serverProperties) {
	events.EventEmitter.call(this);
	this.mcserver = mcserver;
	this.userlist = userlist;
	this.serverProperties = serverProperties;
	
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
	// Guest commands
	cmd_help: 		{	name: "help", args: [], role: 'guest',
						info: "Shows help screen" },
	cmd_say: 		{	name: "say", args: ['text'], role: 'guest',
						info: "Say something" },
	cmd_tell: 		{	name: "tell", args: ['user', 'text'], role: 'guest',
						info: "Tells user something" },
	cmd_users: 		{	name: "users", args: [], role: 'guest',
						info: "Shows user list" }, 
	cmd_items: 		{	name: 'items', args: ['prefix'], role: 'guest',
						info: "List items with prefix" },
	// User commands
	cmd_give: 		{	name: 'give', args: ['name', 'count'], role: 'user',
						info: "Gives items" },
	cmd_stack: 		{	name: 'stack', args: ['name', 'count'], role: 'user',
						info: "Gives stacks" },
	cmd_tp: 		{	name: 'tp', args: ['target'], role: 'user',
	 					info: "Teleport to target" },
	cmd_user: 		{	name: 'user', args: ['action', 'name', 'value'], role: 'user',
						info: "Edit user list" },
	// Admin commands
	cmd_status: 	{	name: "status", args: [], role: 'admin',
						info: "Shows server status" },
	cmd_restart: 	{	name: 'restart', args: [], role: 'admin',
						info: "Restarts the server" },
	// Superadmin commands
	cmd_save: 		{	name: 'save', args: ['action'], role: 'superadmin',
						info: "Save on/off" },
	cmd_properties: {	name: 'properties', args: ['action', 'name', 'value'], role: 'superadmin',
						info: "Edit server properties" },
}

// Parses and executes a command
// Returns null if unknown command, returns string otherwise
CommandHandler.prototype.parse_execute = function(username, mode, text) {
	// Split values into arguments
	var args = text.split(' ');
	var cmd = args[0];
	args = args.splice(1, args.length - 1);
			
	return this.execute(username, mode, cmd, args);
}

CommandHandler.prototype.execute = function(username, mode, cmd, args) {
	// Get user
	user = this.userlist.userByName(username);
			
	for (var handler in this.cmd_handlers)
		if (cmd == this.cmd_handlers[handler].name) {
			if (this.cmd_handlers[handler].role != "guest") {
				if (user == null)
					return "unknown user";
				if (!user.hasRole(this.cmd_handlers[handler].role))
					return "permission denied"
			}
			return this[handler](user, mode, args);
		}
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

// Guest commands -----------------------------------------------------------

CommandHandler.prototype.cmd_help = function(user, mode, args) {
	if (args.length != 0)
		return "invalid params";
	var text = "";
	var objs = [];
	text += "Available commands:\n";
	for (var cmd in this.cmd_handlers) {
		var handler = this.cmd_handlers[cmd];
		// Skip commands which are not accessible by user
		if (user != null && !user.hasRole(this.cmd_handlers[cmd].role))
			continue;
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
	if (args[0] == "")
		return "invalid params";
	this.mcserver.say(args[0]);
	return "success";
}

CommandHandler.prototype.cmd_tell = function(user, mode, args) {
	if (args.length != 2)
		return "invalid params";
	if (args[0] == "")
		return "invalid params";
	if (args[1] == "")
		return "invalid params";
	this.mcserver.tell(args[0], args[1]);
	return "success";
}

CommandHandler.prototype.cmd_users = function(user, mode, args) {
	var text = this.mcserver.users.join(',');
	var objs = this.mcserver.users;
	return this.return_by_mode(mode, text, text, objs);
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

// User commands ------------------------------------------------------------

CommandHandler.prototype.cmd_give = function(user, mode, args) {
	if (args.length == 1)
		args.push(1);
	if (args.length != 2)
		return "invalid params";
	if (args[1] == "")
		return "invalid params";
	var item = this.item_by_name_or_id(args[0]);
	if (item == null)
		return "invalid item";
	var left = args[1];
	var stacks = 0;
	while (left > 0) {
		var num = left > item.amount ? item.amount : left;
		this.mcserver.give(user.name, item.id, num);
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
	if (args[1] == "")
		return "invalid params";
	var item = this.item_by_name_or_id(args[0]);
	if (item == null)
		return "invalid item";
	var stacks = args[1];
	if (stacks > config.settings.max_stacks)
		stacks = config.settings.max_stacks;
	for (var i = 0; i < stacks; i++)
		this.mcserver.give(user.name, item.id, item.amount);
	return "success";
}

CommandHandler.prototype.cmd_tp = function(user, mode, args) {
	if (args.length != 1)
		return "invalid params";
	if (args[0] == "")
		return "invalid params";
	this.mcserver.tp(user.name, args[0]);
	return "success";
}

// Admin commands -----------------------------------------------------------

CommandHandler.prototype.cmd_status = function(user, mode, args) {
	if (args.length != 0)
		return "invalid params";
	return this.mcserver.stats_minejs + this.mcserver.stats_mcserver;
}

CommandHandler.prototype.cmd_restart = function(user, mode, args) {
	if (args.length != 0)
		return "invalid params";
	this.mcserver.restart();
	return "success";
}

CommandHandler.prototype.cmd_user = function(user, mode, args) {
	if (args.length < 1) {
		args.push('');
	}
	switch (args[0]) {
	case 'add':
		if (args.length != 2)
			return "invalid params";
		if (args[1] == "")
			return "invalid name";
		var newuser = this.userlist.add(args[1]);
		if (newuser == null)
			return "user already exists";
		this.userlist.save();
		return "added user '" + args[1] + "'";
	case 'remove':
		if (args.length != 2)
			return "invalid params";
		var removeuser = this.userlist.userByName(args[1]);
		if (removeuser == null)
			return "user '" + args[1] + "' does not exist";
		var permission = false;
		switch (user.role) {
		case 'user': permission = ['guest'].has(removeuser.role); break;
		case 'admin': permission = ['guest', 'user'].has(removeuser.role); break;
		case 'superadmin': permission = true; break;
		}
		if (!permission)
			return "no permission to remove user with '" + removeuser.role + "' role"
		this.userlist.remove(args[1]);
		this.userlist.save();
		return "removed user '" + args[1] + "'";
	case 'role':
		if (args.length != 3)
			return "invalid params";
		var changeuser = this.userlist.userByName(args[1]);
		if (changeuser == null)
			return "user '" + args[1] + "' does not exist";
		var role = args[2];
		if (!(role in this.userlist.roles))
			return "'" + role + "' is not a valid role";
		var permission = false;
		switch (user.role) {
		case 'user': permission = ['guest'].has(role); break;
		case 'admin': permission = ['guest', 'user'].has(role); break;
		case 'superadmin': permission = true;
		}
		if (!permission)
			return "no permission to set role '" + role + "'";
		changeuser.role = role;
		this.userlist.save();
		return "changed role for user '" + changeuser.name + "' to '" + role + "'";
	case 'password':
		if (args.length != 3)
			return "invalid params";
		var user = this.userlist.userByName(args[1]);
		if (user == null)
			return "user '" + args[1] + "' does not exist";
		if (args[2] == "")
			return "invalid password";
		user.password = args[2];
		this.userlist.save();
		return "changed password for user '" + args[1] + "'";
	default:
		var text = "";
		for (key in this.userlist.users)
			text += this.userlist.users[key].name + " (" + this.userlist.users[key].role + "), ";
		text = text.substr(0, text.length - 2);
		var objs = this.userlist.users;
		return this.return_by_mode(mode, text, text, objs);
	}
	return "success";
}

// Superadmin commands ------------------------------------------------------

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

CommandHandler.prototype.cmd_properties = function(user, mode, args) {
	if (args.length < 1) {
		args.push('');
	}
	switch (args[0]) {
	case 'set':
		if (args.length != 3)
			return "invalid params";
		if (!this.serverProperties.set(args[1], args[2]))
			return "invalid name";
		break;
	case 'get':
		if (args.length != 2)
			return "invalid params";
		var value = this.serverProperties.get(args[1]);
		return value == null ? "invalid name" : value;
	default:
		var text = "";
		for (var property in this.serverProperties.properties)
			text += property + "=" + this.serverProperties.properties[property] + "\n";
		var objs = this.serverProperties.properties;
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
function createCommandHandler(mcserver, userlist, serverProperties) {
	return new CommandHandler(mcserver, userlist, serverProperties);
}

module.exports.createCommandHandler = createCommandHandler;