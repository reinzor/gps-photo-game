Data = {
    points: [],
    addPoint: function(name, lat, long, description, image, id) {
        this.points.push({
            "id": id,
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
    removePoint: function(id) {
        var i = Helpers.findWithAttr(this.points, 'id', id)
        if (i >= 0) {
            this.points.splice(i, 1);
        } else {
            console.log("Could not find point with id: " + id);
        }
    }
}

// A $( document ).ready() block.
$( document ).ready(function() {
    PointAPI.get(function(data) {
        data.forEach(function(point) {
            Data.addPoint(point.name, point.latitude, point.longitude, point.description, point.image, point.id);
        });

        // - - - - - - - - - SETUP (Init)- - - - - - - - - - -

        // Check if photo upload is supported
        if (UploadAPI.isUploadSupported()) {
            console.log("Photo upload is supported!");
        }
        else {
            alert("Photo upload is not supported!");
        }

        // Select player id
        var playerId = $("#player").attr("data");
        var pointId = -1;

        var distance_meter_treshold = 6;

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

        // Start geotracker
        GeoTracker.startTracker();

        // - - - - - - - Behavior @ Point (At Point) - - - - - - -

        function userAtPoint(point)
        {
            // Update pointId
            pointId = point.id;

            // Update modal
            $("#title").text(point.name);
            $("#description").text(point.description);
            $("#image").attr('src', point.image);

            // Show modal
            $("#point-modal").show("modal");

            // Make sure user can hide model
            $("#close-point-modal").click(function() {
                $("#point-modal").hide("modal");
            });
        }

        function userNotAtPoint()
        {
            $("#point-modal").hide("modal");
        }

        // Watch the #file for upload

        if (window.File && window.FileReader && window.FormData) {
            var $inputField = $('#file');

            $inputField.on('change', function (e) {
                var file = e.target.files[0];

                if (file) {
                    if (/^image\//i.test(file.type)) {
                        UploadAPI.uploadFile(file, playerId, pointId, function(data) {
                            if (data["success"]) {
                                $("#upload-count").text(data["num_uploads"]);
                                $("#point-modal").hide("modal");
                                $("#uploaded-modal").show("modal");
                                setTimeout(function() {
                                    $("#uploaded-modal").hide("modal");
                                }, 2000);
                                Data.removePoint(pointId);
                                GoogleMaps.removeMarker(pointId);
                            } else {
                                alert("Er is iets fout gegaan :(");
                                alert(data);
                            }
                        });
                    } else {
                        alert('Not a valid image!');
                    }
                }
            });
        } else {
            alert("File upload is not supported!");
        }
    });
});