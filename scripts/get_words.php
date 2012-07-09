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

// Discards categories sent with the request
$categories_query = (isset($_POST['categories']) && !empty($_POST['categories']))
    ? ' AND `category` NOT IN ("' . implode('","', explode(';', $_POST['categories'])) . '") '
    : '';

// Query explanation in http://akinas.com/pages/en/blog/mysql_random_row/
$words_query = ' SELECT word, translation, base_meaning, translation_meaning '
    . ' FROM `words` WHERE wordID >= (SELECT FLOOR(MAX(wordID) * RAND()) FROM `words`) '
    . $categories_query
    . ' ORDER BY wordID';

// Takes number of words to show, default value is 20
$limit = (isset($_POST['limit']))
    ? intval($_POST['limit'])
    : 20;

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