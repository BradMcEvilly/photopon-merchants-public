<?php

require_once("utl.php");

$data = get_post_data();


$loginInfo = post_web_page("https://api.cloud.appcelerator.com/v1/users/login.json?key=lhQJqbLTYXMjoxwjQBDnZ8QnfalByWLX&pretty_json=true", array(
    "login" => $data->username,
    "password" => $data->password
));

session_start();
$info = user_info($loginInfo);

echo $info["content"];
