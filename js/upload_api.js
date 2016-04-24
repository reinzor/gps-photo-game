UploadAPI = {
    isUploadSupported: function() {
        if (navigator.userAgent.match(/(Android (1.0|1.1|1.5|1.6|2.0|2.1))|(Windows Phone (OS 7|8.0))|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
            return false;
        }
        return true;
    },
    getOrientation: function(file, callback) {
      var reader = new FileReader();
      reader.onload = function(e) {

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
    uploadFile: function(file, playerId, pointId, callbackFunction) {
        // Get the orientation
        window.UploadAPI.getOrientation(file, function(orientation) {
            var reader = new FileReader();

            reader.onloadend = function () {
                window.UploadAPI.processFile(reader.result, file.type, orientation, playerId, pointId, callbackFunction);
            }

            reader.onerror = function () {
                alert('There was an error reading the file!');
            }

            reader.readAsDataURL(file);
        });
    },
    processFile: function(dataURL, fileType, orientation, playerId, pointId, callbackFunction) {
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

            window.UploadAPI.sendFile(dataURL, playerId, pointId, callbackFunction);
        };

        image.onerror = function () {
            alert('There was an error processing your file!');
        };
    },
    sendFile: function(fileData, playerId, pointId, callbackFunction) {
        var formData = new FormData();

        formData.append('imageData', fileData);
        formData.append('playerId', playerId);
        formData.append('pointId', pointId);

        console.log("Sending file for player, point", playerId, pointId);

        $.ajax({
            type: 'POST',
            url: '/upload_api.php',
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                callbackFunction(data);
            },
            error: function (data) {
                alert('Oeps, kan de upload service niet bereiken :(. Probeer opnieuw!');
            }
        });
    },
    get: function(callbackFunction) {
        $.ajax({
            type: 'GET',
            url: '/upload_api.php',
            contentType: false,
            processData: false,
            success: function (data) {
                callbackFunction(data);
            },
            error: function (data) {
                alert('Oeps, kan de upload service niet bereiken :(. Probeer opnieuw!');
            }
        });
    }
}