
function updateUserList() {
	$.getJSON('/users.json', function(data) {
		console.log('JSON success');
		console.log(data);
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
