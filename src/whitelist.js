
var fs = require('fs');

var config = require('../config.js').config;

function WhiteList() {
	this.whitelist = [];
	this.filename = config.server.dir + '/white-list.txt';
	this.load();
}

// Adds a user to the white list
WhiteList.prototype.add = function(name) {
	if (this.whitelist.indexOf(name) < 0) {
		this.whitelist.push(name);
		this.save();
	}
}

// Removes a user from the white list
WhiteList.prototype.remove = function(name) {
	if (this.whitelist.indexOf(name) >= 0) {
		this.whitelist.splice(this.whitelist.indexOf(name), 1);
		this.save();
	}
}

// Loads the white list
WhiteList.prototype.load = function() {
	var data = fs.readFileSync(this.filename, 'ascii').replace('\r', '').replace(' ', '');
	this.whitelist = data.split('\n');
	if (this.whitelist[this.whitelist.length - 1] == "")
		this.whitelist.splice(this.whitelist.length - 1, 1);
}

// Saves the white list
WhiteList.prototype.save = function() {
	fs.writeFileSync(this.filename, this.whitelist.join('\n'), 'ascii');
}

function createWhiteList() {
	return new WhiteList();
}

module.exports.createWhiteList = createWhiteList;
