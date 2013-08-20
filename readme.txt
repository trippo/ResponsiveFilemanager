*********************************************************
! Responsive FileManager for TinyMCE Version 7.2.0
*********************************************************
Responsive FileManager for TinyMCE is a free open-source file manager made with the jQuery library, CSS3, PHP and HTML5 that offers a nice and elegant way to upload and insert files, images and videos with TinyMCE version 4.x.
You can also use it as a stand-alone file manager to manage and select files.
The script automatically creates thumbnails of images for the preview list.
It can be configured for automatic resizing of uploaded images or to automatically limit the size.
You can personalise the configuration for each folder.
You can set a subfolder as the root and change the configuration for each user, page or FileManager call.



CHANGES LOG

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
- Add file and folder exlusion list in config.php and .config files
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


DEMO: http://www.responsivefilemanager.com/

Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.

Creator : info@albertoperipolli.com - tr1pp0

*********************************************************
! Installation
*********************************************************
1. Upload each folder (images, link, media and filemanager) to the TinyMCE plugins folder (if you want use only FileManager copy only filemanager folder).
2. Create a folder for your uploaded files and give it write permission (755).
3. Open filemanager/config/config.php and edit the settings for base_url, upload_dir, type extensions allowed, max file size, permits etcSave file.
4. Great! Your work is finished!

PS If you don't see the preview images you need to give write permission to the thumbs folder in filemanager/thumbs.
If you are updating from a previous version of FileManager delete the contents of thumbs folder; the script will automatically re-create the thumbnails.
!IMPORTANT: if you are using htaccess protection, make sure your $GLOBALS PHP_AUTH_USER/PHP_AUTH_USER are defined in your webserver config

USE AS TINYMCE 4 FILEMANGER

Settings of tinymce should be like this: (remember to add filemanager in plugins list)
tinymce.init({
    selector: "textarea",
    theme: "modern",
    width: 680,
    height: 300,
    plugins: [
         "advlist autolink link image lists charmap print preview hr anchor pagebreak",
         "searchreplace wordcount visualblocks visualchars code insertdatetime media nonbreaking",
         "table contextmenu directionality emoticons paste textcolor filemanager"
   ],
   image_advtab: true,
   toolbar: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect forecolor backcolor | link unlink anchor | image media | print preview code"
 }); 
You can pass subfolder and filemanager title on TinyMCE init.


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
subfolder: the subfolder use as root. default=""


If you want use popup add in the address &popup=1

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



SET SUBFOLDER AS ROOT

You can set a subfolder as root and change this parameter in tinymce init or in external-link  through the subfolder variables.
So you can have a root folder for every user or use.
Remember to create the subfolder in your source folder first :)

In tinymce editor you must set the variable
    subfolder:"folder",
while in external link you can add in get parameters
    &subfolder=folder

The best way is with the session variable $_SESSION["subfolder"] =

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


CUSTOMISE CONFIGURATION FOR EACH FOLDER

In FileManager Version 7 you can customise the config.php for each folder. Simply create a .config file inside your desired folder, and add the php variables that you wish to change. (Don't change $current_path,$upload_dir,$base_url,$root variables). You can also include an HTML text file by simply inserting .config file: $folder_message="html message" inside the folder. You can use this to specify the restriction or image resize.

Remember that the configuration of one folder is reflected in all its subdirectories.

MULTI-USER USE
If you want use filemanager in a multiuser cms you can simply create a folder for each users and set the session variable ($_SESSION['subfolder']) with the name of the user folder


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
- HUN [Bende Roland]
- ITA
- NLD [johan12]
- POL [Michell Hoduń]
- POR [Sérgio Lima]
- RUS [vasromand]
- TUR [Ahmed Faruk Bora]

*********************************************************
! Old version CHANGES
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
Jupload => http://jupload.sourceforge.net/
Bootbox => http://bootboxjs.com/
*********************************************************