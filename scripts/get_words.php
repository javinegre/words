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

// Query explanation in http://akinas.com/pages/en/blog/mysql_random_row/
$words_query = ' SELECT word, translation, base_meaning, translation_meaning '
    . ' FROM `words` WHERE wordID >= (SELECT FLOOR(MAX(wordID) * RAND()) FROM `words`) ORDER BY wordID';

// Take number of words to show, default value is 10
$limit = (isset($_POST['limit']))
    ? $_POST['limit']
    : 10;

$words_query .= ' LIMIT ' . $limit;

$STH = $DBH->query($words_query);

# setting the fetch mode
$STH->setFetchMode(PDO::FETCH_ASSOC);

$words = array();
while($row = $STH->fetch()) {
    $words[] = array(
        'w' => $row['word'],
        't' => $row['translation'],
        'm' => explode(';', $row['translation_meaning'])
    );
}

$DBH = NULL;

shuffle($words);
echo json_encode($words);

?>