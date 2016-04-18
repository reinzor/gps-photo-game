PhotoUpload = {
    isUploadSupported: function() {
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
            return false;
        }
        return true;
    },
    getOrientation: function(file, callback) {
        console.log("getOrientation");
      var reader = new FileReader();
      reader.onload = function(e) {
        console.log("onload reader");

        var view = new DataView(e.target.result);
        if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
        var length = view.byteLength, offset = 2;
        while (offset < length) {
          var marker = view.getUint16(offset, false);
          offset += 2;
          if (marker == 0xFFE1) {
            if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
            var little = view.getUint16(offset += 6, false) == 0x4949;
            offset += view.getUint32(offset + 4, little);
            var tags = view.getUint16(offset, little);
            offset += 2;
            for (var i = 0; i < tags; i++)
              if (view.getUint16(offset + (i * 12), little) == 0x0112)
                return callback(view.getUint16(offset + (i * 12) + 8, little));
          }
          else if ((marker & 0xFF00) != 0xFF00) break;
          else offset += view.getUint16(offset, false);
        }
        return callback(-1);
      };
      reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    },
    readFile: function(file) {
        console.log("Readfile");
        // Get the orientation
        window.PhotoUpload.getOrientation(file, function(orientation) {
            console.log("getOrientation callback");
            var reader = new FileReader();

            reader.onloadend = function () {
                console.log("callin process file");
                window.PhotoUpload.processFile(reader.result, file.type, orientation);
            }

            reader.onerror = function () {
                alert('There was an error reading the file!');
            }

            reader.readAsDataURL(file);
        });
    },
    processFile: function(dataURL, fileType, orientation) {
        var maxWidth = 800;
        var maxHeight = 800;

        var image = new Image();
        image.src = dataURL;

        image.onload = function () {
            var width = image.width;
            var height = image.height;

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
            
            // Construct the correct canvas size
            switch(orientation){
               case 8: // 90* CCW
                    canvas.height = newWidth;
                    canvas.width = newHeight;
                    break;
               case 6: // 90* CW
                    canvas.height = newWidth;
                    canvas.width = newHeight;
                    break;
                default:
                    canvas.width = newWidth;
                    canvas.height = newHeight;
            }

            // Set origin to center
            var context = canvas.getContext('2d');
            context.translate(canvas.width / 2, canvas.height / 2); // Origin to 0,0

            // Construct the correct canvas and turn context
            switch(orientation){
               case 8: // 90* CCW
                    context.rotate(-Math.PI / 2); // Rotate
                    break;
               case 3: 
                    context.rotate(Math.PI); // Rotate
                    break;
               case 6: 
                    context.rotate(Math.PI / 2); // Rotate
                    break;
            }

            context.drawImage(image, -newWidth / 2, -newHeight / 2 , newWidth, newHeight);  
            
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
            },
            error: function (data) {
                alert('Oeps, iets ging er fout bij je foto upload! Ajax error');
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
                console.log("Calling read file");
                PhotoUpload.readFile(file);
            } else {
                alert('Not a valid image!');
            }
        }
    });
} else {
    alert("File upload is not supported!");
}