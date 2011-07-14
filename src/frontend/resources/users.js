
var userList = require('userlist').instance;

exports.index = function(req, res) {
	res.render('users/index', { locals: {
		users: userList.users,
	}});
}
