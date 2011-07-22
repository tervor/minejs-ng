
$(document).ready(function() {
	$('#username').focus();
	
	$('#help').click(function() {
		$.blockUI({ message: "\
		<h1>Help</h1>\
		<p>To activate your user account for mine.js, log on to the minecraft server and change your password by entering the following on the text console:</p>\
		<p class='code'>passwd [your password]</p>\
		<p>Login to mine.js using your newly created password!</p>\
		<div id='close' class='close'>Close</div>\
		"});
		$('#close').click(function() {
			$.unblockUI();
		});
	})
	
	
	// Register global keypress handlers
	$(document).keydown(function(e) {
		switch (e.keyCode) {
		case 27: // Escape -> close help
			$.unblockUI();
			break;
		}
	});
	
});

