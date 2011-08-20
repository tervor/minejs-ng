
var itemList = require('itemlist').instance;

exports.index = {
	json: function(req, res) {
		res.send({
			items: itemList.items,
			kits: itemList.kits,
			itemTags: itemList.tags,
			itemMap: itemList.itemMap,
			achievedItems: req.session.user.achievedItems,
		});
	},
}
