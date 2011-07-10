
var fs = require('fs');

var config = require('../config.js').config;

function UserList() {
	this.users = [];
	this.filename = config.server.dir + '/white-list.txt';
	this.load();
}

// Adds a user to the user list
UserList.prototype.add = function(name) {
	if (this.users.indexOf(name) < 0) {
		this.users.push(name);
		this.save();
	}
}

// Removes a user from the user list
UserList.prototype.remove = function(name) {
	if (this.users.indexOf(name) >= 0) {
		this.users.splice(this.users.indexOf(name), 1);
		this.save();
	}
}

// Loads the user list
UserList.prototype.load = function() {
	var data = fs.readFileSync(this.filename, 'ascii').replace('\r', '').replace(' ', '');
	this.users = data.split('\n');
	if (this.users[this.users.length - 1] == "")
		this.users.splice(this.users.length - 1, 1);
}

// Saves the user list
UserList.prototype.save = function() {
	fs.writeFileSync(this.filename, this.users.join('\n'), 'ascii');
}

function createUserList() {
	return new UserList();
}

module.exports.createUserList = createUserList;
