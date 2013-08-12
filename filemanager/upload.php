<?php

session_start();
if($_SESSION["verify"] != "FileManager4TinyMCE") die('forbiden');

include('config/config.php');
include('include/utils.php');


$ds          = DIRECTORY_SEPARATOR; 
 
$storeFolder = $_POST['path'];
$storeFolderThumb = $_POST['path_thumb'];

$path=$storeFolder;
$cycle=true;

while($cycle){
    if($path==$current_path)  $cycle=false;
    
    if(file_exists($path.".config")){
	require_once($path.".config");
	$cycle=false;
    }
    $path=dirname($path).$ds;
}

if (!empty($_FILES) && $upload_files && strpos($storeFolder,$current_path)==0) {
     
    $tempFile = $_FILES['file']['tmp_name'];   
      
    $targetPath = dirname( __FILE__ ) . $ds. $storeFolder . $ds; 
    $targetPathThumb = dirname( __FILE__ ) . $ds. $storeFolderThumb . $ds;
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
	    if($image_width==0){
		if($image_height==0){
		    $image_width=$srcWidth;
		    $image_height =$srcHeight;
		}else{
		    $image_width=$image_height*$srcWidth/$srcHeight;
	    }
	    }elseif($image_height==0){
		$image_height =$image_width*$srcHeight/$srcWidth;
	    }
	    $srcWidth=$image_width;
	    $srcHeight=$image_height;
	    create_img_gd($targetFile, $targetFile, $image_width, $image_height);
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
        'editor'    => $_POST['editor'],
        'fldr'      => $_POST['fldr'],
    ));
    header("location: dialog.php?" . $query);
}

?>      
