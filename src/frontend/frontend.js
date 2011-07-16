
var net = require('net');
var url = require('url');
var events = require('events');
var util = require('util');
var express = require('express');
var MemStore = require('connect').session.MemoryStore;

require('express-resource');

var config = require('config').config;

var self = null;

var app = express.createServer();

var sessionStore = new MemStore({ reapInterval: 6000 * 10 });

app.configure(function() {
	app.use(express.logger());
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'minejsforpresident',
		store: sessionStore,
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

// Configuration

// Dynamically create javascript file containing client-side configuration
app.get('/scripts/config.js', function(req, res) {
	// Variables exported to the client-side
	var vars = {
		sid: req.sessionID || '',
		user: req.session.user.name,
		host: [ 'http://', config.socket.host, ':', config.socket.port ].join(''),
	};
	
	// Create javascript snippet containing the variables
	res.end('{ config = ' + JSON.stringify(vars) + '; }');
});

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
	res.render('index');
});

// Resources

app.resource('users', require('./resources/users'), requiresLogin);

var itemList = require('itemlist').instance;

app.listen(8008);

// Socket.IO server

function FrontendClient(socket, username) {
	this.socket = socket;
	this.user = userList.userByName(username);
	
	this.chat('console', 'Welcome to the minejs chat');
	
	this.socket.on('chat', function(data) {
		console.log(data.text);
		this.socket.broadcast.emit('chat', { user: this.user.name, text: data.text });
		instance.emit('chat', this, data.text);
	}.bind(this));
}

FrontendClient.prototype.chat = function(username, text) {
	this.socket.emit('chat', { user: username, text: text });
}

FrontendClient.prototype.notify = function(action, args) {
	this.socket.emit('notify', { action: action, args: args });
}

io = require('socket.io').listen(config.socket.port, config.socket.host);

io.configure(function() {
	io.set('log level', 0);
});

io.sockets.on('connection', function (socket) {
	socket.on('sid', function(data) {
		sessionStore.get(data.sid, function(error, session) {
			if (session && session.user) {
				var client = new FrontendClient(socket, session.user.name);
				instance.clients.push(client);
				socket.emit('accept');
				socket.client = client;
				instance.emit('connect', client);
			} else {
				socket.emit('deny');
			}
	    }.bind(socket));
	}.bind(socket));
	socket.on('disconnect', function(data) {
		if (socket.client) {
			instance.clients.splice(instance.clients.indexOf(socket.client), 1);
			instance.emit('disconnect', socket.client);
		}
	});
});


// Constructor
function Frontend() {
	events.EventEmitter.call(this);
	this.clients = [];
};

util.inherits(Frontend, events.EventEmitter);

Frontend.prototype.chat = function(user, text) {
	for (var i = 0; i < this.clients.length; i++)
		this.clients[i].chat(user, text);
}

Frontend.prototype.notify = function(action, args) {
	for (var i = 0; i < this.clients.length; i++)
		this.clients[i].notify(action, args);
}

var instance = new Frontend();

module.exports.instance = instance;
