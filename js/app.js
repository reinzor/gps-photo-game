Data = {
    points: [],
    addPoint: function(name, lat, long, description, image) {
        this.points.push({
            "id": this.points.length,
            "name": name,
            "position": {
                "latitude": lat,
                "longitude": long
            },
            "description" : description,
            "image" : image,
            "distance": 1e9
        });
    },
}

// A $( document ).ready() block.
$( document ).ready(function() {
    PointAPI.get(function(data) {
        data.forEach(function(point) {
            Data.addPoint(point.name, point.latitude, point.longitude, point.description, point.image);
        });

        // - - - - - - - - - SETUP (Init)- - - - - - - - - - -

        // Check if photo upload is supported
        if (PhotoUpload.isUploadSupported()) {
            console.log("Photo upload is supported!");
        }
        else {
            alert("Photo upload is not supported!");
        }

        // Select player id
        var playerId = $("#player").attr("data");

        // Start geotracker
        GeoTracker.startTracker();

        var distance_meter_treshold = 15;

        // Setup map and loop over the data points and add to map 
        GoogleMaps.initialize("map-canvas");
        Data.points.forEach(function(point) {
            GoogleMaps.addMarker(point.id, point.position.latitude, point.position.longitude, point.name);
        });

        // - - - - - - - GPS Updates (Continuous) - - - - - - - - - -

        // Register continuous callback of GPS tracker
        GeoTracker.registerPositionCallback(function(lat, long) {
            PlayerAPI.update(playerId, lat, long);

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
            GoogleMaps.updateGeoPosition(lat, long, "me");

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
                        if (file.includes(playerId)) {
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
            PhotoUpload.fileName = playerId + "_" + $("#player").text() + "____" + point.name;

            // Update modal
            $("#title").text(point.name);
            $("#description").text(point.description);
            $("#image").attr('src', point.image);

            // Show modal
            $("#point-modal").show("modal");
        }

        function userNotAtPoint()
        {
            $("#point-modal").hide("modal");
        }
    });
});