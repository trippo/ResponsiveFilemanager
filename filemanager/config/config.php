<?php
session_start();
mb_internal_encoding('UTF-8');
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

$base_url ="http://".$_SERVER['HTTP_HOST'];  // DON'T TOUCH (base url (only domain) of site (without final /)).
$upload_url = '/source/'; // path from base_url to base of upload folder (with start and final /)

//thumbs folder can't put inside upload folder
$thumbs_base_url = '/thumbs/'; // relative url from base_url to base of thumbs folder (with start and final /)

// OPTIONAL SECURITY
// if set to true only those will access RF whose url contains the access key(akey) like: 
// <input type="button" href="../filemanager/dialog.php?field_id=imgField&lang=en_EN&akey=myPrivateKey" value="Files">
// in tinymce a new parameter added: filemanager_access_key:"myPrivateKey"
// example tinymce config:
// tiny init ...
// 
// external_filemanager_path:"../filemanager/",
// filemanager_title:"Filemanager" ,
// filemanager_access_key:"myPrivateKey" ,
// ...
define('USE_ACCESS_KEYS', FALSE); // TRUE or FALSE

// add access keys eg: array('myPrivateKey', 'someoneElseKey');
// keys should only containt (a-z A-Z 0-9 \ . _ -) characters
// if you are integrating lets say to a cms for admins, i recommend making keys randomized something like this:
// $username = 'Admin';
// $salt = 'dsflFWR9u2xQa' (a hard coded string)
// $akey = md5($username.$salt);
// DO NOT use 'key' as access key!
// Keys are CASE SENSITIVE!
$access_keys = array('myPrivateKey','someoneElseKey');



// $upload_path and $thumbs_base_path is only necessary to set if the folder
// structure is different from "Path configuration" above!

// absolute path to base of upload folder
$upload_path = realpath(dirname(__FILE__) . '../../' . $upload_url);

// absolute path to base of thumbs folder
$thumbs_base_path = realpath(dirname(__FILE__) . '../../' . $thumbs_base_url);


//--------------------------------------------------------------------------------------------------------
// YOU CAN COPY AND CHANGE THESE VARIABLES INTO FOLDERS config.php FILES TO CUSTOMIZE EACH FOLDER OPTIONS
//--------------------------------------------------------------------------------------------------------

$MaxSizeUpload = 100; //Mb

// SERVER OVERRIDE
if ((int)(ini_get('post_max_size')) < $MaxSizeUpload){
	$MaxSizeUpload = (int)(ini_get('post_max_size'));
}

$default_language 	= "en_EN"; //default language file name
$icon_theme 		= "ico"; //ico or ico_dark you can cusatomize just putting a folder inside filemanager/img
$show_folder_size 	= TRUE; //Show or not show folder size in list view feature in filemanager (is possible, if there is a large folder, to greatly increase the calculations)
$show_sorting_bar 	= TRUE; //Show or not show sorting feature in filemanager
$loading_bar 		= TRUE; //Show or not show loading bar
$transliteration 	= FALSE; //active or deactive the transliteration (mean convert all strange characters in A..Za..z0..9 characters)

//*******************************************
//Images limit and resizing configuration
//*******************************************

// set maximum pixel width and/or maximum pixel height for all images
// If you set a maximum width or height, oversized images are converted to those limits. Images smaller than the limit(s) are unaffected
// if you don't need a limit set both to 0
$image_max_width  = 0;
$image_max_height = 0;

//Automatic resizing //
// If you set $image_resizing to TRUE the script converts all uploaded images exactly to image_resizing_width x image_resizing_height dimension
// If you set width or height to 0 the script automatically calculates the other dimension
// Is possible that if you upload very big images the script not work to overcome this increase the php configuration of memory and time limit
$image_resizing = FALSE;
$image_resizing_width  = 0;
$image_resizing_height = 0;

//******************
// Default layout setting
//
// 0 => boxes
// 1 => detailed list (1 column)
// 2 => columns list (multiple columns depending on the width of the page)
// YOU CAN ALSO PASS THIS PARAMETERS USING SESSION VAR => $_SESSION['RF']["VIEW"]=
//
//******************
$default_view = 0;

