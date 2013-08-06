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
    }
else
    die('no action passed')
?>