GeoTracker = {
  geoOptions : {
    enableHighAccuracy: true, 
    maximumAge        : 30000, 
    timeout           : 27000
  },

  latLongUpdateCallback : null,

  geoSuccess : function(p) {
    var lat = p.coords.latitude;
    var long = p.coords.longitude;

    console.log("GeoSuccess (" + lat + ", " + long + ")"); 
    window.GeoTracker.latLongUpdateCallback(lat, long);
  },

  geoError: function() {
    console.log("Sorry, no position available.");
  },

  forceLatLong:  function(lat, long) {
      var position = { "coords" : {"latitude":lat,"longitude":long} }
      this.geoSuccess(position);
  },

  registerPositionCallback: function(latLongUpdateCallback) {
    // positionUpdateCallbackFunction bind
    this.latLongUpdateCallback = latLongUpdateCallback

    // Variables for navigator
    var options = this.geoOptions;
    var succesCallback = this.geoSuccess;
    var errorCallback = this.geoError;
    var intervalTimeout = 1000;

    // Try setup every second
    var interval = setInterval(function() {
      var tracker = navigator.geolocation.watchPosition(succesCallback, errorCallback, options);
      clearInterval(interval);
    }, intervalTimeout);
  }
}
