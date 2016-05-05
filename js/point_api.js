PointAPI = {
    get: function(playerId, callback) {
        $.ajax({
            type: 'GET',
            url: '/point_api.php?player_id=' + playerId,
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