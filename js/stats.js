showScores = function(players, table) {
    var scores = {}

    var html = "<tr><td></td>";
    for (let player of players) {
        html += '<th class="rotate"><div><span>'+ player +'</span></div></th>';
        scores[player] = 0;
    }
    html += "<tr>";

    for (var point in table) {
        html += "<tr><td>" + point + "</td>"
        for (let player of players) {
            html += "<td>"
            if (table[point].hasOwnProperty(player))
            {
                html+= "X";
                scores[player] += 1;
            }
            html += "</td>"
        }
        html+="</tr>";
    }

    html += "<tr><td></td>";
    for (var player in scores) {
        html += '<td>'+scores[player]+'</td>';
    }
    html += "<tr>";

    $("#score-table").html(html);
}

showPhotos = function(players, table) {
    var html = "<tr><td></td>";
    for (let player of players) {
        html += "<td>" + player + "</td>";
    }
    html += "<tr>";

    for (var point in table) {
        html += "<tr><td>" + point + "</td>"
        for (let player of players) {
            html += "<td>"
            if (table[point].hasOwnProperty(player))
            {
                table[point][player].forEach(function(image) {
                    html += "<img src='/upload/" + image + "' width='200px' />";
                });
            }
            html += "</td>"
        }
        html+="</tr>";
    }

    $("#photo-table").html(html);
}

$(document).ready(function() {
    UploadAPI.get(function (data) {
        var table = {}
        var players = new Set();
        data.forEach(function(upload) {
            if (!table.hasOwnProperty(upload.point))
                table[upload.point] = {};

            if (!table[upload.point].hasOwnProperty(upload.player))
                table[upload.point][upload.player] = [];

            table[upload.point][upload.player].push(upload.filename);

            players.add(upload.player);
        });

        showScores(players, table);
        showPhotos(players, table);
    });
});