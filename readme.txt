*********************************************************
! Responsive FileManager for TinyMCE Version 7.0.0
*********************************************************

Responsive FileManager for TinyMCE is a tool make with jQuery library, CSS3, PHP and html5 that offers a nice and elegant way to upload and insert files, images and videos with tinyMCE version 4.x.
Now you can use also stand-alone as normal filemanager, you can manage and select files.
The script automatically create a thumbs of images for preview list.
You can config if you want an automatic resizing of uploaded images.
You can personalize the configurations for each folder.
You can set a subfolder as root and change the configuration for every user, page or filemanager call.


NEWS version 7.0.0

- Rename of folders and files
- Configuration parameters customizable for every folder
- New file layouts: list view and column list view
- Large Improve of security
- New license
- Improve design with completely responsive design
- All bug fixed (upload file with uppercase extension, folder creation,...)


DEMO: http://www.responsivefilemanager.com/

Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.

Creator : info@albertoperipolli.com - tr1pp0

*********************************************************
! Installation
*********************************************************
1. Upload each folder (images, link, media and filemanager) to tinyMCE plugins folder (if you want use only filemanager copy only filemanager folder).
2. Create folder where upload files and give write permits.
3. Open filemanager/config/config.php and set your configurations like base_url, upload_dir, type extensions allowed , max file size, permits… and other specifications. save file. 
4. Great!! Your work is finish!!! 

P.S.: If you not view the preview images remember to give write permits to the thumbs folder in filemanager/thumbs.
If you update from previous version delete the contents of thumbs folder, the script automatically re-create the thumbs structure.


USING AS TINYMCE 4 FILEMANGER

Settings of tinymce should be like : (remember to add filemanager in plugins list)
tinymce.init({
    selector: "textarea",
    theme: "modern",
    width: 680,
    height: 300,
    subfolder:"",
    plugins: [
         "advlist autolink link image lists charmap print preview hr anchor pagebreak",
         "searchreplace wordcount visualblocks visualchars code insertdatetime media nonbreaking",
         "table contextmenu directionality emoticons paste textcolor filemanager"
   ],
   image_advtab: true,
   toolbar: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect forecolor backcolor | link unlink anchor | image media | print preview code"
 }); 


USING AS STAND-ALONE FILEMANAGER

You can use normal popup, bootstrap modal,iframe, fancybox iframe , lightbox iframe to open the filemanager with this paths:

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
subfolder: the subfolder use as root. default=""


If you want use popup add in the address &popup=1

In demo page i use fancybox with this configuration:

    $('.iframe-btn').fancybox({	
	'width'		: 900,
	'height'	: 600,
	'type'		: 'iframe',
        'autoScale'    	: false
    });

and button have this code to open filemanager:

<a href="filemanager/dialog.php?type=0" class="btn iframe-btn" type="button">Open Filemanager</a>

Remember to include fancybox file in head section:

<link rel="stylesheet" type="text/css" href="fancybox/jquery.fancybox-1.3.4.css" media="screen" />
<script type="text/javascript" src="fancybox/jquery.fancybox-1.3.4.pack.js"></script>

If you not use fancybox, you must change the function to close the windows after file selection in filemanager/js/include.js:

function close_window() {
    parent.$.fancybox.close();
}



SET SUBFOLDER AS ROOT

You can set subfolder as root an change this parameter in tinymce init or in external-link  through the subfolder variables.
So you can have a root folder for every user or use.
Remember to create subfolder in your source folder before :)

In tinymce editor you must set the variable
    subfolder:"folder",
while in external link you can add in get parameters
    &subfolder=folder

The best way is with session variable $_SESSION["subfolder"] =

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


CUSTOMIZE CONFIGURATION IN EACH FOLDER

In FileManager Version 7 you can customize the config.php for each folder. Simply create a .config file inside your desired folder, and add the php variables which you wish to change. (don't change $current_path,$upload_dir,$base_url,$root variables). You can also include a html text file by simply inserting .config file: $folder_message="html message" inside the folder. You can use this to specify the restriction or image resize.

Remember than the configuration of one folder is also reflected in all subdirectories.


*********************************************************
! Localization
*********************************************************
- BGR [Stanislav Panev]
- BRA [paulomanrique]
- CZE [jlusticky]
- ENG
- FRA [2b3ez]
- GER [Oliver Beta]
- HUN [Bende Roland]
- ITA
- NLD [johan12]
- POL [Michell Hoduń]
- POR [Sérgio Lima]
- RUS [vasromand]

*********************************************************
! Old version news
*********************************************************

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
*********************************************************