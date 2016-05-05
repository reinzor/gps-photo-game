<?php
include('./db_connection.php');

$id = mysql_real_escape_string($_GET["id"]);
$logout = mysql_real_escape_string($_GET["logout"]);
$player = null;
if ($id)
{
    $result = mysql_query("SELECT * FROM players WHERE id='".$id."'");
    if ($result && mysql_num_rows($result) == 1) 
    {
        $player = mysql_fetch_assoc($result);

        if ($player['open']) {
          setcookie($id, $id, time()+7200);  /* expire in 2 hours */

          // Update status to closed
          mysql_query("UPDATE players SET open=0 WHERE id='".$id."'");  
        } 
        else
        {
          // Check if we have a cookie for the id, then it is always legit:
          if (isset($_COOKIE[$id]))
          {
            if ($logout == TRUE)
            {
              // Update status to closed
              mysql_query("UPDATE players SET open=1 WHERE id='".$id."'"); 

              setcookie($id, "deleted", time() - 3600);
              echo "Succesvol uitgelogd";
              die();
            }
          }
          else
          {
            echo "Er is al iemand ingelogd met dit ID!";
            die();
          }
        }
    }
}

if (!$player)
{
  echo '<img src="http://baasvanhorstaandemaas.nl/wp-content/uploads/2015/11/logo3.png" /><br />&nbsp;<br />';
  echo '<img src="https://cdn.meme.am/instances/64789401.jpg" />';
  die();
}

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <title>Baas van Horst aan de Maas 2016 - Eindspel </title>

    <!-- Bootstrap css -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

    <!-- additional custom css -->
    <link rel="stylesheet" href="css/style.css">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <div class="navbar navbar-inverse navbar-fixed-top" role="navigation" id="header">
      <div class="container">
        <div class="navbar-header" style="width: 100%">
          <a class="navbar-brand" href="#" id="distance" style="float: left">Geen positie</a>
          <a href="/?id=<? echo $id ?>&amp;logout=1" onclick="return confirm('Uitloggen?')" style="float: right; color: black;" type="button" class="btn btn-default navbar-btn">
            <span class="glyphicon glyphicon-remove"></span>
          </a>
        </div>
      </div>
    </div>
    <div id="main">
      <div id="map" data-title="map" data-snap-ignore="true">
          <div id="map-canvas"> 
          </div>
      </div>
      <div id="point-modal" class="modal" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <button type="button" id="close-point-modal" class="close" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 class="modal-title" id="title">Modal title</h4>
            </div>
            <div class="modal-body">
              <a href="#" class="thumbnail">
                <img alt="100%x180" id="image" style="height: 180px; width: 100%; display: block;" src="https://www.google.nl/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png">
              </a>
              <p id="description">Description</p>
              <span class="btn btn-default btn-file">Upload foto!<input id="file" type="file" accept="image/*"></span>
            </div>
            <div class="modal-footer">
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->
      <div id="uploaded-modal" class="modal" role="dialog">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-body">
              Upload succesvol!
            </div>
          </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
      </div><!-- /.modal -->
    </div>
    <div id="footer" class="col-xs-12 navbar-inverse navbar-fixed-bottom">
        <div class="col-xs-6 text-center"><a href="#"><i class="glyphicon glyphicon-user"></i> <span id="player" data="<? echo $player['id']; ?>"><? echo $player['name'] ?></span></a></div>
        <div class="col-xs-6 text-center"><a href="#"><i class="glyphicon glyphicon-upload"></i> <span id="upload-count">0</span> foto's</a></div>
      </div>
    </div>

    <!-- Jquery -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js"></script>

    <!-- Bootstrap -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

    <!-- Google maps API -->
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?sensor=false"></script>

    <!-- Custom JS -->
    <script src="js/helpers.js"></script>
    <script src="js/colors.js"></script>

    <script src="js/google_maps.js"></script>
    <script src="js/geo_tracker.js"></script>

    <script src="js/upload_api.js"></script>
    <script src="js/player_api.js"></script>
    <script src="js/point_api.js"></script>

    <script src="js/app.js"></script>

  </body>
</html>