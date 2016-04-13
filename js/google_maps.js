GoogleMaps = {
    // map object
    map: null,
 
    // google markers objects
    markers: [],
 
    // google lat lng objects
    latLngs: [],
 
    // our formatted marker data objects
    markerIds: [],

    geoPosition: null,
 
    // add a marker given our formatted marker data object
    addMarker: function(id, lat, long, title) {
        var gLatLng = new google.maps.LatLng(lat, long);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            title: title,
            // animation: google.maps.Animation.DROP,
            icon:'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        this.latLngs.push(gLatLng);
        this.markers.push(gMarker);
        this.markerIds.push(id);

        this.calcBounds();

        return gMarker;
    },
 
    // calculate and move the bound box based on our markers
    calcBounds: function() {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0, latLngLength = this.latLngs.length; i < latLngLength; i++) {
            bounds.extend(this.latLngs[i]);
        }
        this.map.fitBounds(bounds);
    },
  
    // intialize the map
    initialize: function(elementId) {
        console.log("[+] Intializing Google Maps...");
        var mapOptions = {
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.HYBRID
        };
 
        this.map = new google.maps.Map(
            document.getElementById(elementId),
            mapOptions
        );

    },

    updateGeoPosition: function(lat,long) {
        var LAT_LONG = new google.maps.LatLng(lat,long);

        if (!this.geoPosition) {
            this.geoPosition = new google.maps.Marker({
                position: LAT_LONG, 
                map: this.map, 
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillOpacity : 0.2,
                    fillColor : 'blue',
                    scale: 20,
                    strokeWeight : 1,
                    strokeOpacity : 1.0,
                    strokeColor: 'blue',
                },
            });
            this.geoPosition.setMap(this.map);
        } else {
            this.geoPosition.setPosition(LAT_LONG);              
        }
    }
}