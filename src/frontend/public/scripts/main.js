
$(document).ready(function() {
	initClient();
	initDashboard();
	initChat();
	
	//TODO backend should send this at index.jason query
	MaxLimitItems = 2048;

	//hide yellow news feed phrase
	$("#effect").hide();


	$('#nav-home').click(function () {

	});
	$('#nav-dash').click(function () {
		$('#framer').remove();
		$('#dashboard').show();

	});
	$('#nav-wiki').click(function () {
		$('#framer').remove();
		$('#main-pane').append('<div id="framer" class="framer"><iframe src="https://oom.ch/wiki/index.php/Minecraft" class="framer"></iframe></div>');
		$('#dashboard').hide();
		notify('shake',"DOn't ONLY READ THE GOODIES! write them!") // possible effects:    blind bounce clip drop explode fold highlight puff pulsate scale shake size slide;
	});
	$('#nav-mapi').click(function () {
		$('#framer').remove();
		$('#main-pane').append('<div id="framer" class="framer"><iframe src="http://mc.oom.ch/map/#/67/64/110/-4/mcmapNormal" class="framer"></iframe></div>');
		$('#dashboard').hide();

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



