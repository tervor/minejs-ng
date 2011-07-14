
var fs = require('fs');
var util = require('util');
var events = require('events');

var nbt = require('nbt');

var config = require('../config.js').config;

function User(name) {
	this.name = name;
	this.password = config.settings.default_user_password;
	this.datfile = "";
	this.role = config.settings.default_user_role;
	this.pos = [ 0.0, 0.0, 0.0 ];
	this.achievedItems = [];
}

User.prototype.init = function(settings) {
	var properties = ['password', 'datfile', 'role', 'pos'];
	for (var i = 0; i < properties.length; i++) {
		var property = properties[i];
		if (settings.hasOwnProperty(property))
			this[property] = settings[property];
	}
}

// Returns true if the user has permission for the queried role.
User.prototype.hasRole = function(role) {
	if (!(role in UserList.prototype.roles))
		return false;
	return (UserList.prototype.roles[role] >= UserList.prototype.roles[this.role]);
}

function UserList() {
	events.EventEmitter.call(this);
	this.users = {};
	this.filenameUserList = config.server.dir + '/user-list.json';
	this.filenameWhiteList = config.server.dir + '/white-list.txt';
	this.load();
	this.save();
	this.updateFromPlayerDat();
	
	log.debug(util.inspect(this.users));
}

util.inherits(UserList, events.EventEmitter);

// All available user roles
UserList.prototype.roles = { superadmin: 0, admin: 1, user: 2, guest: 3 }

// Adds a user to the user list. Returns null if user already exists or the
// newly created user.
UserList.prototype.add = function(name) {
	if (this.users.hasOwnProperty(name))
		return null;
	var user = new User(name);
	this.users[name] = user;
	return user;
}

// Removes a user from the user list. Returns null if used does not exist or
// the removed user.
UserList.prototype.remove = function(name) {
	if (!this.users.hasOwnProperty(name))
		return null;
	var user = this.users[name];
	delete this.users[name];
	return user;
}

// Returns a user by it's name or null if user does not exist.
UserList.prototype.userByName = function(name) {
	if (this.users.hasOwnProperty(name))
		return this.users[name];
	return null;
}

// Returns an array of the user names.
UserList.prototype.userNames = function() {
	var list = [];
	for (var user in this.users)
		list.push(user);
	return list;
}

// Loads the user list
UserList.prototype.load = function() {
	this.users = {};
	
	// Load user list from user-list.json
	try {
		users = JSON.parse(fs.readFileSync(this.filenameUserList));
		for (var user in users) {
			this.users[user] = new User(user);
			this.users[user].init(users[user]);
		}
	} catch (error) {
	}
	
	// Add admin user if not existant
	var admin;
	if (this.users.hasOwnProperty('admin')) {
		admin = this.users['admin'];
	} else {
		admin = new User('admin');
		this.users['admin'] = admin;
	}

	// Set admin properties
	admin.password = config.settings.admin_password;
	admin.role = "superadmin";
	
	return;
}

// Load additional user properties from player dat files.
// This currently reads the players position.
UserList.prototype.updateFromPlayerDat = function() {
	// Read additional user properties from player dat files
	// TODO get from server properties
	var world = 'world';
	var playerDir = config.server.dir + '/' + world + '/players/';

	// Go through all files in the player directory
	fs.readdir(playerDir, function(error, files) {
		for (var i = 0; i < files.length; i++) {
			var file = files[i];
			// Skip _tmp_.dat file
			if (file == '_tmp_.dat')
			 	continue;
			(function() {
				// Check if user exists
				var name = files[i].substr(0, files[i].length - 4);
				var user = this.userByName(name);
				if (user == null)
					return;
				// Read NBT file
				fs.readFile(playerDir + file, function(error, data) {
					// Parse NBT file
					nbt.parse(data, function(error, result) {
						this.updateUserDat(user, result);
						this.save();
					}.bind(this));
				}.bind(this));
			}.bind(this))();
		}
	}.bind(this));
}

UserList.prototype.updateUserDat = function(user, dat) {
	for (var i = 0; i < dat.Inventory.length; i++) {
		var id = dat.Inventory[i].id;
		if (!user.achievedItems.has(id)) {
			user.achievedItems.push(id);
			log.info("you achieved item " + id);
			this.emit('userAchievedItem', user, id);
		}
	}
	// Update position
	user.pos = dat.Pos;
	log.debug(user.name + " pos: " + user.pos);
//	log.debug(util.inspect(dat));
}

// Saves the user list
UserList.prototype.save = function() {
	fs.writeFileSync(this.filenameUserList, JSON.stringify(this.users));
	
	// Create white list based on user list
	fs.writeFileSync(this.filenameWhiteList, this.userNames().join('\n'), 'ascii');
}

var instance = new UserList();

module.exports.instance = instance;
