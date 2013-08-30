<?php

session_start();
if($_SESSION["verify"] != "RESPONSIVEfilemanager") die('forbiden');
include('config/config.php');

$path=$_POST['path'];
$name=$_POST['name'];

$path_pos=strpos($path,$current_path);
if($path_pos!=0 || strpos($path,'../',strlen($current_path)+$path_pos)!==FALSE)
    die('wrong path');

header('Pragma: private');
header('Cache-control: private, must-revalidate');
header("Content-Type: application/octet-stream");
header("Content-Length: " .(string)(filesize($path)) );
header('Content-Disposition: attachment; filename="'.($name).'"');
readfile($path);

exit;
?>