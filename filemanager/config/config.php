<?php

if($_SESSION["verify"] != "FileManager4TinyMCE") die('forbidden');

$root = rtrim($_SERVER['DOCUMENT_ROOT'],'/'); // don't touch this configuration

//**********************
//Path configuration
//**********************
// In this configuration the folder tree is
// root
//   |- site
//   |    |- source <- upload folder
//   |    |- js
//   |    |   |- tinymce
//   |    |   |    |- plugins
//   |    |   |    |-   |- filemanager
//   |    |   |    |-   |-      |- thumbs <- folder of thumbs [must have the write permission]

$base_url="http://localhost"; //url base of site if you want only relative url leave empty
$upload_dir = '/site/source/'; // path from base_url to upload base dir
$current_path = '../../../../source/'; // relative path from filemanager folder to upload files folder

$MaxSizeUpload=100; //Mb

//**********************
//Image config
//**********************
//set max width pixel or the max height pixel for all images
//If you set dimension limit, automatically the images that exceed this limit are convert to limit, instead
//if the images are lower the dimension is maintained
//if you don't have limit set both to 0
$image_max_width=0;
$image_max_height=0;

//Automatic resizing //
//If you set true $image_resizing the script convert all images uploaded in image_width x image_height resolution
//If you set width or height to 0 the script calcolate automatically the other size
$image_resizing=true;
$image_width=600;
$image_height=0;

//******************
//Default layout setting
//
// 0 => boxes
// 1 => list (1 column)
// 2 => columns list (multiple columns depending on the width of the page)
//
// YOU CAN ALSO PASS THIS PARAMETERS USING SESSION VAR => $_SESSION["VIEW"]=
//
//******************
$default_view=0;

//******************
//Permits config
//******************
$delete_files=true;
$create_folders=true;
$delete_folders=true;
$upload_files=true;
$rename_files=true;
$rename_folders=true;

//**********************
//Allowed extensions
//**********************
$ext_img = array('jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'svgz'); //Images
$ext_file = array('doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt', 'csv','html','psd','sql','log','fla','xml','ade','adp','ppt','pptx'); //Files
$ext_video = array('mov', 'mpeg', 'mp4', 'avi', 'mpg','wma'); //Videos
$ext_music = array('mp3', 'm4a', 'ac3', 'aiff', 'mid'); //Music
$ext_misc = array('zip', 'rar','gzip'); //Archives
$ext=array_merge($ext_img, $ext_file, $ext_misc, $ext_video,$ext_music); //allowed extensions

//**********************
//Hidden file and folder
//**********************
//set the name of hidden folders... remember than this name will be hidden in all folders (you can change in .config file if have exceptions)
$hidden_folders = array();
//set the name of hidden files...  remember than this name will be hidden in all folders (ex: "document.pdf", "image.jpg" )
$hidden_files = array();

?>