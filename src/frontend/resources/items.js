
var itemList = require('itemlist').instance;

exports.index = {
	json: function(req, res) {
		res.send(itemList.items);
	},
}
