
chat = null;

function Chat() {
	chat = this;
	this.users = [];
	this.activeChannel = 'chat';

	this.elementChat = $('#chat');
	this.elementUsers = $('#chat-users');
	this.elementOutput = $('#chat-output');
	this.elementInput = $('#chat-input');

	this.initTemplates();
	
	// Adjust default panel view
	$("#main-pane").css({'height' : $(document).height()-380 });
	
	// Remove monitor tab if not superadmin
	if (config.role != 'superadmin') {
		delete (this.channels['monitor']);
		$('#chat-tab-monitor').hide();
	}

	// Bind click events for channel tabs
	$('#chat-tab-chat').click(function() {
		chat.selectChannel('chat');
	});
	$('#chat-tab-console').click(function() {
		chat.selectChannel('console');
	});
	$('#chat-tab-monitor').click(function() {
		chat.selectChannel('monitor');
	});

	this.selectChannel('chat');

	// Bind client events
	client.on('chat', function(data) {
		chat.output('chat', data.user, data.timestamp, data.text);
	});
	client.on('console', function(data) {
		chat.output('console', null, null, data.text);
	});
	client.on('monitor', function(data) {
		chat.output('monitor', null, null, data.text);
	});
	client.onNotify('userListChanged', function() {
		chat.updateUserList();
	});

	// Register global keypress handlers
	$(document).keydown(function(e) {
		var element = chat.elementInput;
		
		switch (e.keyCode) {
		case 13: // Enter -> send message
			chat.show();
			var text = element.val().toString();
			element.val('');
			chat.input(text);
			break;
		case 17: // ctrl -> preserve copy&past
			break;
		case 67: // c > preserve copy&past
			break;
		case 27: // Escape -> hide panel
			// Keeps firefox from restoring old text in input element
			element.blur(); element.focus();
			element.val('');
			chat.hide();
			break;
		case 37: // Left -> go to left tab
			chat.show();
			chat.prevChannel();
			break;
		case 39: // Right -> go to right tab
			chat.show();
			chat.nextChannel();
			break;
		default: // Other keys -> show panel
			chat.show();
			if ($(document.activeElement)[0] != element[0]) {
				element.focus();
			}
		}
	});
	
	// Start in minimized state
	this.minimize();
	
	setTimeout(function() {
		chat.resize();
	}, 0);
	
	$(window).resize(function() {
		chat.resize();
	});

	$('#chat-max').click(function() {
		chat.maximize();
	});

	$('#chat-min').click(function() {
		chat.minimize();
	});

	$('#chat-hide').click(function () {
		chat.hide();
	});

	$('#chat-input').click(function() {
		chat.show();
	});


/*does not exist in jquery? wtf -> api.jquery.com/dblclick/
	$('#chat-head').dblclick(function() {
		switch (panelInit) {
			case 0: // hidden;
				Panelsizer(panelInit);
				break;
			case 1: // small
				Panelsizer('2');
				break;
			case 2: // full
				Panelsizer('1');
				break;
			default: //
				console.log("panelInit no match: "+panelInit)
		}
	});
*/




	this.updateUserList();
}

// Max characters allowed on chat/console/monitor input
Chat.prototype.MaxInputLength = 200;

// Max number of lines of chat/console/monitor history
Chat.prototype.MaxHistory = 500;


Chat.prototype.channels = {
	chat: { name: 'chat', element: '#chat-output-chat', template: 'chatLineTemplate' },
	console: { name: 'console', element: '#chat-output-console', template: 'consoleLineTemplate' },
	monitor: { name: 'monitor', element: '#chat-output-monitor', template: 'monitorLineTemplate' }
};

Chat.prototype.channelOrder = ['chat', 'console', 'monitor'];


