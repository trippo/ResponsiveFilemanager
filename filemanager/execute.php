<?php

session_start();
if($_SESSION["verify"] != "FileManager4TinyMCE") die('forbiden');
include('config/config.php');
include('include/utils.php');


if (isset($_GET['lang']) && $_GET['lang'] != 'undefined' && is_readable('lang/' . $_GET['lang'] . '.php')) {
    require_once 'lang/' . $_GET['lang'] . '.php';
} else {
    require_once 'lang/en_EN.php';
}

$path=$_POST['path'];
$path_thumbs=$_POST['path_thumb'];
if(isset($_POST['name'])){
    $name=$_POST['name'];
    if(strpos($name,'../')!==FALSE) die('wrong name');
}

$path_pos=strpos($path,$current_path);
if($path_pos!=0
   || strpos($path,'../',strlen($current_path)+$path_pos)!==FALSE
   || strpos($path_thumbs,'thumbs')!=0
   || strpos($path_thumbs,'../')!==FALSE) die('wrong path');

if(isset($_GET['action'])){
    
    switch($_GET['action']){
        case 'delete_file':
            unlink($path);
            if(file_exists($path_thumbs))
                unlink($path_thumbs);
            break;
        case 'delete_folder':
            deleteDir($path);
            deleteDir($path_thumbs);
            break;
        case 'create_folder':
            create_folder($path,$path_thumbs);
            break;
        case 'rename_folder':
            if(!empty($name)){
                if(!rename_folder($path,$name))
                    die(lang_Rename_existing_folder);
                rename_folder($path_thumbs,$name);
            }else{
                die(lang_Empty_name);
            }
            break;
        case 'rename_file':
            if(!empty($name)){
                if(!rename_file($path,$name))
                    die(lang_Rename_existing_file);
                rename_file($path_thumbs,$name);
            }else{
                die(lang_Empty_name);
            }
            break;
        default:
            die('wrong action');
            break;
    }
    
}



?>
