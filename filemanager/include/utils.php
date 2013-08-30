<?php 

if($_SESSION["verify"] != "RESPONSIVEfilemanager") die('forbiden');

function deleteDir($dir) {
    if (!file_exists($dir)) return true;
    if (!is_dir($dir)) return unlink($dir);
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') continue;
        if (!deleteDir($dir.DIRECTORY_SEPARATOR.$item)) return false;
    }
    return rmdir($dir);
}

function rename_file($old_path,$name){
    if(file_exists($old_path)){
	$info=pathinfo($old_path);
	$new_path=$info['dirname']."/".$name.".".$info['extension'];
	if(file_exists($new_path)) return false;
	return rename($old_path,$new_path);
    }
}

function rename_folder($old_path,$name){
    $name=fix_filename($name);
    if(file_exists($old_path)){
	$new_path=fix_dirname($old_path)."/".$name;
	if(file_exists($new_path)) return false;
	return rename($old_path,$new_path);
    }
}

function create_img_gd($imgfile, $imgthumb, $newwidth, $newheight="") {
    require_once('php_image_magician.php');  
    $magicianObj = new imageLib($imgfile);
    // *** Resize to best fit then crop
    $magicianObj -> resizeImage($newwidth, $newheight, 'crop');  
    $magicianObj -> saveImage($imgthumb,80);
}

function makeSize($size) {
   $units = array('B','KB','MB','GB','TB');
   $u = 0;
   while ( (round($size / 1024) > 0) && ($u < 4) ) {
     $size = $size / 1024;
     $u++;
   }
   return (number_format($size, 0) . " " . $units[$u]);
}

function foldersize($path) {
    $total_size = 0;
    $files = scandir($path);
    $cleanPath = rtrim($path, '/'). '/';

    foreach($files as $t) {
        if ($t<>"." && $t<>"..") {
            $currentFile = $cleanPath . $t;
            if (is_dir($currentFile)) {
                $size = foldersize($currentFile);
                $total_size += $size;
            }
            else {
                $size = filesize($currentFile);
                $total_size += $size;
            }
        }   
    }

    return $total_size;
}

function create_folder($path=false,$path_thumbs=false){
    $oldumask = umask(0);
    if ($path && !file_exists($path))
        mkdir($path, 0777, true); // or even 01777 so you get the sticky bit set 
    if($path_thumbs && !file_exists($path_thumbs)) 
        mkdir($path_thumbs, 0777, true) or die("$path_thumbs cannot be found"); // or even 01777 so you get the sticky bit set 
    umask($oldumask);
}

function fix_filename($str){
    $str = iconv('UTF-8', 'US-ASCII//TRANSLIT', $str);
    $str = preg_replace("/[^a-zA-Z0-9\._| -]/", '', $str);
    $str = strtolower(trim($str));
    
    return $str;
}

function fix_dirname($str){
    return str_replace('~',' ',dirname(str_replace(' ','~',$str)));
}

function fix_realpath($str){
    return str_replace('\\','/',realpath($str));
}

function fix_path($path){
    $info=pathinfo($path);
    $tmp_path=$info['dirname'];
    $str=fix_filename($info['filename']);
    if($tmp_path!="")
	return $tmp_path.DIRECTORY_SEPARATOR.$str;
    else
	return $str;
}

function config_loading($current_path,$fld){
    if(file_exists($current_path.$fld.".config")){
	require_once($current_path.$fld.".config");
	return true;
    }
    echo "!!!!".$parent=fix_dirname($fld);
    if($parent!="." && !empty($parent)){
	config_loading($current_path,$parent);
    }
    
    return false;
}

?>