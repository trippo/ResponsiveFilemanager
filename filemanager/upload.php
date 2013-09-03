<?php

session_start();
if($_SESSION["verify"] != "RESPONSIVEfilemanager") die('forbiden');

include('config/config.php');
include('include/utils.php');


$ds = '/'; 
 
$storeFolder = $_POST['path'];
$storeFolderThumb = fix_realpath($_POST['path_thumb']).$ds;

$base=$current_path;
$base_thumb=fix_realpath($thumbs_base_path).$ds;
$path=$storeFolder;
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
    $path=fix_dirname($path).$ds;
}


$path_pos=strpos($storeFolder,$base);
$thumb_pos=strpos($storeFolderThumb,$base_thumb);
if($path_pos!=0
   || $thumb_pos !=0
   || strpos($storeFolder,'../',strlen($base)+$path_pos)!==FALSE
   || strpos($storeFolderThumb,'../',strlen($base_thumb)+$thumb_pos)!==FALSE)
    die('wrong path');
    

if (!empty($_FILES)) {
     
    $tempFile = $_FILES['file']['tmp_name'];   
      
    $targetPath = $storeFolder;
    $targetPathThumb = $storeFolderThumb;
    $_FILES['file']['name'] = fix_filename($_FILES['file']['name']);
     
    if(file_exists($targetPath.$_FILES['file']['name'])){
	$i = 1;
	$info=pathinfo($_FILES['file']['name']);
	while(file_exists($targetPath.$info['filename'].".[".$i."].".$info['extension'])) {
		$i++;
	}
	$_FILES['file']['name']=$info['filename'].".[".$i."].".$info['extension'];
    }
    $targetFile =  $targetPath. $_FILES['file']['name']; 
    $targetFileThumb =  $targetPathThumb. $_FILES['file']['name'];

    move_uploaded_file($tempFile,$targetFile);
    chmod($targetFile, 0755);
    if(in_array(substr(strrchr($_FILES['file']['name'],'.'),1),$ext_img)) $is_img=true;
    else $is_img=false;

    if($is_img){
	create_img_gd($targetFile, $targetFileThumb, 122, 91);
	
	$imginfo =getimagesize($targetFile);
	$srcWidth = $imginfo[0];
	$srcHeight = $imginfo[1];
	
	if($image_resizing){
	    if($image_resizing_width==0){
		if($image_resizing_height==0){
		    $image_resizing_width=$srcWidth;
		    $image_resizing_height =$srcHeight;
		}else{
		    $image_resizing_width=$image_resizing_height*$srcWidth/$srcHeight;
	    }
	    }elseif($image_resizing_height==0){
		$image_resizing_height =$image_resizing_width*$srcHeight/$srcWidth;
	    }
	    $srcWidth=$image_resizing_width;
	    $srcHeight=$image_resizing_height;
	    create_img_gd($targetFile, $targetFile, $image_resizing_width, $image_resizing_height);
	}
	
	//max resizing limit control
	$resize=false;
	if($image_max_width!=0 && $srcWidth >$image_max_width){
	    $resize=true;
	    $srcHeight=$image_max_width*$srcHeight/$srcWidth;
	    $srcWidth=$image_max_width;
	}
	
	if($image_max_height!=0 && $srcHeight >$image_max_height){
	    $resize=true;
	    $srcWidth =$image_max_height*$srcWidth/$srcHeight;
	    $srcHeight =$image_max_height;
	}
	if($resize)
	    create_img_gd($targetFile, $targetFile, $srcWidth, $srcHeight);	
	    
    }
}else{
    echo "error";
}
if(isset($_POST['submit'])){
    $query = http_build_query(array(
        'type'      => $_POST['type'],
        'lang'      => $_POST['lang'],
        'popup'     => $_POST['popup'],
        'field_id'  => $_POST['field_id'],
        'fldr'      => $_POST['fldr'],
    ));
    header("location: dialog.php?" . $query);
}

?>      
