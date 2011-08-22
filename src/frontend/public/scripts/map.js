
mapView = new MapView();


function MapView() {
	this.frame = null;
	this.showUsers = true;
	this.showOffline = false;
	this.showNames = true;
	this.playerMarkers = [];
}

MapView.prototype.open = function() {
	setInterval(this.updatePlayerMarkers, 1000 * 15);

	// overlay maps control
	var items = [];
	items.push({
		'label':	'Show users',
		'checked':	mapView.showUsers,
		'action':	function(i, item, checked) {
			// FIXME all handlers are handled in the last action of the item list
		}
	});
	items.push({
		'label':	'Show offline users',
		'checked':	mapView.showOffline,
		'action':	function(i, item, checked) {
			// FIXME all handlers are handled in the last action of the item list
		}
	});
	items.push({
		'label':	'Show names',
		'checked':	mapView.showNames,
		'action':	function(i, item, checked) {
			// FIXME ugly ugly hack
			if (item.label == 'Show users')
				mapView.showUsers = checked;
			else if (item.label == 'Show offline users')
				mapView.showOffline = checked;
			else if (item.label == 'Show names')
				mapView.showNames = checked;
			mapView.updatePlayerMarkers();
		}
	});
	overviewer.util.createDropDown('Options', items);
}

MapView.prototype.close = function() {
	
}

MapView.prototype.deletePlayerMarkers = function() {
	for (var i = 0; i < this.playerMarkers.length; i++) {
		this.playerMarkers[i].setMap(null);
	}
	this.playerMarkers = [];
}

MapView.prototype.preparePlayerMarker = function(marker, user) {
	var c = "<div class=\"infoWindow\" style='width: 300px'><img src='/images/player.png'/><h1>" + user.name + "</h1></div>";
	var infowindow = new google.maps.InfoWindow({content: c});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(overviewer.map, marker);
	});
}

MapView.prototype.updatePlayerMarkers = function() {
	$.getJSON('/users.json', function(data) {
		mapView.deletePlayerMarkers();
		if (!mapView.showUsers)
			return;
		for (var i in data) {
			var user = data[i];
			if (user.name == 'admin')
				continue;
			if (!mapView.showOffline & !user.isPlaying)
				continue;
			var labelClass = 'map-user';
			labelClass += user.isPlaying ? ' map-user-online' : ' map-user-offline';
			if (!mapView.showNames)
				labelClass += ' map-user-hidden';

			var converted = overviewer.util.fromWorldToLatLng(user.pos[0], user.pos[1], user.pos[2]);
			var marker =  new MarkerWithLabel({
				position: converted,
				map: overviewer.map,
				title: user.name,
				icon: '/images/player.png',
				visible: true,
				zIndex: 999,
				labelContent: user.name,
				labelAnchor: new google.maps.Point(22, 0),
				labelClass: labelClass,
				labelStyle: {},
			});
			mapView.preparePlayerMarker(marker, user);
			mapView.playerMarkers.push(marker);
		}
	});
}