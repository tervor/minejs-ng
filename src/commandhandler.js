
var events = require('events');
var util = require('util');
var fs = require('fs');

var config = require('config').config;


// The CommandHandler class implements all the advanced commands that can be
// issued through the different interfaces (http, ingame, telnet) to the
// minejs server.
function CommandHandler(mcserver, userList, itemList, serverProperties) {
	events.EventEmitter.call(this);
	this.mcserver = mcserver;
	this.userList = userList;
	this.itemList = itemList;
	this.serverProperties = serverProperties;
}

util.inherits(CommandHandler, events.EventEmitter);

// List of handlers to be called when commands are executed.
// Make sure that a handler function of type cmd_xxx(user, mode, args) with the same name actually
// exists in this class for every registered command handler.
CommandHandler.prototype.cmd_handlers = {
	// Guest commands
	cmd_help: 		{	name: 'help', args: [], role: 'guest',
						info: 'Shows help screen' },
	cmd_say: 		{	name: 'say', args: ['text'], role: 'guest',
						info: 'Say something' },
	cmd_tell: 		{	name: 'tell', args: ['user', 'text'], role: 'guest',
						info: 'Tells user something' },
	cmd_list: 		{	name: 'list', args: [], role: 'guest',
						info: 'List connected users' }, 
	cmd_items: 		{	name: 'items', args: ['prefix'], role: 'guest',
						info: 'List items with prefix' },
	cmd_kits: 		{	name: 'kits', args: ['prefix'], role: 'guest',
						info: 'List kits with prefix' },
	cmd_passwd: 	{	name: 'passwd', args: ['password'], role: 'guest',
						info: 'Change your password' },
	// User commands
	cmd_give: 		{	name: 'give', args: ['name', 'count'], role: 'user',
						info: 'Gives items' },
	cmd_stack: 		{	name: 'stack', args: ['name', 'count'], role: 'user',
						info: 'Gives stacks' },
	cmd_kit: 		{	name: 'kit', args: ['name'], role: 'user',
						info: 'Gives a kit' },
	cmd_tp: 		{	name: 'tp', args: ['target'], role: 'user',
	 					info: 'Teleport to target' },
	cmd_user: 		{	name: 'user', args: ['action', 'name', 'value'], role: 'user',
						info: 'Edit user list' },
	// Admin commands
	cmd_status: 	{	name: 'status', args: [], role: 'admin',
						info: 'Shows server status' },
	cmd_restart: 	{	name: 'restart', args: [], role: 'admin',
						info: 'Restarts the server' },
	// Superadmin commands
	cmd_save: 		{	name: 'save', args: ['action'], role: 'superadmin',
						info: 'Save on/off' },
	cmd_properties: {	name: 'properties', args: ['action', 'name', 'value'], role: 'superadmin',
						info: 'Edit server properties' },
}

// Parses and executes a command.
// This is normally the entry point for text based interfaces (ingame, telnet).
// Returns null if unknown command, returns string otherwise.
CommandHandler.prototype.parseExecute = function(username, mode, text) {
	// Split values into arguments
	var args = text.split(' ');
	var cmd = args[0];
	args = args.splice(1, args.length - 1);
			
	return this.execute(username, mode, cmd, args);
}

CommandHandler.prototype.mapExecute = function(username, mode, cmd, args) {
	var handler = this.cmdHandlerByName(cmd);
	if (!handler)
		return 'unknown command';
		
	var sortedArgs = [];
	for (var i = 0; i < handler.args.length; i++) {
		var arg = handler.args[i];
		if (args.hasOwnProperty(arg)) {
			sortedArgs.push(args[arg]);
		} else {
			sortedArgs.push('');
		}
	}

	return this.execute(username, mode, cmd, sortedArgs);
}

CommandHandler.prototype.execute = function(username, mode, cmd, args) {
	// Get user
	var user = this.userList.userByName(username);
	// Get comand handler
	var handler = this.cmdHandlerByName(cmd);
	if (!handler)
		return 'unknown command';
	
	// Check user permission
	// Allow guest commands even if user is not available
	if (user) {
		if (!user.hasRole(handler.role))
			return 'permission denied';
	} else {
		if (handler.role != 'guest')
			return 'unknown user';
	}
	
	for (handler in this.cmd_handlers)
		if (cmd == this.cmd_handlers[handler].name)
			return this[handler](user, mode, args);
			
	return 'unexpected error';
}

CommandHandler.prototype.cmdHandlerByName = function(cmd) {
	for (var handler in this.cmd_handlers)
		if (cmd == this.cmd_handlers[handler].name)
			return this.cmd_handlers[handler];
	return null;
}

// Guest commands -----------------------------------------------------------

