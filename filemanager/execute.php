<?php

session_start();
if($_SESSION["verify"] != "FileManager4TinyMCE") die('forbiden');
include('config/config.php');
include('include/utils.php');

$language_file = 'lang/en_EN.php'; 
if (isset($_GET['lang']) && $_GET['lang'] != 'undefined' && $_GET['lang']!='') {
    $path_parts = pathinfo($_GET['lang']);
    if(is_readable('lang/' .$path_parts['basename']. '.php')){ 
        $language_file = 'lang/' .$path_parts['basename']. '.php';
    }
}
require_once $language_file;

$path=$_POST['path'];
$path_thumb=$_POST['path_thumb'];
if(isset($_POST['name'])){
    $name=$_POST['name'];
    if(strpos($name,'../')!==FALSE) die('wrong name');
}

$path_pos=strpos($path,$current_path);
if($path_pos!=0
   || strpos($path,'../',strlen($current_path)+$path_pos)!==FALSE
   || strpos($path_thumb,'thumbs')!=0
   || strpos($path_thumb,'../')!==FALSE) die('wrong path');

if(isset($_GET['action'])){
    
    switch($_GET['action']){
        case 'delete_file':
            unlink($path);
            if(file_exists($path_thumb))
                unlink($path_thumb);
            break;
        case 'delete_folder':
            deleteDir($path);
            deleteDir($path_thumb);
            break;
        case 'create_folder':
            create_folder(fix_path($path),fix_path($path_thumb));
            break;
        case 'rename_folder':
            $name=fix_filename($name);
            if(!empty($name)){
                if(!rename_folder($path,$name))
                    die(lang_Rename_existing_folder);
                rename_folder($path_thumb,$name);
            }else{
                die(lang_Empty_name);
            }
            break;
        case 'rename_file':
            $name=fix_filename($name);
            if(!empty($name)){
                if(!rename_file($path,$name))
                    die(lang_Rename_existing_file);
                rename_file($path_thumb,$name);
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
