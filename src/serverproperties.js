var fs = require('fs');
var path = require('path');

var config = require('config').config;

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
};

// Removes a user from the white list
ServerProperties.prototype.get = function(name) {
	if (this.properties.hasOwnProperty(name)) {
		return this.properties[name];
	}
	return null;
};

// Loads the server properties
ServerProperties.prototype.load = function() {
	this.properties = {};
	var data;
	try {
		data = fs.readFileSync(this.filename, 'ascii').replace('\r', '');
	} catch (error) {
		log.warning('Cannot load server properties from ' + this.filename);
		return;
	}
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
};

// Saves the server properties
ServerProperties.prototype.save = function() {
	var text = "";
	for (var name in this.properties)
		text += name + "=" + this.properties[name] + "\n";
	fs.writeFileSync(this.filename, text, 'ascii');
};

var instance = new ServerProperties();

module.exports.instance = instance;
