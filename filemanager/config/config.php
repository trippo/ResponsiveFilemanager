<?php
if($_SESSION["verify"] != "RESPONSIVEfilemanager") die('forbidden');


//------------------------------------------------------------------------------
// DON'T COPY THIS VARIABLES IN FOLDERS config.php FILES
//------------------------------------------------------------------------------

//**********************
//Path configuration
//**********************
// In this configuration the folder tree is
// root
//    |- source <- upload folder
//    |- thumbs <- thumbnail folder [must have write permission (755)]
//    |- filemanager
//    |- js
//    |   |- tinymce
//    |   |   |- plugins
//    |   |   |   |- responsivefilemanager
//    |   |   |   |   |- plugin.min.js

$root = rtrim($_SERVER['DOCUMENT_ROOT'],'/'); // don't touch this parameter
$base_url="http://rfm";  // base url of site (without final /). If you prefer relative urls leave empty
$upload_dir = '/source/'; // path from base_url to base of upload folder (with start and final /)
$current_path = '../source/'; // relative path from filemanager folder to upload folder (with final /)

//thumbs folder can't put inside upload folder
$thumbs_base_path = '../thumbs/'; // relative path from filemanager folder to thumbs folder (with final /)

//------------------------------------------------------------------------------
// YOU CAN COPY AND CHANGE THESE VARIABLES IN FOLDERS config.php FILES
//------------------------------------------------------------------------------

$MaxSizeUpload=100; //Mb

$default_language="en_EN"; //default language file name

//The filter and sorter are managed through both javascript and php scripts because if you have a lot of
//file in a folder the javascript script can't sort all or filter all, so the filemanager switch to php script.
//The plugin automatic swich javascript to php when the current folder exceeds the below limit of files number
$file_number_limit_js=500;

$show_folder_size=true; //Show or not show folder size in list view feature in filemanager (is possible, if there is a large folder, to greatly increase the calculations)
$show_sorting_bar=true; //Show or not show sorting feature in filemanager

//**********************
//Images configuration
//**********************

// set maximum pixel width and/or maximum pixel height for all images
// If you set a maximum width or height, oversized images are converted to those limits. Images smaller than the limit(s) are unaffected
// if you don't need a limit set both to 0
$image_max_width=0;
$image_max_height=0;

//Automatic resizing //
// If you set $image_resizing to true the script converts all uploaded images exactly to image_resizing_width x image_resizing_height dimension
// If you set width or height to 0 the script automatically calculates the other dimension
// Is possible that if you upload very big images the script not work to overcome this increase the php configuration of memory and time limit
$image_resizing=false;
$image_resizing_width=0;
$image_resizing_height=0;

//******************
//Default layout setting
//
// 0 => boxes
// 1 => detailed list (1 column)
// 2 => columns list (multiple columns depending on the width of the page)
//
// YOU CAN ALSO PASS THIS PARAMETERS USING SESSION VAR => $_SESSION["VIEW"]=
//
//******************
$default_view=0;

//set if the filename is truncated when overflow first row 
$ellipsis_title_after_first_row=true;

//*************************
//Permissions configuration
//******************
$delete_files=true;
$create_folders=true;
$delete_folders=true;
$upload_files=true;
$rename_files=true;
$rename_folders=true;

//**********************
//Allowed extensions (lowercase insert)
//**********************
$ext_img = array('jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'svgz'); //Images
$ext_file = array('doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt', 'csv','html','psd','sql','log','fla','xml','ade','adp','ppt','pptx'); //Files
$ext_video = array('mov', 'mpeg', 'mp4', 'avi', 'mpg','wma'); //Videos
$ext_music = array('mp3', 'm4a', 'ac3', 'aiff', 'mid'); //Music
$ext_misc = array('zip', 'rar','gzip'); //Archives

$ext=array_merge($ext_img, $ext_file, $ext_misc, $ext_video,$ext_music); //allowed extensions

//**********************
// Hidden files and folders
//**********************
// set the names of any folders you want hidden (eg "hidden_folder1", "hidden_folder2" ) Remember all folders with these names will be hidden (you can set any exceptions in config.php files on folders)
$hidden_folders = array();
// set the names of any files you want hidden. Remember these names will be hidden in all folders (eg "this_document.pdf", "that_image.jpg" )
$hidden_files = array('config.php');

/*******************
 * JAVA upload 
 *******************/
$java_upload=true;
$JAVAMaxSizeUpload=200; //Gb
?>
