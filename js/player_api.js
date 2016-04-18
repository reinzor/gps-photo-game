PlayerAPI = {
    update: function(id, latitude, longitude) {
        var formData = new FormData();

        formData.append('id', id);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        $.ajax({
            type: 'POST',
            url: '/player_api.php',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
            },
            error: function (data) {
                console.log(data)
            }
        });
    },
    get: function(callback) {
        $.ajax({
            type: 'GET',
            url: '/player_api.php',
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