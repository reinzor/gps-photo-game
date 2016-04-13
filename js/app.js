// - - - - - - - - - SETUP (Init)- - - - - - - - - - -

var distance_meter_treshold = 15;

// Setup map and loop over the data points and add to map 
GoogleMaps.initialize("map-canvas");
Data.points.forEach(function(point) {
    GoogleMaps.addMarker(point.id, point.position.latitude, point.position.longitude, point.name);
});

// - - - - - - - GPS Updates (Continuous) - - - - - - - - - -

// Register continuous callback of GPS tracker
GeoTracker.registerPositionCallback(function(lat, long) {
    // Update distances and get nearest point
    var nearestPoint = null;
    for (var i = 0; i < Data.points.length; ++i) {
        // Update current distance
        Data.points[i].distance = Helpers.getDistanceInMeter(Data.points[i].position.latitude, 
            Data.points[i].position.longitude, lat, long);

        if (!nearestPoint || Data.points[i].distance < nearestPoint.distance)
            nearestPoint = Data.points[i]
    }

    // Update position on map
    GoogleMaps.updateGeoPosition(lat, long);

    if (nearestPoint) {
        // Update information regarding nearest point
        console.log("Distance to nearest point: " + nearestPoint.distance);
        $("#distance").html(Helpers.distanceToString(nearestPoint.distance));

        // Check if the nearest point is closer than distance treshold
        if (nearestPoint.distance < distance_meter_treshold) 
            userAtPoint(nearestPoint);
    }
});

// - - - - - - - Behavior @ Point (At Point) - - - - - - -

function userAtPoint(point)
{
    console.log("We are at a point!");
    console.log(point);
}