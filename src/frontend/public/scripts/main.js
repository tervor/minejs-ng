
$(document).ready(function() {
	initSocket();
	
	initDashboard();
	initChat();
	
	//TODO backend should send this at index.jason query
	MaxLimitItems = 2048;

	//hide yellow news feed phrase
	$("#effect").hide();

	function switchPanel(p) {
		switch (p) {

			case 'home':
				//hidde others
				if ($("#map"))
					$("#map").remove();
				if ($("#admin"))
					$('#admin').show();
				if ($("#sortable"))
					$("#sortable").hide();
				//show me
					
				break;

			case 'dashboard':
				//hidde others
				if ($("#map"))
					$("#map").remove();
				if ($("#admin"))
					$('#admin').show();
				//show me
				$('#sortable').show();
				break;

			case 'map':
				//hidde others
				if ($("#sortable"))
					$("#sortable").hide();
				if ($("#admin"))
					$('#admin').show();
				//show me
				$('body').append('<div id="map" class="map"><iframe src="http://mc.oom.ch/map/#/67/64/110/-4/mcmapNormal" class="framer"></iframe></div>');
				break;

			case 'admin':
				//hide others
				if ($("#sortable"))
					$("#sortable").hide();
				if ($("#map"))
					$("#map").remove();
				//show me
					$('#admin').show();
				break;

			default:
				alert("panelSwitchboard : Something went wrong, don't tell anyone")
		}
	}
});

//out of jQuery.ready functions.
function notify(effect, content) {
	// possible effects:    blind bounce clip drop explode fold highlight puff pulsate scale shake size slide
	console.log("DEBUG: " + effect);

	$('#notify').text(content);
	// most effect types need no options passed by default
	var options = {};
	// some effects have required parameters
	if (effect === "scale") {
		options = { percent: 100 };
	} else if (effect === "size") {
		options = { to: { width: 280, height: 185 } };
	}

	// run the effect
	$("#effect").show(effect, options, 500, callback);

	return false;


	//callback function to bring a hidden box back
	function callback() {
		setTimeout(function() {
			$("#effect:visible").removeAttr("style").fadeOut();
		}, 300);
	}
}
