nav = null;

function Nav() {
	nav = this;
	this.mapInitialized = false;
	this.wikiInitialized = false;
	this.elementTabs = $('#nav');
	this.initTemplates();
	this.render();
	this.selectTab('dashboard');
}

Nav.prototype.tabs = [
	{ name: 'dashboard', title: 'Dashboard', element: '#dashboard' },
	{ name: 'map', title: 'Map', element: '#mcmap' },
	{ name: 'wiki', title: 'Wiki', element: '#framer' },
	{ name: 'help', title: 'Help', element: '#help' },
	{ name: 'game', title: 'Game', element: '#game'}
];

// Initializes templates
Nav.prototype.initTemplates = function() {
	$.template('navTabTemplate', "\
	<div id='nav-tab-${name}' onclick='nav.selectTab(\"${name}\")'>${title}</div>\
	");
}

Nav.prototype.render = function() {
	this.elementTabs.html('');
	$.each(this.tabs, function(i, tab) {
		$.tmpl('navTabTemplate', tab).appendTo(nav.elementTabs);
	});
}

Nav.prototype.selectTab = function(name) {
	this.selectedTab = name;
	
	for (var i = 0; i < this.tabs.length; i++) {
		var tab = this.tabs[i];
		
		if (tab.name == this.selectedTab) {
			$(tab.element).show();
			$('#nav-tab-' + tab.name).addClass('selected');
			
			switch (tab.name) {
			case 'map':
				if (!nav.mapInitialized) {
					overviewerConfig.map = config.overviewer.map;
					overviewerConfig.mapTypes = config.overviewer.mapTypes;
					overviewer.util.initialize();
					mapView.open();
					nav.mapInitialized = true;
				}
				break;
			case 'wiki':
				if (!nav.wikiInitialized) {
					$('#main-pane').append('<div id="framer" class="framer"><iframe src="https://oom.ch/wiki/index.php/Minecraft" class="framer"></iframe></div>');
					nav.wikiInitialized = true;
				}
				break;
			case 'game':
				if (!nav.wikiInitialized) {
					$('#main-pane').append(" \
							<div style='z-index:1;'> \
								<applet style='z-index:1;' code='net.minecraft.Launcher' archive='https://s3.amazonaws.com/MinecraftDownload/launcher/MinecraftLauncher.jar?v=1310111031000' codebase='/game/' width='100%' height='100%'> \
									<param name='separate_jvm' value='true'> \
									<param name='java_arguments' value='-Dsun.java2d.noddraw=true -Dsun.awt.noerasebackground=true -Dsun.java2d.d3d=false -Dsun.java2d.opengl=false -Dsun.java2d.pmoffscreen=false -Xms512M -Xmx512M'> \
								</applet><br> \
								<p><pre><code> \
						</code></pre> \
							</div>");

					nav.wikiInitialized = true;
				}
				break;
			}
		} else {
			$(tab.element).hide();
			$('#nav-tab-' + tab.name).removeClass('selected');
		}
	}
}

$(document).ready(function() {
	new Nav;
	new Client();
	new Dashboard();
	new Chat();
	
	//hide yellow news feed phrase
	$("#effect").hide();

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



