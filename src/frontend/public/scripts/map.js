
mapView = new MapView();

function MapView() {
	this.frame = null;
}

MapView.prototype.open = function() {
	setInterval(loadPlayerMarkers, 1000 * 15);
	setTimeout(loadPlayerMarkers, 1000);
}

MapView.prototype.close = function() {
	
}


var playerMarkers = null;
var warpMarkers = [];

function deletePlayerMarkers() {
  if (playerMarkers) {
    for (i in playerMarkers) {
      playerMarkers[i].setMap(null);
    }
    playerMarkers = null;
  }
}

function preparePlayerMarker(marker, user) {
	var c = "<div class=\"infoWindow\" style='width: 300px'><img src='/images/player.png'/><h1>" + user.name + "</h1></div>";
	var infowindow = new google.maps.InfoWindow({content: c});
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.open(overviewer.map,marker);
	});
}

function loadPlayerMarkers() {
	$.getJSON('/users.json', function(data) {
		deletePlayerMarkers();
		playerMarkers = [];
		for (var i in data) {
			var user = data[i];
			
			var converted = overviewer.util.fromWorldToLatLng(user.pos[0], user.pos[1], user.pos[2]);
			var marker =  new google.maps.Marker({
				position: converted,
				map: overviewer.map,
				title: user.name,
				icon: '/images/player.png',
				visible: true,
				zIndex: 999
			});
			playerMarkers.push(marker);
			preparePlayerMarker(marker, user);
		}
	});
}