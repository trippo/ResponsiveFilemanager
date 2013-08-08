<?php

session_start();
if($_SESSION["verify"] != "FileManager4TinyMCE") die('forbiden');

include('config/config.php');
include('include/utils.php');

if(isset($_GET['action']))
    switch($_GET['action']){
	case 'view':
	    if(isset($_GET['type']))
		$_SESSION["view_type"] =$_GET['type'];
	    else
		die('view type number missing');
	    break;
	case 'image_size':
	    $pos = strpos($_POST['path'],$upload_dir);
	    if ($pos !== false) {
		$info=getimagesize(substr_replace($_POST['path'],$current_path,$pos,strlen($upload_dir)));
		echo json_encode($info);
	    }
	    
	    break;
    }
else
    die('no action passed')
?>