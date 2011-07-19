
chat = null;

function initChat() {
	chat = new Chat();
}


function Chat() {
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
	

	$(document.body).keypress(function(e) {
		//force focus on chatinput for any key values
		$('chat-input').focus();

		//detect ENTER
		if (e.which == 13) {
			var element = $('#chat-input');
			var text = element.val().toString();
			element.val('');
			chat.input(text);
		}

		//show chatbox if hidden on chat events
		if ($("#chat").is(":hidden")) {
			$("#chat").show();
			$('#chat-input').focus();
		}
	});

	$('#chat-minimize').click(function () {
		$("#chat").hide();
	});

	$('#chat-input').hover(function() {
		$("#chat").show();
	});

	$('#chat-input').blur(function() {
		$('#chat').hide();
	});

	$('#chat-input').focus();
	$('#chat')
			.hover(
			function () {
				$(this).show();
			},
			function () {
				$(this).hide();
				('chat-input').focus();
			}
			//.draggable({ handle: "div.chathead" })
			//.resizable({ grid: [50, 50] }
	);

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
		var html = [];
		$.each(data, function(key, user) {
			html += user.name;
			if (user.isFrontend)
				html += ' [frontend]';
			if (user.isPlaying)
				html += ' [playing]';
			html += '<br/>'
		});
		$('#chat-users').html(html);
	});
}
