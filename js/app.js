// - - - - - - - - - SETUP (Init)- - - - - - - - - - -

// Check if photo upload is supported
if (PhotoUpload.isUploadSupported()) {
    console.log("Photo upload is supported!");
}
else {
    alert("Photo upload is not supported!");
}

// Team selection
var selectedTeam = null;
if (!selectedTeam) {
    $("#team-modal").show("modal");
}
Data.teams.forEach(function(team) {
    $('#team-select').append($("<option></option>").text(team)); 
});
$("#team-select").change(function() {
    selectedTeam = $("#team-select option:selected").text();
    $("#team-name").text(selectedTeam);
    $("#team-modal").hide("modal");
    GeoTracker.startTracker()
});
$("#team-name").click(function() {
    $("#team-modal").show("modal");
});

var distance_meter_treshold = 15;

// Setup map and loop over the data points and add to map 
GoogleMaps.initialize("map-canvas");
Data.points.forEach(function(point) {
    GoogleMaps.addMarker(point.id, point.position.latitude, point.position.longitude, point.name);
});

// - - - - - - - GPS Updates (Continuous) - - - - - - - - - -

// Register continuous callback of GPS tracker
GeoTracker.registerPositionCallback(function(lat, long) {
    PositionUpload.sendPosition(selectedTeam, lat, long);

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
        if (nearestPoint.distance < distance_meter_treshold) {
            userAtPoint(nearestPoint);
        } else {
            userNotAtPoint();
        }            
    }
});

// -- Interval GUI update from server --
setInterval(function() {
    $.ajax({
        type: 'GET',
        url: '/get_uploads.php',
        contentType: false,
        processData: false,
        success: function (data) {
            var count = 0;
            data.forEach(function(file) {
                if (file.startsWith(Helpers.sanitizeFileName(selectedTeam))) {
                    count++;
                }
            });
            $("#upload-count").text(count);
        }
    });
}, 5000);

// - - - - - - - Behavior @ Point (At Point) - - - - - - -

function userAtPoint(point)
{
    // Update Photo upload
    PhotoUpload.fileName = selectedTeam + "_" + point.name;

    // Update modal
    $("#title").text(point.title);
    $("#description").text(point.description);
    $("#image").text(point.image);

    // Show modal
    $("#point-modal").show("modal");
}

function userNotAtPoint()
{
    $("#point-modal").hide("modal");
}