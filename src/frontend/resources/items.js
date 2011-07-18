
var itemList = require('itemlist').instance;

exports.index = {
	json: function(req, res) {
		res.send({
			items: itemList.items,
			itemTags: itemList.tags,
			achievedItems: req.session.user.achievedItems,
		});
	},
}
