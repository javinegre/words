<?php

require('../config/conf.database.inc.php');

try
{
    # MySQL with PDO_MYSQL
    $DBH = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
}
catch(PDOException $e)
{
    echo $e->getMessage();
}

$words_query = ' SELECT DISTINCT category FROM `words` ORDER BY category';

$STH = $DBH->query($words_query);

# setting the fetch mode
$STH->setFetchMode(PDO::FETCH_ASSOC);

$categories = array();
while($row = $STH->fetch()) {
    $categories[] = $row['category'];
}

$DBH = NULL;

echo json_encode($categories);

?>