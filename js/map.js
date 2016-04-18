// A $( document ).ready() block.
$( document ).ready(function() {
    // Setup map and loop over the data points and add to map 
    GoogleMaps.initialize("map-canvas");
    PointAPI.get(function(data) {
        data.forEach(function(point) {
            GoogleMaps.addMarker(point.id, point.latitude, point.longitude, point.name);
        });
    });

    // -- Interval GUI update from server (locations of players) --
    setInterval(function() {
        PlayerAPI.get(function(data) {
            var count = 0;
            data.forEach(function(position) {
                GoogleMaps.updateGeoPosition(position.latitude, position.longitude, position.name);
                count++;
            });
            $("#player-count").text(count);
        });
    }, 1000);
});