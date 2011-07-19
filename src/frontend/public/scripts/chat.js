
chat = null;

function initChat() {
	chat = new Chat();
}


function Chat() {
	this.users = [];
	this.activeChannel = 'chat';
	
	this.initTemplates();
	
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
		chat.output('chat', data.user, data.text);
	});
	client.on('console', function(data) {
		chat.output('console', null, data.text);
	});
	client.on('monitor', function(data) {
		chat.output('monitor', null, data.text);
	});
	client.onNotify('userListChanged', function() {
		chat.updateUserList();
	});
	

	// Register global keypress handlers
	$(document).keypress(function(e) {
		//force focus on chatinput for any key values
		$('#chat').show();
		
		// TODO this seems like a waste of time, caching element reference could help
		var element = $('#chat-input');
		
		switch (e.keyCode) {
		case 13: // Enter -> send message
			var text = element.val().toString();
			element.val('');
			chat.input(text);
			break;
		case 27: // Escape -> hide panel
			element.val('');
			$('#chat').hide();
			break;
		case 37: // Left -> go to left tab
			chat.prevChannel();
			break;
		case 39: // Right -> go to right tab
			chat.nextChannel();
			break;
		default: // Other keys -> show panel
			if ($(document.activeElement)[0] != element[0]) {
				element.focus();
				element.val(element.val() + String.fromCharCode(e.which));
			}
		}
	});
	
	$('#chat-minimize').click(function () {
		$("#chat").hide();
	});

	$('#chat-input').hover(function() {
		$("#chat").show();
	});

	$("#chat-dock").click(function () {
		$("#chat").css({'position' : '', 'z-index' : ''});
	}, function () {
		var cssObj = {
			'background-color' : '#ddd',
			'z-index' : '1200',
			'position' : 'fixed'
		};
		$("#chat").css(cssObj);
	});
	
	this.updateUserList();
}

// Max characters allowed on chat/console/monitor input
Chat.prototype.MaxInputLength = 200;

// Max number of lines of chat/console/monitor history
Chat.prototype.MaxHistory = 500;


Chat.prototype.channels = {
	chat: { element: '#chat-output-chat', template: 'chatLineTemplate' },
	console: { element: '#chat-output-console', template: 'consoleLineTemplate' },
	monitor: { element: '#chat-output-monitor', template: 'monitorLineTemplate' },
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
	${name}\
	{{if isFrontend}}[frontend]{{/if}}\
	{{if isPlaying}}[playing]{{/if}}\
	<br/>\
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
		var element = $(this.channels[key].element)
		if (key == channel) {
			element.show();
		} else {
			element.hide();
		}
	}

	$('#chat-output').attr({ scrollTop: $('#chat-output').attr("scrollHeight") });
}

Chat.prototype.input = function(text) {
	if (text.length < 1)
		return;
	// Limit input string in length
	if (text.length > this.MaxInputLength)
		text = text.substr(0, this.MaxInputLength);
		
	this.output(this.activeChannel, config.user, text);
	client.emit(this.activeChannel, { text: text });
}

Chat.prototype.output = function(channel, user, text) {
	var element = $(this.channels[channel].element);
	var template = this.channels[channel].template;
	var now = new Date;
	var lines = text.split('\n');
	for (var i = 0; i < lines.length; i++) {
		if (lines[i] == '')
			continue;
		$.tmpl(template, { time: now.toString('HH:MM:ss'), name: user, text: lines[i] }).appendTo(element);
	}
	
	while (element.children().length > this.MaxHistory)
		element.children(':first').remove();
		
	$('#chat-output').attr({ scrollTop: $('#chat-output').attr("scrollHeight") });
}


Chat.prototype.updateUserList = function() {
	$.getJSON('/users.json', function(data) {
		chat.users = data;
		chat.renderUserList();
	});
}

Chat.prototype.renderUserList = function() {
	var element = $('#chat-users');
	element.html('');
	$.each(this.users, function(key, user) {
		$.tmpl('userTemplate', user).appendTo(element);
	});
}
