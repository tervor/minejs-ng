
var fs = require('fs');

// Holds a list of all available minecraft items.
function ItemList()
{
	this.items = JSON.parse(fs.readFileSync(__dirname + '/items.json', 'ascii'));

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


var instance = new ItemList();

module.exports.instance = instance;
