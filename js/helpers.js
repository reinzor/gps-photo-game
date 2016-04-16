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
    },

    sanitizeFileName: function(unsafe) {
      return unsafe
        .replace(/ /gi, '_')
        .replace(/"/gi, '_')
        .replace(/'/gi, '_')
        .replace(/&/gi, '_')
        .replace(/\//gi, '_')
        .replace(/\\/gi, '_')
        .replace(/\?/gi, '_')
        .replace(/#/gi, '_')
    },

    timeStamp: function() {
      // Create a date object with the current time
      var now = new Date();

      // Create an array with the current month, day and time
      var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];

      // Create an array with the current hour, minute and second
      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];

      // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i];
        }
      }

      // Return the formatted string
      return time.join(":");
    }
}
