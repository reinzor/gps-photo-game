// A $( document ).ready() block.
$( document ).ready(function() {
    // Check if photo upload is supported
    if (PhotoUpload.isUploadSupported()) {
        alert("Photo upload is supported!");
    }

    // Register continuous callback of GPS tracker
    GeoTracker.registerPositionCallback(function(lat, long) {
        alert("Position Update is supported!");
    });

    // Start geotracker
    GeoTracker.startTracker();
});