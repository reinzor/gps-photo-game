GoogleMaps = {
    // map object
    map: null,
 
    // google markers objects
    markers: [],
 
    // google lat lng objects
    latLngs: [],
 
    // our formatted marker data objects
    markerIds: [],

    geoPositions: {},

    colors: [],
 
    // add a marker given our formatted marker data object
    addMarker: function(id, lat, long, title) {
        var gLatLng = new google.maps.LatLng(lat, long);
        var gMarker = new google.maps.Marker({
            position: gLatLng,
            map: this.map,
            title: title,
            // animation: google.maps.Animation.DROP,
            icon:'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|F00A73'
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
            mapTypeId: google.maps.MapTypeId.HYBRID,
            streetViewControl: false,
            mapTypeControl: false,
        };
 
        this.map = new google.maps.Map(
            document.getElementById(elementId),
            mapOptions
        );

    },

    updateGeoPosition: function(lat, long, key) {
        var LAT_LONG = new google.maps.LatLng(lat,long);

        if (!this.geoPositions[key]) {
            if (key == "me") {
                var color = "blue";
            } else {
                var color = Colors.random();
            }
            this.geoPositions[key] = new google.maps.Marker({
                position: LAT_LONG, 
                map: this.map, 
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    fillOpacity : 0.2,
                    fillColor : color,
                    scale: 20,
                    strokeWeight : 1,
                    strokeOpacity : 1.0,
                    strokeColor: color
                },
            });
            this.geoPositions[key].setMap(this.map);
        } else {
            this.geoPositions[key].setPosition(LAT_LONG);              
        }
    }
}