
chat = null;

function initChat() {
	chat = new Chat();
}

function Chat() {
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

	$(document.body).keypress(function(e) {
		//force focus on chatinput for any key values
		$('chat-input').focus();

		//detect ENTER
		if (e.which == 13) {
			var input = $('#chat-input');
			var text = input.val().toString();
			if (text.length > 200)
				text = text.substr(0, 200);
			if (text.length > 0) {
				chat.outputChat(config.user, text);
				socket.emit('chat', { text: text});
				input.val('');
			}
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
		console.log("chatinput hover");
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
	
}

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
	console.log('selecting channel ' + channel);
}

Chat.prototype.outputChat = function(user, text) {
	var element = $('#chat-output');
	var now = new Date;
	$.tmpl('chatLineTemplate', { time: now.toString('hh:MM:ss'), name: user, text: text }).appendTo(element);
	element.attr({ scrollTop: element.attr("scrollHeight") });
}

Chat.prototype.outputConsole = function(text) {
	var element = $('#consoleoutput');
	$.tmpl('consoleLineTemplate', { text: text }).appendTo(element);
	element.attr({ scrollTop: element.attr("scrollHeight") });
}

Chat.prototype.outputMonitor = function(text) {
	var element = $('#monitoroutput');
	$.tmpl('monitorLineTemplate', { text: text }).appendTo(element);
	element.attr({ scrollTop: element.attr("scrollHeight") });
}
