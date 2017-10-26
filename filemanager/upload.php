<?php
if (!isset($config)){
  $config = include 'config/config.php';
}

include 'include/utils.php';

if ($_SESSION['RF']["verify"] != "RESPONSIVEfilemanager")
{
	response(trans('forbiden').AddErrorLocation(), 403)->send();
	exit;
}

include 'include/mime_type_lib.php';


$ftp=ftp_con($config);
if($ftp){
	$source_base = $config['ftp_base_folder'].$config['upload_dir'];
	$thumb_base = $config['ftp_base_folder'].$config['ftp_thumbs_dir'];

}else{
	$source_base = $config['current_path'];
	$thumb_base = $config['thumbs_base_path'];
}
if(isset($_POST["fldr"])){
	$_POST['fldr'] = str_replace('undefined','',$_POST['fldr']);
	$storeFolder = $source_base.$_POST["fldr"];
	$storeFolderThumb = $thumb_base.$_POST["fldr"];
}else{
	return;
}

if (strpos($_POST["fldr"],'../') !== FALSE
	|| strpos($_POST["fldr"],'./') !== FALSE
	|| strpos($_POST["fldr"],'..\\') !== FALSE
	|| strpos($_POST["fldr"],'.\\') !== FALSE )
{
	response(trans('wrong path'.AddErrorLocation()))->send();
	exit;
}

$path = $storeFolder;
$cycle = TRUE;
$max_cycles = 50;
$i = 0;
//GET config
while ($cycle && $i < $max_cycles)
{
	$i++;
	if ($path == $config['current_path']) $cycle = FALSE;
	if (file_exists($path."config.php"))
	{
		$configTemp = include $path.'config.php';
		$config = $config + $configTemp;
		//TODO switch to array
		$cycle = FALSE;
	}
	$path = fix_dirname($path).'/';
}

require('UploadHandler.php');
$messages = null;
if(trans("Upload_error_messages")!=="Upload_error_messages"){
	$messages = trans("Upload_error_messages");
}

if(isset($_POST['url'])){
	$temp = tempnam('/tmp','RF');
	$ch = curl_init($_POST['url']);
	$fp = fopen($temp, 'wb');
	curl_setopt($ch, CURLOPT_FILE, $fp);
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_exec($ch);
	curl_close($ch);
	fclose($fp);

	$_FILES['files'] = array(
		'name' => array(basename($_POST['url'])),
		'tmp_name' => array($temp),
		'size' => array(filesize($temp)),
		'type' => null
	);
}
$info = pathinfo($_FILES['files']['name'][0]);
$mime_type = $_FILES['files']['type'][0];
if (function_exists('mime_content_type')){
	$mime_type = mime_content_type($_FILES['files']['tmp_name'][0]);
}elseif(function_exists('finfo_open')){
	$finfo = finfo_open(FILEINFO_MIME_TYPE);
	$mime_type = finfo_file($finfo, $_FILES['files']['tmp_name'][0]);
}else{
	include 'include/mime_type_lib.php';
	$mime_type = get_file_mime_type($_FILES['files']['tmp_name'][0]);
}
$extension = get_extension_from_mime($mime_type);

if($extension=='so'){
	$extension = $info['extension'];
}
$_FILES['files']['name'][0] = fix_filename($info['filename'].".".$extension,$config);
// LowerCase
if ($config['lower_case'])
{
	$_FILES['files']['name'][0] = fix_strtolower($_FILES['files']['name'][0]);
}
if (!checkresultingsize($_FILES['files']['size'][0])) {
	$upload_handler->response['files'][0]->error = sprintf(trans('max_size_reached'),$MaxSizeTotal).AddErrorLocation();
	echo json_encode($upload_handler->response);
	exit();
}

$uploadConfig = array(
	'config' => $config,
	'storeFolder' => $storeFolder,
	'storeFolderThumb' => $storeFolderThumb,
	'ftp' => $ftp,
	'upload_dir'=> dirname($_SERVER['SCRIPT_FILENAME']).'/'.$storeFolder,
	'upload_url' => $config['base_url'].$config['upload_dir'].$_POST['fldr'],
    'mkdir_mode' => $config['folderPermission'],
    'accept_file_types' => '/\.('.implode('|',$config['ext']).')$/i',
    'max_file_size' => $config['MaxSizeUpload']*1024*1024,
    'correct_image_extensions' => true,
    'print_response' => false
);

if($ftp){
	if (!is_dir($config['ftp_temp_folder'])) {
		mkdir($config['ftp_temp_folder'], $config['folderPermission'], true);
	}
	if (!is_dir($config['ftp_temp_folder']."thumbs")) {
		mkdir($config['ftp_temp_folder']."thumbs", $config['folderPermission'], true);
	}
	$uploadConfig['upload_dir'] = $config['ftp_temp_folder'];
}

$upload_handler = new UploadHandler($uploadConfig,true, $messages);

