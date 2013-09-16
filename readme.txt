*********************************************************
! Responsive FileManager for TinyMCE Version 9.0.0
*********************************************************
Responsive FileManager is a free open-source file manager made with the jQuery library, CSS3, PHP and HTML5 that offers a nice and elegant way to upload and insert files, images and videos.
You can use it as external plugin for TinyMCE version 4.x. and you can also use it as a stand-alone file manager to manage and select files.
The script automatically creates thumbnails of images for the preview list.
It can be configured for automatic resizing of uploaded images or to automatically limit the size.
You can personalize the configuration for each folder.
You can set a subfolder as the root and change the configuration for each user, page or FileManager call.
Is compatible with multi-user mode.

DEMO: http://www.responsivefilemanager.com/

Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.

Creator : info@albertoperipolli.com - tr1pp0


CHANGES LOG

version 9.0.1
Update queryloader (loading bar)
fix a little bug

version 9.0.0
New amazing layout with new flat icons
Add Aviary image editor on context menu, the best image editor in the world (free for 800x800px resolution)
Add possibility to create multiple thumbs for external use both inside (relative path) and outside (fixed path) of upload folder, and they are update on renaming , deleting, and editing
Add support of zip,tar,gz files decompression
Fix a lot of security bug (you must download this version) thanks to Dmitry Kurilo
Add https compatibility
Fix all files when they are loaded externally via ftp client
Add show url button on context menu of each file
The config/config.php is the first file included in all filemanager files for cms costumization
Deletes all path configuration problems (if you insert correct path in config.php file)
Remove critical error when loading corrupted images
Fix other bugs

*********************************************************
! Installation
*********************************************************

1. Upload the 'filemanager' folder where you want in your server.
2. Create a folder for your uploaded files and give it write permission (755).
3. Open filemanager/config/config.php and edit the settings (read config.php parameters setting paragraph). Save file.
4. Subscribe to Aviary.com to get free app key to use for image editor (the free account permit to export image with maximum dimension 800x800 pixel) P.S.: remember aviary editor work only online so don't work on localhost!!
5. Great! Your work is finished!

PS If you don't see the preview images you need to give write permission to the thumbs folder.
If you are updating from a previous version of FileManager delete the contents of thumbs folder, the script will automatically re-create the thumbnails.

!IMPORTANT: if you are using htaccess protection, make sure your $GLOBALS PHP_AUTH_USER/PHP_AUTH_USER are defined in your webserver config

USE AS TINYMCE 4 FILEMANGER

1. Copy tinymce/plugins/responsivefilemanager folder to tinymce/plugins/ in your server
2. Settings of tinymce should be like this: (remember to add responsivefilemanager in plugins list)

tinymce.init({
    selector: "textarea",theme: "modern",width: 680,height: 300,
    plugins: [
         "advlist autolink link image lists charmap print preview hr anchor pagebreak",
         "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
         "table contextmenu directionality emoticons paste textcolor responsivefilemanager"
   ],
   toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
   toolbar2: "| responsivefilemanager | link unlink anchor | image media | forecolor backcolor  | print preview code ",
   image_advtab: true ,
   
   external_filemanager_path:"/filemanager/",
   filemanager_title:"Responsive Filemanager" ,
   external_plugins: { "filemanager" : "/filemanager/plugin.min.js"}
 });

3. Change the path in your tinymce init function in external_filemanager_path and external_plugins  (the path must be a absolute path from base_url of your site and must start with / so in this example i have the filemanager folder in www.site.com/filemanager/)

You can pass this variables on TinyMCE init.

- filemanager_title the title of filemanager window default="Responsive filemanager"
- filemanager_sort_by: the element to sorting (values: name,size,extension,date) default=""
- filemanager_descending: descending ? or ascending (values=true or false) default="false" 

**********************
If you are updating from older version (from 1 to 7) substitute your tinyMCE with new or download only the image/media/link originals folders and copy in your tinyMCE plugin folder
**********************

USE AS STAND-ALONE FILE MANAGER

