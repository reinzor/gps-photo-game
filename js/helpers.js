Helpers = {  
    getDistanceInMeter: function(lat1, lon1, lat2, lon2) {
      var R = 6371000; // Radius of the earth in m
      var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2-lon1); 
      var a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ; 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c; // Distance in km
      return d;
    },

    deg2rad: function(deg) {
      return deg * (Math.PI/180)
    },

    distanceToString: function(distance) {
      if (distance > 100)
        return "> 100 meter";
      else 
        return Math.round( distance * 10 ) / 10 + " meter"
    }
}
