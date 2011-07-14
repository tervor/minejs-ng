
var net = require('net');
var events = require('events');
var util = require('util');
var express = require('express');
var MemStore = require('connect').session.MemoryStore;

require('express-resource');

var config = require('config').config;

var app = express.createServer();

app.configure(function() {
	app.use(express.logger());
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'minejsforpresident',
		store: MemStore({reapInterval: 6000 * 10}),
	}));
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true,
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.set('view options', {
	layout: 'layout.jade',
});

var pages = [
	{ title: 'Chat', link: 'chat', role: 'guest' },
	{ title: 'Items', link: 'items', role: 'user' },
	{ title: 'Users', link: 'users', role: 'admin' },
];

app.dynamicHelpers({
	session: function(req, res) {
		return req.session;
	},
	flash: function(req, res) {
		return req.flash();
	},
	pages: function(req, res) {
		if (req.session.user) {
			return pages;
		}
		return [];
	},
});

function requiresLogin(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('sessions/new?redir=' + req.url);
	}
};

// Session controller

var userList = require('userlist').instance;

app.get('/sessions/new', function(req, res) {
	res.render('sessions/new', { locals: {
		redir: req.query.redir
	}});
});

app.get('/sessions/destroy', function(req, res) {
	delete req.session.user;
	res.redirect('/');
});

app.post('/sessions', function(req, res) {
	var user = userList.userByName(req.body.username);
	if (user) {
		req.session.user = user;
		res.redirect(req.body.redir || '/')
	} else {
		req.flash('warn', 'Login failed.');
		res.render('sessions/new', { locals: {
			redir: req.body.redir
		}});
	}
});

// Home page controller

app.get('/', requiresLogin, function(req, res) {
	res.redirect('/chat');
});

// Chat page controller

app.get('/chat', requiresLogin, function(req, res) {
	res.render('chat/index');
});

// Items page controller

var itemList = require('itemlist').instance;

app.get('/items', requiresLogin, function(req, res) {
	res.render('items/index', { locals: {
		items: itemList.items,
	}});
});

// User page controller

app.resource('users', require('./resources/users'), requiresLogin);

/*
app.get('/users', requiresLogin, function(req, res) {
	res.render('users/index', { locals: {
		users: userList.users,
	}});
});
*/

// Socket.IO server

var io = require('socket.io').listen(9000);

io.sockets.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

app.listen(8008);




// Constructor
function Frontend() {
	events.EventEmitter.call(this);
};

util.inherits(Frontend, events.EventEmitter);

function createFrontend() {
	return new Frontend();
}

module.exports.createFrontend = createFrontend;