You can use normal pop-up, Bootstrap modal, iframe, FancyBox iframe, Lightbox iframe to open the FileManager with these paths:

Only open filemanager(type=0 and not set field_id): 
path to filemanager../filemanager/dialog.php?type=0&fldr=

Select Image: (type=1 and set id of input text in field_id variable): 
path to filemanager../filemanager/dialog.php?type=1&field_id=fieldID

Select Video: (type=3 and set id of input text in field_id variable): 
path to filemanager../filemanager/dialog.php?type=3&field_id=fieldID

Select File: (type=2 and set id of input text in field_id variable): 
path to filemanager../filemanager/dialog.php?type=2&field_id=fieldID

Get Variables list
type: the type of filemanager (1:images files 2:all files 3:video files)
fldr: the folder where i enter (the root folder remains the same). default=""
lang: the language code (es: &lang=en_EN). default="en_EN"
sort_by: the element to sorting (values: name,size,extension,date)
descending: descending? or ascending (values=true or false)
subfolder: the subfolder use as root. default="" (ex: subfolder/)

If you want use popup add in the address &popup=1

PS If you want to force loading at root set fldr to /

In demo page i use FancyBox with this configuration:

    $('.iframe-btn').fancybox({	
	'width'		: 900,
	'height'	: 600,
	'type'		: 'iframe',
        'autoScale'    	: false
    });

and the button has this code to open FileManager:

<a href="filemanager/dialog.php?type=0" class="btn iframe-btn" type="button">Open Filemanager</a>

Remember to include FancyBox, file in head section:

<link rel="stylesheet" type="text/css" href="fancybox/jquery.fancybox-1.3.4.css" media="screen" />
<script type="text/javascript" src="fancybox/jquery.fancybox-1.3.4.pack.js"></script>

If you not use FancyBox,, you must change the function to close the windows after file selection in filemanager/js/include.js:

function close_window() {
    parent.$.fancybox.close();
}


SET SUBFOLDER AS ROOT AND MULTI-USER USE

You can set a subfolder as root.
So you can have a root folder for each user.
The way to implement this is set the session variable $_SESSION["subfolder"] ="subfolder/name/"

Remember that subfolder value must not have ../ ./ . inside and can't begin with /

Folder Example:

root
- folder1
  - subfolder1
  - subfolder2
- folder2
  -subfolder3

User1 subfolder=""
View:
folder1
  - subfolder1
  - subfolder2
folder2
  -subfolder3

User 2 subfolder="folder1"
View:
subfolder1
subfolder2

So if you want use filemanager in a multiuser CMS you can simply create a folder for each user and set a session variable ($_SESSION['subfolder']) with the name of the user folder


CUSTOMISE CONFIGURATION FOR EACH FOLDER

