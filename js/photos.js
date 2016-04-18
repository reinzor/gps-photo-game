$(document).ready(function() {
    var width_min = 200;
    var width_max = 400;

    var height_min = 200;
    var height_max = 400;

    var images = [];

    function getRandomSize(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    // -- Interval GUI update from server (locations of players) --
    setInterval(function() {
        $.ajax({
            type: 'GET',
            url: '/get_uploads.php',
            contentType: false,
            processData: false,
            success: function (data) {
                var count = 0;
                data.forEach(function(image) {
                    count++;
                    if (images.indexOf(image) == -1)
                    {
                        images.push(image)
                        $('#photos').prepend('<img src="/upload/'+image+'" alt="'+image+'">');
                    }
                });
                $("#photo-count").text(count);
            }
        });
    }, 1000);
});