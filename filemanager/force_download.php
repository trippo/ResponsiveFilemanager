<?php
include('config/config.php');
if($_SESSION['RF']["verify"] != "RESPONSIVEfilemanager") die('forbiden');
include('include/utils.php');
include('include/mime_type_lib.php');

if(strpos($_POST['path'],'/')===0
    || strpos($_POST['path'],'../')!==FALSE
    || strpos($_POST['path'],'./')===0)
    die('wrong path');

if(strpos($_POST['name'],'/')!==FALSE)
    die('wrong path');

$path=$current_path.$_POST['path'];
$name=$_POST['name'];

$info=pathinfo($name);
if(!in_array(fix_strtolower($info['extension']), $ext)){
    die('wrong extension');
}

$img_size = (string)(filesize($path.$name)); // Get the image size as string

$mime_type = get_file_mime_type( $path.$name ); // Get the correct MIME type depending on the file.

header('Pragma: private');
header('Cache-control: private, must-revalidate');
header("Content-Type: " . $mime_type); // Set the correct MIME type
header("Content-Length: " . $img_size );
header('Content-Disposition: attachment; filename="'.($name).'"');
readfile($path.$name);

exit;
?>