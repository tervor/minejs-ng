
var fs = require('fs');

// Holds a list of all available minecraft items.
function ItemList()
{
	this.items = JSON.parse(fs.readFileSync(__dirname + '/items.json', 'ascii'));
	this.tags = JSON.parse(fs.readFileSync(__dirname + '/categories.json', 'ascii'));

	// TODO this should move somewhere else, or to the JSON file itself
	for (var i = 0; i < this.items.length; i++) {
		this.items[i].info = this.items[i].name;
		this.items[i].name = this.items[i].name.replace(' ', '_').toLowerCase();
	}
}

ItemList.prototype.itemByNameOrId = function(name) {
	for (var i = 0; i < this.items.length; i++) {
		item = this.items[i];
		if (item.name == name || item.id == name)
			return item;
	}
	return null;
}

function convert()
{
	var items = JSON.parse(fs.readFileSync(__dirname + '/items.old.json', 'ascii'));
	
	text = '[\n';
	
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		text += '{';
		text += '"id":' + item.id + ',';
		text += '"name":"' + item.name.toLowerCase().replace(' ', '_') + '",';
		text += '"alias":[],',
		text += '"tags":["all"],'
		text += '"info":"' + item.name + '",';
		text += '"amount":' + item.amount + '';
		if (i == items.length - 1)
			text += '}\n';
		else
			text += '},\n';
	}
	
	text += ']';
	
	fs.writeFileSync(__dirname + '/items.json', text, 'ascii')
}

//convert();

var instance = new ItemList();

module.exports.instance = instance;
