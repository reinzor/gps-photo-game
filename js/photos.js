$(document).ready(function() {
    var width_min = 200;
    var width_max = 400;

    var height_min = 200;
    var height_max = 400;

    var images = [];
    var filenames = [];

    var colors = ['red', 'blue', 'green', 'white', 'black'];

    function getRandomSize(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    // -- Interval GUI update from server (locations of players) --
    setInterval(function() {
        UploadAPI.get(function(data) {
            var count = 0;
            data.forEach(function(image) {
                count++;
                if (filenames.indexOf(image.filename) == -1)
                {
                    filenames.push(image.filename);
                    images.push(image);

                    var height = getRandomSize(200, 400);
                    
                    var color = colors[Math.floor(Math.random()*colors.length)];

                    var html = '<div>';
                    html    += '<img src="/upload/'+image.filename+'" />';
                    html    += '</div>';

                    $('#photos').prepend(html);
                }
            });
            $("#photo-count").text(count);
        });
    }, 5000);
});