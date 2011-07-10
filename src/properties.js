
var fs = require('fs');

var config = require('../config.js').config;

function ServerProperties() {
	this.properties = {};
	this.filename = config.server.dir + '/server.properties';
	this.load();
}

// Adds a user to the white list
ServerProperties.prototype.set = function(name, value) {
	if (this.properties.hasOwnProperty(name)) {
		this.properties[name] = value;
		this.save();
		return true;
	}
	return false;
}

// Removes a user from the white list
ServerProperties.prototype.get = function(name) {
	if (this.properties.hasOwnProperty(name)) {
		return this.properties[name];
	}
	return null;
}

// Loads the server properties
ServerProperties.prototype.load = function() {
	this.properties = {};
	var data = fs.readFileSync(this.filename, 'ascii').replace('\r', '');
	var lines = data.split('\n');
	for (var i = 0; i < lines.length; i++) {
		var line = lines[i];
		if (line.length < 3)
			continue;
		if (line.charAt(0) == '#')
			continue;
		var tokens = line.split('=');
		if (tokens.length != 2)
			continue;
		this.properties[tokens[0]] = tokens[1];
	}
}

// Saves the server properties
ServerProperties.prototype.save = function() {
	var text = "";
	for (var name in this.properties)
		text += name + "=" + this.properties[name] + "\n";
	fs.writeFileSync(this.filename, text, 'ascii');
}

function createServerProperties() {
	return new ServerProperties();
}

module.exports.createServerProperties = createServerProperties;