In FileManager Version you can customise the config.php for each folder. 
Simply create a config.php file inside your desired folder, and add the php variables that you wish to change. (Don't change $current_path,$upload_dir,$base_url,$root variables). 
You can also include an HTML text in the display folder page by simply inserting: $folder_message="html message". You can use this to specify the restriction or image resize in a particular folder.

Remember that the configuration of one folder is reflected in all its subdirectories.


CONFIG.PHP PARAMETERS SETTING

This is all parameters that you can change in config.php files

Parameters stored only in config/config.php file

Parameter	Example Value	Description

base_url	http://site.com	base url of site (without final /). if you prefer relative urls leave empty.
upload_dir	/uploads/	address path from base_url to base of upload folder (with start and final /).
current_path	../uploads/	relative path from filemanager folder to upload folder (with final /).
thumbs_base_path	thumbs/	relative path from filemanager folder to thumbs folder (with final /). NB thumbs folder must not reside in the upload folder. 


Parameters that you can override in all config.php files inside folders

Parameter	Example Value	Description

MaxSizeUpload	100	Max size upload limit in Mb.
default_language	en_EN	default language file name.
file_number_limit_js	500	the filter and sorter are managed through both javascript and php scripts. If you have a lot of files in a folder the javascript script wil not cope, so the filemanager then switches to the php script. The plugin automatically switches from javascript to php when the folder contains more than the specified number of files. 
show_sorting_bar	true	show or hide the sorting feature
show_folder_size	true	show or hide the folder size in filemanager list view (very large folders greatly increase the calculation time). 
Images configuration
image_max_width, image_max_height	800	these parameters set maximum pixel width and/or maximum pixel height for all images. if you set a maximum width or height, oversized images are converted to those limits. Images smaller than the limit(s) are unaffected. if you don't need a limit set both to 0.
image_resizing	false	activate or not Automatic resizing. if you set image_resizing to true the script converts all uploaded images exactly to image_resizing_width x image_resizing_height dimension.
image_resizing_width, image_resizing_height	800	these parameters set the dimensions of the resized image. if you set width or height to 0 the script automatically calculates the other dimension. NB Very large images may cause the script to fail unless the server's php memory and time limit configuration is modified.
Layout configuration
default_view	0	set the Default layout setting. ( 0 => boxes, 1 => detailed list (1 column) , 2 => columns list (multiple columns depending on the width of the page)).
ellipsis_title_after_first_row	true	if true the filename will be truncated if it runs beyond a single row.
Permissions configuration
delete_files	true	allow or disallow file deletion.
create_folders	true	allow or disallow folder creation.
delete_folders	true	allow or disallow folder deletion.
upload_files	true	allow or disallow file uploading.
rename_files	true	allow or disallow file renaming.
rename_folders	true	allow or disallow folder renaming.
Allowed extensions (this differentiation corresponds to the type filter)
ext_file	'pdf', 'doc'	allowed file extensions
ext_img	'jpg', 'jpeg'	allowed image file extensions.
ext_video	'mov', 'mpeg'	allowed video file extensions.
ext_music	'mp3', 'm4a'	allowed audio file extensions.
ext_misc	'zip', 'rar'	allowed archive file extensions.
Hidden files and folders
hidden_folders	"hidden_folder1", "hidden_folder2"	set the names of any folders you want hidden. Remember: all folders with these names will be hidden (you can set any exceptions in config.php files in folders). 
hidden_files	"this_document.pdf", "that_image.jpg"	set the names of any files you want hidden. remember these names will be hidden in all folders.
JAVA upload
java_upload	true	enable or disable java applets uploads
JAVAMaxSizeUpload	200	donparameter


*********************************************************
! Localization
*********************************************************
- BGR [Stanislav Panev]
- BRA [paulomanrique]
- CZE [jlusticky]
- ENG
- ESP [Roberto Santamaria]
- FRA [Mathieu Ducharme]
- GER [Sysix-Coding]
- HUN [Novák Szabolcs]
- ITA
- NOR [Pål Schroeder]
- NLD [johan12]
- POL [Remigiusz Waszkiewicz]
- POR [Sérgio Lima]
- RUS [Sergey]
- TUR [Ahmed Faruk Bora]
- UKR [Sergey]

*********************************************************
! Old version CHANGES
*********************************************************

version 8.1.1
- fixed all issues

version 8.1.0
- audio e video preview [thanks to Aniello Martuscelli for contribution]
- pre-loading bar and percentage until all image loaded
- remember sorting selection
- other layout and uploading bug fixed

version 8.0.2
- fix an 8.0.1 upload bug
- default sorting option
- minification of all files and filemanager folder cleaning
- js sorting split between folders and files
- other sorting fix

version 8.0.1
- simplification of the installation procedure
- compatibility with PHP versions < 5.3
- fix in use of subfolder session variable

version 8.0
- use responsive filemanager as an external plugin (simpler installation and allows updating of TinyMCE without changing any of its plugin.min.js files). Special thanks to Jules Gravinese
- amazing new direct button (TinyMCE plugin) to insert a file or image directly into the document
- change .config files in config.php for windows server compatibility
- add PHP sorting and filter script for huge folders. (the script automatically chooses which script to use)
- context menu to show file details
- sorting features in all layouts
- add in config.php the option to truncate over-long file names and add an ellipsis
- 24-hour retention of the last-opened layout using a cookie
- change alert to bootbox alert
- thumbs folder path customization
- block of right click out of files boxes
- tested in windows apache server
- fix various bugs and bad code
- improve security

version 7.3.2
- fix bug in internet explore 9/10 and old browser

version 7.3.1
- update plugins for TinyMCE 4.04
- minified plugin.min.js

version 7.3.0
- all windows prompt and confirm change to bootbox modal
- add info button
- minor bugs fix

version 7.2.0
- improved layout and security
- add file information in List view (size, image dimensions, modification date, file type)
- add real-time sorting in List view
- minor bugs fix

version 7.1.1
- some bugs fixing
- abilitation for java applet to run in a folder with htaccess password
- passing subfolder parameter only with SESSION variable to improving security

version 7.1.0
- Text filter in real-time
- New upload method through Java applet without size limitation (Java Multiple File Upload Applet (JUpload) takes care of the limitation posed by traditional HTML upload forms by allowing you to upload a whole directory and the files within it with a single click)
- Parsing special characters in all file/folder name
- Incremental naming when identical files are uploaded
- Automatic passing of images height and width to TinyMCE form (configurable in config.ph)
- All plugin.min.js file non-minified for customization
- Add file and folder exlusion list in config.php files
- Fix rename real-time bug
- Fix all existing bugs
- Customization of FileManager window title

version 7.0.0
- Renamimg of folders and files
- Configuration parameters customisable for every folder
- New file layouts: list view and column list view
- Large Improvement in security
- New license
- Improved, completely responsive design
- All bugs fixed (upload file with uppercase extension, folder creation,...)


Version 6:
- Improve quality of images resizing using PHP Image Magician
- Automatic compatibility with popup by pass the popup GET variable
- Compatibility with Internet Explorer and old browser
- Fix delete bug
- Improve security
- Improve Responsive design
- New amazing flat interface
- Possibility to set subfolder as root
- Ajax files and folders cancellation
- Improve speed, code structure and image size optimization
- If image is smaller than thumbnail the file manager show the image centered  
- TinyMCE link_list now is supported and plugin.min.js files aren't minimized [thanks to Pål Schroeder]
- Fix bug in file selection on subfolder and Other bug fix
- Mobile version with swipe event to show options


Version 5:
- Stand-alone use of filemanager, you can open and select files also dividing them according to the type (video, images and all files)

Version 4:
- Further simplify the installation steps
- Now thumbs folder is inside the file manager script
- Fix resizing bug, create folder possible bug
- AUTOMATIC Realignment of THUMBS tree and images if you upload file from other client FTP or other method
- Add loading animation while the image lightbox loading
- Add possibility to config size width or/and height image limits
- Add possibility to config automatic resizing and set only width or height size
- white background in png thumbs
- fallback upload for old browser
- fix folder delete bug	

Version 3:
- With this plugin you can also set automatic resizing of uploaded images.
- Moreover you can set the permits to delete files, folder and create folder.
- This version support advanced tab on image plugin
- For preview img in files list the plugin NOW create a thumbnail image with low resolution!!!
- Simplify the installation steps

*********************************************************
! Credits
*********************************************************
Bootstrap => http://twitter.github.io/bootstrap/
Bootstrap Lightbox => http://jbutz.github.io/bootstrap-lightbox/
Dropzonejs => http://www.dropzonejs.com/
Fancybox => http://fancybox.net/
TouchSwipe => http://labs.rampinteractive.co.uk/touchSwipe/demos/
PHP Image Magician => http://phpimagemagician.jarrodoberto.com/
Mini icons => http://www.fatcow.com/free-icons‎
Jupload => http://jupload.sourceforge.net/
Bootbox => http://bootboxjs.com/
jQuery contextMenu => http://medialize.github.io/jQuery-contextMenu/
Bootstrap-modal => https://github.com/jschr/bootstrap-modal
jPlayer => http://jplayer.org/
QueryLoader2 => http://www.gayadesign.com/diy/queryloader2-preload-your-images-with-ease/
*********************************************************