//set if the filename is truncated when overflow first row 
$ellipsis_title_after_first_row = TRUE;

//*************************
//Permissions configuration
//******************
$delete_files	 = TRUE;
$create_folders	 = TRUE;
$delete_folders	 = TRUE;
$upload_files	 = TRUE;
$rename_files	 = TRUE;
$rename_folders	 = TRUE;
$duplicate_files = TRUE;
$copy_cut_files	 = TRUE; // for copy/cut files
$copy_cut_dirs	 = TRUE; // for copy/cut directories


// defines size limit for paste in MB / operation
// set 'FALSE' for no limit
$copy_cut_max_size	 = 100;
// defines file count limit for paste / operation
// set 'FALSE' for no limit
$copy_cut_max_count	 = 200;
//IF any of these limits reached, operation won't start and generate warning

//**********************
//Allowed extensions (lowercase insert)
//**********************
$ext_img = array('jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg'); //Images
$ext_file = array('doc', 'docx','rtf', 'pdf', 'xls', 'xlsx', 'txt', 'csv','html','xhtml','psd','sql','log','fla','xml','ade','adp','mdb','accdb','ppt','pptx','odt','ots','ott','odb','odg','otp','otg','odf','ods','odp','css','ai'); //Files
$ext_video = array('mov', 'mpeg', 'mp4', 'avi', 'mpg','wma',"flv","webm"); //Video 
$ext_music = array('mp3', 'm4a', 'ac3', 'aiff', 'mid','ogg','wav'); //Audio
$ext_misc = array('zip', 'rar','gz','tar','iso','dmg'); //Archives

$ext = array_merge($ext_img, $ext_file, $ext_misc, $ext_video,$ext_music); //allowed extensions

/******************
 * AVIARY config
*******************/
$aviary_active 	= TRUE;
$aviary_key 	= "dvh8qudbp6yx2bnp";
$aviary_secret	= "m6xaym5q42rpw433";
$aviary_version	= 3;
$aviary_language= 'en';


//The filter and sorter are managed through both javascript and php scripts because if you have a lot of
//file in a folder the javascript script can't sort all or filter all, so the filemanager switch to php script.
//The plugin automatic swich javascript to php when the current folder exceeds the below limit of files number
$file_number_limit_js = 500;

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
$java_upload = TRUE;
$JAVAMaxSizeUpload = 200; //Gb


//************************************
//Thumbnail for external use creation
//************************************


// New image resized creation with fixed path from filemanager folder after uploading (thumbnails in fixed mode)
// If you want create images resized out of upload folder for use with external script you can choose this method, 
// You can create also more than one image at a time just simply add a value in the array
// Remember than the image creation respect the folder hierarchy so if you are inside source/test/test1/ the new image will create at
// path_from_filemanager/test/test1/
// PS if there isn't write permission in your destination folder you must set it
$fixed_image_creation                   = FALSE; //activate or not the creation of one or more image resized with fixed path from filemanager folder
$fixed_path_from_filemanager            = array('../test/','../test1/'); //fixed path of the image folder from the current position on upload folder
$fixed_image_creation_name_to_prepend   = array('','test_'); //name to prepend on filename
$fixed_image_creation_to_append         = array('_test',''); //name to appendon filename
$fixed_image_creation_width             = array(300,400); //width of image (you can leave empty if you set height)
$fixed_image_creation_height            = array(200,''); //height of image (you can leave empty if you set width)


// New image resized creation with relative path inside to upload folder after uploading (thumbnails in relative mode)
// With Responsive filemanager you can create automatically resized image inside the upload folder, also more than one at a time
// just simply add a value in the array
// The image creation path is always relative so if i'm inside source/test/test1 and I upload an image, the path start from here
$relative_image_creation                = FALSE; //activate or not the creation of one or more image resized with relative path from upload folder
$relative_path_from_current_pos         = array('thumb/','thumb/'); //relative path of the image folder from the current position on upload folder
$relative_image_creation_name_to_prepend= array('','test_'); //name to prepend on filename
$relative_image_creation_name_to_append = array('_test',''); //name to append on filename
$relative_image_creation_width          = array(300,400); //width of image (you can leave empty if you set height)
$relative_image_creation_height         = array(200,''); //height of image (you can leave empty if you set width)

