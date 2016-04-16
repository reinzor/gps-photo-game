PhotoUpload = {
    isUploadSupported: function() {
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
            return false;
        }
        return true;
    },
    readFile: function(file) {
        var reader = new FileReader();

        reader.onloadend = function () {
            window.PhotoUpload.processFile(reader.result, file.type);
        }

        reader.onerror = function () {
            alert('There was an error reading the file!');
        }

        reader.readAsDataURL(file);
    },
    processFile: function(dataURL, fileType) {
        var maxWidth = 800;
        var maxHeight = 800;

        var image = new Image();
        image.src = dataURL;

        image.onload = function () {
            var width = image.width;
            var height = image.height;
            var shouldResize = (width > maxWidth) || (height > maxHeight);

            if (!shouldResize) {
                window.PhotoUpload.sendFile(dataURL);
                return;
            }

            var newWidth;
            var newHeight;

            if (width > height) {
                newHeight = height * (maxWidth / width);
                newWidth = maxWidth;
            } else {
                newWidth = width * (maxHeight / height);
                newHeight = maxHeight;
            }

            var canvas = document.createElement('canvas');

            canvas.width = newWidth;
            canvas.height = newHeight;

            var context = canvas.getContext('2d');

            context.drawImage(this, 0, 0, newWidth, newHeight);

            dataURL = canvas.toDataURL(fileType);

            window.PhotoUpload.sendFile(dataURL);
        };

        image.onerror = function () {
            alert('There was an error processing your file!');
        };
    },
    sendFile: function(fileData) {
        var formData = new FormData();

        formData.append('imageData', fileData);
        formData.append('name', window.PhotoUpload.fileName);

        $.ajax({
            type: 'POST',
            url: '/upload.php',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.success) {
                    alert('Foto succesvol geupload!');
                } else {
                    alert('Oeps, iets ging er fout bij je foto upload!');
                }
                document.getElementById("file").value = "";
            },
            error: function (data) {
                alert('Oeps, iets ging er fout bij je foto upload! Ajax error');
                document.getElementById("file").value = "";
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