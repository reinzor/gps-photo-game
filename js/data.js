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
    }
}

Data.addPoint("Point A", 51.415214, 6.031944, "This is a simple description", "http://www.startpagina.nl/athene/dochters/tafeltennis/images/tafeltennis.jpg")
Data.addPoint("Point B", 51.40716, 6.035769, "This is a simple description", "http://www.startpagina.nl/athene/dochters/tafeltennis/images/tafeltennis.jpg")