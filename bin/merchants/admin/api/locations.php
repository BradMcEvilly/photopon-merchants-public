<?php

require_once("utl.php");

$data = get_post_data();


///$ curl -c cookies.txt -b cookies.txt -X GET 
///--data-urlencode 'where={"color":"blue","coordinates":{"$nearSphere":[-122.1,37.1], "$maxDistance" : 0.00126}}' 
///--data-urlencode 'order=-purchased_at' 

//"https://api.cloud.appcelerator.com/v1/objects/car/query.json?key=<YOUR APP APP KEY>&pretty_json=true&count=true"

$info = user_info();
if (!$info) {
    header("HTTP/1.1 401 Unauthorized");
    exit();
}

$user = json_decode($info["content"])->response->users[0];

$locations = get_web_page("https://api.cloud.appcelerator.com/v1/places/query.json?key=lhQJqbLTYXMjoxwjQBDnZ8QnfalByWLX&pretty_json=true", array(
    "where" => '{"user_id":"' . $user->id . '"}'
), $info['cookies']);


echo $locations["content"];
