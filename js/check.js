$(document).ready(function() {
    $.ajax({
        type: 'GET',
        url: '/get_uploads.php',
        contentType: false,
        processData: false,
        success: function (data) {
            var table = {}
            var players = new Set();
            data.forEach(function(image) {
                var re = /_[A-Za-z0-9]+_(.+)____(.+)\.jpg/g
                var fields = re.exec(image);

                var player = fields[1];
                var point = fields[2]

                if (!table.hasOwnProperty(point))
                    table[point] = {};

                if (!table[point].hasOwnProperty(player))
                    table[point][player] = [];

                table[point][player].push(image);

                players.add(player);
            });

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
                        html += "<img src='/upload/" + table[point][player] + "' />";
                    }
                    html += "</td>"
                }
                html+="</tr>";
            }

            $("#table").html(html);
        }
    });
});