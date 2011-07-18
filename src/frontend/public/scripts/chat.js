function initChat() {

	initChatTemplates();

	$(document.body).keypress(function(e) {
		//force focus on chatinput for any key values
		$('chatinput').focus();

		//detect ENTER
		if (e.which == 13) {
			var input = $('#chatinput');
			var text = input.val().toString();
			if (text.length > 200)
				text = text.substr(0, 200);
			if (text.length > 0) {
				chatWrite(config.user, text);
				socket.emit('chat', { text: text});
				input.val('');
			}
		}

		//show chatbox if hidden on chat events
		if ($("#chat").is(":hidden")) {
			$("#chat").show();
			$('#chatinput').focus();
		}
	});

	$('#chatminimize').click(function () {
		$("#chat").hide();
	});

	$('#chatinput').hover(function() {
		console.log("chatinput hover");
		$("#chat").show();
	});

	$('#chatinput').blur(function() {
		$('#chat').hide();
	});

	$('#chainput').focus();
	$('#chat')
			.hover(
			function () {
				$(this).show();
			},
			function () {
				$(this).hide();
				('chatinput').focus();
			}
			//.draggable({ handle: "div.chathead" })
			//.resizable({ grid: [50, 50] }
	);
}

function initChatTemplates() {
	console.log('init chat template');
	$.template('chatLineTemplate', "\
	<div class='chat-line'>\
		<div class='chat-line-time'>${time}</div>\
		<div class='chat-line-name'>${name}</div>\
		<div class='chat-line-text'>${text}</div>\
	</div>\
	");
}

function chatWrite(user, text) {
	var element = $('#chatoutput');
	var now = new Date;
	var time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
	$.tmpl('chatLineTemplate', { time: time, name: user, text: text }).appendTo(element);
	element.attr({ scrollTop: element.attr("scrollHeight") });
}
