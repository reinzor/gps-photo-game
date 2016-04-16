Data = {
    points: [],
    teams: [],

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

    addTeam: function(name) {
        this.teams.push(name);
    }
}

Data.addTeam("Team A");
Data.addTeam("Team B");
Data.addTeam("Team C");
Data.addTeam("Team D");
Data.addTeam("Team E");
Data.addTeam("Team A & OMG");

Data.addPoint("Point A", 51.458103799999996, 5.4764691, "This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description", "http://www.startpagina.nl/athene/dochters/tafeltennis/images/tafeltennis.jpg")
Data.addPoint("Point B", 51.40716, 6.035769, "This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description This is a simple description", "http://www.startpagina.nl/athene/dochters/tafeltennis/images/tafeltennis.jpg")