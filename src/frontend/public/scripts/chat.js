chat = null;
var panelInit=1;

function initChat() {

	chat = new Chat();

	//adjust default panel view
	h = $(document).height();
	h=h-380;
	$("#upper-pane").css({'height' : h });
}

function Chat() {
	this.users = [];
	this.activeChannel = 'chat';

	this.elementUsers = $('#chat-users');
	this.elementOutput = $('#chat-output');

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
	$(document).keydown(function(e) {
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
			// Keep firefox from restoring old text in input element
			element.blur(); element.focus();
			element.val('');
			//$('#chat').hide();
			Panelsizer(0);
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
			}
			Panelsizer(panelInit);
		}
	});


	//Panelizer adjusts the panel size as required
	function Panelsizer(action) {
		h=$(document).height();
		switch (action) {
			case 0: // hidden;
				h=h-135;
				$("#upper-pane").css({'height' : h });
				$('#chat').hide();
				$('#upper-pane').show();
				action = panelInit;
				break;
			case 1: // small
				h=h-380;
				$('#chat-min').hide();
				$('#chat-max').show();
				$('#chat').show();
				$('#upper-pane').show();
				$("#chat").css({'height' : '230px' });
				$("#upper-pane").css({'height' : h });
				$("div#chat-output").css({'height' : '194px' });
				$("div#chat-user").css({'height' : '194px' });
				break;
			case 2: // full
				c=h-171;
				h=h-135;
				$('#chat-max').hide();
				$('#chat-min').show();
				$('#chat').show();
				$('#upper-pane').hide();
				$("#chat").css({'height' : h });
				$("div#chat-output").css({'height' : c });
				$("div#chat-user").css({'height' : c });
				break;
			default: //
				console.log("DEBUG: something went wrong while Panelizer"+h)
		}
		panelInit = action;
	}

	//On Window Resize Trigger
	var resizeTimer;
	$(window).resize(function() {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(Panelsizer(panelInit), 100);
		console.log("resized");
	});

	$('#chat-max').click(function() {
		Panelsizer(2);
	});

	$('#chat-min').click(function() {
		Panelsizer(1);
	});

	$('#chat-hide').click(function () {
		Panelsizer(0);
	});

	$('#chat-input').click(function() {
		Panelsizer(panelInit);
	});












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

	this.scrollBottom();
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
		$.tmpl('userTemplate', user).appendTo(chat.elementUsers);
	});
}

Chat.prototype.scrollBottom = function() {
	this.elementOutput.attr({ scrollTop: this.elementOutput.attr("scrollHeight") });
}
