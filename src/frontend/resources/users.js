
var userList = require('userlist').instance;

exports.index = {
	default: function(req, res) {
		res.render('users/index', { locals: {
			users: userList.users,
		}});
	},
	json: function(req, res) {
		res.send(userList.users);
	},
}
