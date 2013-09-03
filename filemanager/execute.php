<?php

session_start();
if($_SESSION["verify"] != "RESPONSIVEfilemanager") die('forbiden');
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

$base=$current_path;
$base_thumb=$thumbs_base_path;
$path=$_POST['path'];
$cycle=true;
$max_cycles=50;
$i=0;
while($cycle && $i<$max_cycles){
    $i++;
    if($path==$base)  $cycle=false;
    
    if(file_exists($path."config.php")){
	require_once($path."config.php");
	$cycle=false;
    }
    $path=fix_dirname($path)."/";
    $cycle=false;
}

$path=$_POST['path'];
$path_thumb=$_POST['path_thumb'];
if(isset($_POST['name'])){
    $name=$_POST['name'];
    if(strpos($name,'../')!==FALSE) die('wrong name');
}

$path_pos=strpos($path,$base);
$thumb_pos=strpos($path_thumb,$base_thumb);

if($path_pos!=0
   || $thumb_pos !=0
   || strpos($path,'../',strlen($base)+$path_pos)!==FALSE
   || strpos($path_thumb,'../',strlen($base_thumb)+$thumb_pos)!==FALSE)
    die('wrong path');
    
if(isset($_GET['action'])){
    
    switch($_GET['action']){
        case 'delete_file':
            if($delete_files){
                unlink($path);
                if(file_exists($path_thumb))
                    unlink($path_thumb);
            }
            break;
        case 'delete_folder':
            if($delete_folders){
                deleteDir($path);
                deleteDir($path_thumb);
            }
            break;
        case 'create_folder':
            if($create_folders){
                create_folder(fix_path($path),fix_path($path_thumb));
            }
            break;
        case 'rename_folder':
            if($rename_folders){
                $name=fix_filename($name);
                if(!empty($name)){
                    if(!rename_folder($path,$name))
                        die(lang_Rename_existing_folder);
                    rename_folder($path_thumb,$name);
                }else{
                    die(lang_Empty_name);
                }
            }
            break;
        case 'rename_file':
            if($rename_files){
                $name=fix_filename($name);
                if(!empty($name)){
                    if(!rename_file($path,$name))
                        die(lang_Rename_existing_file);
                    rename_file($path_thumb,$name);
                }else{
                    die(lang_Empty_name);
                }
            }
            break;
        default:
            die('wrong action');
            break;
    }
    
}



?>
