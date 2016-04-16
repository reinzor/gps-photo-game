PositionUpload = {
    sendPosition: function(name, latitude, longitude) {
        var formData = new FormData();

        formData.append('name', name);
        formData.append('latitude', latitude);
        formData.append('longitude', longitude);

        $.ajax({
            type: 'POST',
            url: '/store_position.php',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log(data);
            },
            error: function (data) {
                console.log(data)
            }
        });
    }
}

// Watch the #file for upload

if (window.File && window.FileReader && window.FormData) {
    var $inputField = $('#file');

    $inputField.on('change', function (e) {
        var file = e.target.files[0];

        if (file) {
            if (/^image\//i.test(file.type)) {
                PhotoUpload.readFile(file);
            } else {
                alert('Not a valid image!');
            }
        }
    });
} else {
    alert("File upload is not supported!");
}