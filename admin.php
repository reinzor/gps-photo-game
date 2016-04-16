<?php
$servername = "localhost";
$username = "deb88327_baas";
$password = "banana";
$databasename = "deb88327_eindspel";

include "phpqrcode/qrlib.php";

$conn = mysql_connect($servername, $username, $password);
if (!$conn) {
    die('Not connected : ' . mysql_error());
}

// make foo the current db
$db = mysql_select_db($databasename, $conn);
if (!$db) {
    die ('Can\'t use ' . $databasename . ' : ' . mysql_error());
}

$view = $_GET['view'];
$action = $_GET['action'];

// -------------------

function isToken($token)
{
    if (isset($token) && $token) {

        //verification values in BD
        $query = "SELECT id FROM balls WHERE code='$token'";
        $sql = mysql_query($query);
        if (mysql_num_rows($sql) > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function generateUniqueToken($number)
{
    $arr = array('a', 'b', 'c', 'd', 'e', 'f',
                 'g', 'h', 'i', 'j', 'k', 'l',
                 'm', 'n', 'o', 'p', 'r', 's',
                 't', 'u', 'v', 'x', 'y', 'z',
                 'A', 'B', 'C', 'D', 'E', 'F',
                 'G', 'H', 'I', 'J', 'K', 'L',
                 'M', 'N', 'O', 'P', 'R', 'S',
                 'T', 'U', 'V', 'X', 'Y', 'Z',
                 '1', '2', '3', '4', '5', '6',
                 '7', '8', '9', '0');
    $token = "";
    for ($i = 0; $i < $number; $i++) {
        $index = rand(0, count($arr) - 1);
        $token .= $arr[$index];
    }

    if (isToken($token)) {
        return generateUniqueToken($number);
    } else {
        return $token;
    }
}

function isTokenTeam($token)
{
    if (isset($token) && $token) {

        //verification values in BD
        $query = "SELECT id FROM teams WHERE code='$token'";
        $sql = mysql_query($query);
        if (mysql_num_rows($sql) > 0) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function generateUniqueTokenTeam($number)
{
    $arr = array('a', 'b', 'c', 'd', 'e', 'f',
                 'g', 'h', 'i', 'j', 'k', 'l',
                 'm', 'n', 'o', 'p', 'r', 's',
                 't', 'u', 'v', 'x', 'y', 'z',
                 'A', 'B', 'C', 'D', 'E', 'F',
                 'G', 'H', 'I', 'J', 'K', 'L',
                 'M', 'N', 'O', 'P', 'R', 'S',
                 'T', 'U', 'V', 'X', 'Y', 'Z',
                 '1', '2', '3', '4', '5', '6',
                 '7', '8', '9', '0');
    $token = "";
    for ($i = 0; $i < $number; $i++) {
        $index = rand(0, count($arr) - 1);
        $token .= $arr[$index];
    }

    if (isTokenTeam($token)) {
        return generateUniqueTokenTeam($number);
    } else {
        return $token;
    }
}

?>

<html>
<head>
<title>
Eindspel Baas van Horst aan de Maas 2015
</title>

<!-- Latest compiled and minified CSS -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">

<!-- Latest compiled and minified JavaScript -->
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>

<meta name="viewport" content="width=device-width, initial-scale=1.0">

</head>
<body>
<div class="container">

<?php
if ($view == "teams" && $action == "reset")
{
    if (!mysql_query("UPDATE teams SET num_players='0'") === TRUE)
    {
        echo "Error: " . $sql . "<br>" . $conn->error;  
    }   
    else
    {
        echo "Teams resetted";
    }  
}

if ($view == "balls" && $action == "view")
{
    // Select all qr codes
    $result = mysql_query("SELECT code FROM balls");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    if (mysql_num_rows($result) > 0) {
        while ($row = mysql_fetch_assoc($result)) {
            echo '<img src="qrcode.php?code='. $row['code'] .'" width="25%"/>';
        }
    }
}
elseif ($view == "teams" && $action == "view")
{
    // Select all teams 
    $result = mysql_query("SELECT * FROM teams");
    if (!$result) {
        echo 'Could not run query: ' . mysql_error();
        exit;
    }
    if (mysql_num_rows($result) > 0) {
        while ($row = mysql_fetch_assoc($result)) {
            echo '<h1>'.$row['name'].'</h1><img src="teamcode.php?code='. $row['code'] .'" width="100%"/>';
        }
    }
}
else 
{
?>
    <h1><a href="admin.php">Admin page Eindspel Baas van Horst aan de Maas</a></h1>
    <h2>Balls</h2>
    <ul>
        <!--<li><a href="?view=balls&amp;action=generate">Generate 2000 New balls</a>-->
        <?php
        if ($view == "balls" && $action == "generate")
        {
            if (!mysql_result(mysql_query('SELECT COUNT(*) FROM balls'), 0))
            {
                echo "Generate 2000 random balls :)";
                for ($i = 0; $i < 2000; $i++)
                {
                    if (!mysql_query("INSERT INTO balls (code) VALUES ('" . generateUniqueToken(20) . "')") === TRUE)
                    {
                        echo "Error: " . $sql . "<br>" . $conn->error;  
                        break;
                    }                
                }
            }
            else
            {
                echo "Balls table is not empty, please empty it first";
            }
        }
        ?>
        </li>
        <li><a href="?view=teams&amp;action=reset">Reset the team players</a>
        <li><a href="?view=balls&amp;action=reset">Reset the balls</a>
        <?php
        if ($view == "balls" && $action == "reset")
        {
            if (!mysql_query("UPDATE balls SET team_id='-1'") === TRUE)
            {
                echo "Error: " . $sql . "<br>" . $conn->error;  
            }   
            else
            {
                echo "Balls resetted";
            }             
        }
        ?>
        </li>
        <li><a href="?view=balls&amp;action=view" target="_blank">View QR Codes</a></li>
         <li><a href="?view=teams&amp;action=view" target="_blank">View Teams</a></li>
    </ul>

    <h2>Teams</h2>
<!--     <form action="admin.php" method="GET">
        <input type="text" name="name">
        <input type="hidden" name="view" value="teams" />
        <input type="hidden" name="action" value="add" />
        <input type="submit" value="Add new team">
    </form> -->
    <?php
    if ($view == "teams" && $action == "add")
    {
        if (!mysql_query("INSERT INTO teams (name,code) VALUES ('" . $_GET['name'] . "', '" . generateUniqueToken(20) . "')") === TRUE)
        {
            echo "Error: " . $sql . "<br>" . $conn->error;  
        }  
    }
    ?>
    <ul>
        <?php
        // Check for delete
        if ($view == "teams" && $action == "delete")
        {
            if (!mysql_query("DELETE FROM teams WHERE id=" . $_GET['id']) === TRUE)
            {
                echo "Error: " . $sql . "<br>" . $conn->error;  
            }  
        }

        // Select all qr teams
        $result = mysql_query("SELECT * FROM teams");
        if (!$result) {
            echo 'Could not run query: ' . mysql_error();
            exit;
        }
        if (mysql_num_rows($result) > 0) {
            while ($row = mysql_fetch_assoc($result)) {
                // Perform query per team on balls table
                $num_balls = mysql_num_rows(mysql_query("SELECT id FROM balls WHERE team_id='". $row['id'] ."'"));

                echo '<li>'.$row['name'].' [Balls = '.$num_balls.'] [Players = '.$row['num_players'].'] <!-- -  <a href="?view=teams&action=delete&id='.$row['id'].'">[x]</a>--> <img src="teamcode.php?code='. $row['code'] .'" width="405px"/></li>';
            }
        }
        ?>
    </ul>
<?php
}
?>
</div>
</body>
</html>