CommandHandler.prototype.cmd_help = function(user, mode, args) {
	if (args.length != 0)
		return 'invalid params';
	var text = '';
	var objs = [];
	text += 'Available commands:\n';
	for (var cmd in this.cmd_handlers) {
		var handler = this.cmd_handlers[cmd];
		// Skip commands which are not accessible by user
		if (user != null && !user.hasRole(this.cmd_handlers[cmd].role))
			continue;
		if (mode == 'console')
			text += '//';
		text += handler.name;
		if (handler.args.length > 0)
			text += ' [' + handler.args.join('] [') + ']';
		text += ' - ' + handler.info + '\n';
		objs.push({ name: handler.name, args: handler.args, info: handler.info });
	}
	
	return this.returnByMode(mode, text, text, objs);
}

CommandHandler.prototype.cmd_say = function(user, mode, args) {
	if (args.length != 1)
		return 'invalid params';
	if (args[0] == '')
		return 'invalid params';
	this.mcserver.say(args[0]);
	return 'success';
}

CommandHandler.prototype.cmd_tell = function(user, mode, args) {
	if (args.length != 2)
		return 'invalid params';
	if (args[0] == '')
		return 'invalid params';
	if (args[1] == '')
		return 'invalid params';
	this.mcserver.tell(args[0], args[1]);
	return 'success';
}

CommandHandler.prototype.cmd_list = function(user, mode, args) {
	var text = this.mcserver.users.join(',');
	var objs = this.mcserver.users;
	return this.returnByMode(mode, text, text, objs);
}

CommandHandler.prototype.cmd_items = function(user, mode, args) {
	var text = '';
	var objs = [];
	for (var i = 0; i < this.itemList.items.length; i++) {
		var item = this.itemList.items[i];
		if (args.length > 0)
			if (item.name.substr(0, args[0].length) != args[0])
				continue;
		text += item.name + ' (' + item.id + ')\n';
		objs.push({ id: item.id, name: item.name, info: item.info, amount: item.amount });
	}
	return this.returnByMode(mode, text, text, objs);
}

CommandHandler.prototype.cmd_kits = function(user, mode, args) {
	var text = '';
	var objs = [];
	for (var i = 0; i < this.itemList.kits.length; i++) {
		var kit = this.itemList.kits[i];
		if (args.length > 0)
			if (kit.name.substr(0, args[0].length) != args[0])
				continue;
		text += kit.name + ' (' + kit.info + ')\n';
		objs.push({ name: kit.name, info: kit.info, items: kit.items });
	}
	return this.returnByMode(mode, text, text, objs);
}

CommandHandler.prototype.cmd_passwd = function(user, mode, args) {
	if (args.length != 1)
		return 'invalid params';
	if (args[0] == '')
		return 'invalid params';
	user.setPassword(args[0]);
	return 'success';
}

// User commands ------------------------------------------------------------

CommandHandler.prototype.cmd_give = function(user, mode, args) {
	if (args.length == 1)
		args.push(1);
	if (args.length != 2)
		return 'invalid params';
	if (args[1] == '')
		return 'invalid params';
	var item = this.itemList.itemByNameOrId(args[0]);
	if (item == null)
		return 'invalid item';
	var left = args[1];
	var stacks = 0;
	while (left > 0) {
		var num = left > item.amount ? item.amount : left;
		this.mcserver.give(user.name, item.id, num);
		left -= num;
		stacks++;
		if (stacks >= config.settings.maxStacks)
			break;
	}
	return 'success';
}

CommandHandler.prototype.cmd_stack = function(user, mode, args) {
	if (args.length == 1)
		args.push(1);
	if (args.length != 2)
		return 'invalid params';
	if (args[1] == '')
		return 'invalid params';
	var item = this.itemList.itemByNameOrId(args[0]);
	if (item == null)
		return 'invalid item';
	var stacks = args[1];
	if (stacks > config.settings.maxStacks)
		stacks = config.settings.maxStacks;
	for (var i = 0; i < stacks; i++)
		this.mcserver.give(user.name, item.id, item.amount);
	return 'success';
}

CommandHandler.prototype.cmd_kit = function(user, mode, args) {
	if (args.length != 1)
		return 'invalid params';
	var kit = this.itemList.kitByName(args[0]);
	if (kit == null)
		return 'invalid name';
	for (var i = 0; i < kit.items.length; i++) {
		var kititem = kit.items[i];
		var item = this.itemList.itemByNameOrId(kititem.id);
		if (!item)
			continue;
		for (var j = 0; j < kititem.amount; j++)
			this.mcserver.give(user.name, item.id, item.amount);
	}
	return 'success';
}

