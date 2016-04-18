PointAPI = {
    get: function(callback) {
        $.ajax({
            type: 'GET',
            url: '/point_api.php',
            contentType: false,
            processData: false,
            success: function (data) {
                callback(data);
            },
            error: function (data) {
                console.log(data)
            }
        });
    }
}