Chat.prototype.initTemplates = function() {
	$.template('chatLineTemplate', "\
	<div class='chat-line'>\
		<div class='chat-line-time'>${time}</div>\
		<div class='chat-line-name'>${name}</div>\
		<div class='chat-line-text'>${text}</div>\
	</div>\
	");
	
	$.template('consoleLineTemplate', "\
	<div class='console-line'>${text}</div>\
	");
	
	$.template('monitorLineTemplate', "\
	<div class='monitor-line'>${text}</div>\
	");

	$.template('userTemplate', "\
	{{if isFrontend || isPlaying}}\
		<div class='chat-user'>\
			<div class='chat-user-name'>${name}</div>\
			<div class='chat-user-playing {{if isPlaying}}active{{/if}}'/>\
			<div class='chat-user-whisper' onClick='chat.whisper(\"${name}\")'/>\
			<div class='chat-user-teleport' onClick='chat.teleport(\"${name}\")'/>\
		</div>\
	{{/if}}\
	");
}

Chat.prototype.nextChannel = function() {
	var index = this.channelOrder.indexOf(this.activeChannel);
	if (index < this.channelOrder.length - 1)
		this.selectChannel(this.channelOrder[index + 1]);
}

Chat.prototype.prevChannel = function() {
	var index = this.channelOrder.indexOf(this.activeChannel);
	if (index > 0)
		this.selectChannel(this.channelOrder[index - 1]);
}

Chat.prototype.selectChannel = function(channel) {
	if (!this.channels.hasOwnProperty(channel))
		return;
	this.activeChannel = channel;
	
	// Hide all channels but the selected one
	for (var key in this.channels) {
		var elementTab = $('#chat-tab-' + this.channels[key].name);
		var elementOutput = $('#chat-output-' + this.channels[key].name);
		if (key == channel) {
			elementTab.addClass('selected');
			elementOutput.show();
		} else {
			elementTab.removeClass('selected');
			elementOutput.hide();
		}
	}

	this.scrollBottom();
}

Chat.prototype.input = function(text) {
	if (text.length < 1)
		return;
	// Limit input string in length
	if (text.length > this.MaxInputLength)
		text = text.substr(0, this.MaxInputLength);
		
	client.emit(this.activeChannel, { text: text });
}

Chat.prototype.output = function(channel, user, timestamp, text) {
	var element = $(this.channels[channel].element);
	var template = this.channels[channel].template;
	var lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		if (lines[i] == '')
			continue;
		var time = new Date();
		time.setTime(timestamp * 1000);
		$.tmpl(template, { time: time.toString('HH:mm:ss'), name: user, text: lines[i] }).appendTo(element);
	}
	while (element.children().length > this.MaxHistory)
	element.children(':first').remove();
	this.scrollBottom();	
}


Chat.prototype.updateUserList = function() {
	$.getJSON('/users.json', function(data) {
		chat.users = data;
		chat.renderUserList();
	});
}

Chat.prototype.renderUserList = function() {
	this.elementUsers.html('');
	$.each(this.users, function(key, user) {
//		user.isPlaying = true; // TODO remove
		$.tmpl('userTemplate', user).appendTo(chat.elementUsers);
	});
}

Chat.prototype.scrollBottom = function() {
	var element = document.getElementById("chat-output");
	element.scrollTop = element.scrollHeight;
}

Chat.prototype.show = function() {
	this.elementChat.fadeIn('fast', function() {
		// Animation completed
	});
}

// Hides the chat panel
Chat.prototype.hide = function() {
	this.elementChat.fadeOut('fast', function() {
		// Animation completed
	});
}

// Minimizes the chat panel
Chat.prototype.minimize = function() {
	var h = $(document).height();

	$('#chat-min').hide();
	$('#chat-max').show();
	$("#chat").css({ 'height': '230px' });
	$("div#chat-output").css({ 'height': '192px' });
	$("div#chat-users").css({ 'height': '192px' });
}

// Maximizes the chat panel
Chat.prototype.maximize = function() {
	var h = $(document).height();
	var c = h - 173;
	
	$('#chat-max').hide();
	$('#chat-min').show();
	$('#chat').show();
	$("#chat").css({ 'height': h-135 });
	$("div#chat-output").css({ 'height': c });
	$("div#chat-users").css({ 'height': c });
}

// Called when the window is resized
Chat.prototype.resize = function() {
	var h = $(document).height();
	$("#main-pane").css({ 'height': h - 135 });
}

Chat.prototype.whisper = function(username) {
	console.log('whisper to ' + username);
}

Chat.prototype.teleport = function(username) {
	var answer = confirm('Want to teleport to ' + username + '?');
	if (answer) {
		client.tp(username);
	}
}