CommandHandler.prototype.cmd_tp = function(user, mode, args) {
	if (args.length != 1)
		return 'invalid params';
	if (args[0] == '')
		return 'invalid params';
	this.mcserver.tp(user.name, args[0]);
	return 'success';
}

// Admin commands -----------------------------------------------------------

CommandHandler.prototype.cmd_status = function(user, mode, args) {
	if (args.length != 0)
		return 'invalid params';
	var obj = this.mcserver.serverStatus;
	var text = util.inspect(obj);
	return this.returnByMode(mode, text, text, obj);
}

CommandHandler.prototype.cmd_restart = function(user, mode, args) {
	if (args.length != 0)
		return 'invalid params';
	this.mcserver.restart();
	return 'success';
}

CommandHandler.prototype.cmd_user = function(user, mode, args) {
	if (args.length < 1) {
		args.push('');
	}
	switch (args[0]) {
	case 'add':
		if (args.length != 2)
			return 'invalid params';
		if (args[1] == '')
			return 'invalid name';
		var newuser = this.userList.add(args[1]);
		if (newuser == null)
			return 'user already exists';
		this.userList.save();
		return 'added user ' + args[1];
	case 'remove':
		if (args.length != 2)
			return 'invalid params';
		var removeuser = this.userList.userByName(args[1]);
		if (removeuser == null)
			return 'user ' + args[1] + ' does not exist';
		var permission = false;
		switch (user.role) {
		case 'user': permission = ['guest'].has(removeuser.role); break;
		case 'admin': permission = ['guest', 'user'].has(removeuser.role); break;
		case 'superadmin': permission = true; break;
		}
		if (!permission)
			return 'no permission to remove user with ' + removeuser.role + ' role'
		this.userList.remove(args[1]);
		this.userList.save();
		return 'removed user ' + args[1];
	case 'role':
		if (args.length != 3)
			return 'invalid params';
		var changeuser = this.userList.userByName(args[1]);
		if (changeuser == null)
			return 'user ' + args[1] + ' does not exist';
		var role = args[2];
		if (!(role in this.userList.roles))
			return role + ' is not a valid role';
		var permission = false;
		switch (user.role) {
		case 'user': permission = ['guest'].has(role); break;
		case 'admin': permission = ['guest', 'user'].has(role); break;
		case 'superadmin': permission = true;
		}
		if (!permission)
			return 'no permission to set role ' + role;
		changeuser.role = role;
		this.userList.save();
		return 'changed role for user ' + changeuser.name + ' to ' + role;
	case 'password':
		if (args.length != 3)
			return 'invalid params';
		var user = this.userList.userByName(args[1]);
		if (user == null)
			return 'user ' + args[1] + ' does not exist';
		if (args[2] == '')
			return 'invalid password';
		user.setPassword(args[2]);
		this.userList.save();
		return 'changed password for user ' + args[1];
	default:
		var text = '';
		for (key in this.userList.users)
			text += this.userList.users[key].name + ' (' + this.userList.users[key].role + '), ';
		text = text.substr(0, text.length - 2);
		var objs = this.userList.users;
		return this.returnByMode(mode, text, text, objs);
	}
	return 'success';
}

// Superadmin commands ------------------------------------------------------

CommandHandler.prototype.cmd_save = function(user, mode, args) {
	if (args.length != 1)
		return 'invalid params';
	switch (args[0]) {
	case 'on':
		this.mcserver.saveOn();
		this.mcserver.saveAll();
		break;
	case 'off':
		this.mcserver.saveOff();
		this.mcserver.saveAll();
		break;
	default:
		return 'invalid action';
	}
	return 'success';
}

CommandHandler.prototype.cmd_properties = function(user, mode, args) {
	if (args.length < 1) {
		args.push('');
	}
	switch (args[0]) {
	case 'set':
		if (args.length != 3)
			return 'invalid params';
		if (!this.serverProperties.set(args[1], args[2]))
			return 'invalid name';
		break;
	case 'get':
		if (args.length != 2)
			return 'invalid params';
		var value = this.serverProperties.get(args[1]);
		return value == null ? 'invalid name' : value;
	default:
		var text = '';
		for (var property in this.serverProperties.properties)
			text += property + '=' + this.serverProperties.properties[property] + '\n';
		var objs = this.serverProperties.properties;
		return this.returnByMode(mode, text, text, objs);
	}
	return 'success';
}


CommandHandler.prototype.returnByMode = function(mode, console, telnet, web)
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
function createCommandHandler(mcserver, userList, itemList, serverProperties) {
	return new CommandHandler(mcserver, userList, itemList, serverProperties);
}

module.exports.createCommandHandler = createCommandHandler;