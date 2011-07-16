
var userList = require('userlist').instance;

exports.index = {
	json: function(req, res) {
		res.send(userList.users);
	},
}
