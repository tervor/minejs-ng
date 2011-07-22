
var mapInitialized = false;

$(document).ready(function() {
	initClient();
	initDashboard();
	initChat();
	
	//hide yellow news feed phrase
	$("#effect").hide();

	$('#nav-dashboard').click(function () {
		$('#dashboard').show();
		$('#mcmap').hide();
		$('#framer').remove();
	});
	$('#nav-wiki').click(function () {
		$('#dashboard').hide();
		$('#mcmap').hide();
		$('#framer').remove();
		$('#main-pane').append('<div id="framer" class="framer"><iframe src="https://oom.ch/wiki/index.php/Minecraft" class="framer"></iframe></div>');
	});
	$('#nav-map').click(function () {
		$('#dashboard').hide();
		$('#mcmap').show();
		$('#framer').remove();
		if (!mapInitialized) {
			overviewerConfig.map = config.overviewer.map;
			overviewerConfig.mapTypes = config.overviewer.mapTypes;
			overviewer.util.initialize();
			mapView.open();
			mapInitialized = true;
		}
	});

/*	jQuery.getFeed({
		url: 'rss.xml',
		success: function(feed) {
			alert(feed.title);
		}
	});*/
	
	
});


/*
$('#clickme').click(function() {
	$('#book').animate({
		opacity: 0.25,
		left: '+=50',
		height: 'toggle'
	}, 5000, function() {
		// Animation complete.
	});
});

*/
function notify(effect, content) {
	// possible effects:    blind bounce clip drop explode fold highlight puff pulsate scale shake size slide

	console.log("DEBUG: " + effect);

	
	// most effect types need no options passed by default
	var options = {};
	// some effects have required parameters
	if (effect === "scale") {
		options = { percent: 100 };
	} else if (effect === "size") {
		options = { to: { width: '220px', height: '190px' }};
	}
	$('#effect').text(content);
	// run the effect
	$("#effect").show(effect, options, 2000, callback);
	
	return false;
//callback function to bring a hidden box back
	function callback() {
		console.log("called back");
		setTimeout(function() {
			$("#effect").fadeOut('slow', function() {
				// Animation complete.
			});
		}, 1000);

	}


}



