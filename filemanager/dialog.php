<?php

session_start();

$_SESSION["verify"] = "FileManager4TinyMCE";

if(isset($_POST['submit'])){

include('upload.php');

}else{

include('config/config.php');
include('include/utils.php');


if (isset($_GET['fldr']) && !empty($_GET['fldr'])) {
    $subdir = trim($_GET['fldr'],DIRECTORY_SEPARATOR) .DIRECTORY_SEPARATOR;
}
else
    $subdir = '';


/***
 *SUB-DIR CODE
 ***/
if(!isset($_SESSION["subfolder"])) $_SESSION["subfolder"]='';
$subfolder = '';
if(!empty($_SESSION["subfolder"]) && strpos($_SESSION["subfolder"],'..'.DIRECTORY_SEPARATOR)===FALSE
   && strpos($_SESSION["subfolder"],'.'.DIRECTORY_SEPARATOR)===FALSE && strpos($_SESSION["subfolder"],DIRECTORY_SEPARATOR)!==0
    && strpos($_SESSION["subfolder"],'.')===FALSE) $subfolder= $_SESSION['subfolder'];

if(trim($subfolder)==""){
    $cur_dir = $upload_dir . $subdir;
    $cur_path = $current_path . $subdir;
    $thumbs_path = 'thumbs'.DIRECTORY_SEPARATOR;
    $parent=$subdir;
}else{
    $cur_dir = $upload_dir . $subfolder . DIRECTORY_SEPARATOR . $subdir;
    $cur_path = $current_path . $subfolder .DIRECTORY_SEPARATOR. $subdir;
    $thumbs_path = 'thumbs'.DIRECTORY_SEPARATOR . $subfolder . DIRECTORY_SEPARATOR;
    $parent=$subfolder.DIRECTORY_SEPARATOR.$subdir;
}

$cycle=true;
while($cycle){
    if($parent==".".DIRECTORY_SEPARATOR) $parent="";    
    if(file_exists($current_path.$parent.".config")){
	require_once($current_path.$parent.".config");
	$cycle=false;
    }
    
    if($parent=="") $cycle=false;
    else $parent=dirname($parent).DIRECTORY_SEPARATOR;
}

if(!is_dir($thumbs_path.$subdir))
    create_folder(false, $thumbs_path.$subdir);

if(isset($_GET['popup'])) $popup= $_GET['popup']; else $popup=0;

//view type
if(!isset($_SESSION["view_type"])){ $view=$default_view; $_SESSION["view_type"] = $view; }
if(isset($_GET['view'])){ $view=$_GET['view']; $_SESSION["view_type"] = $view; }
$view=$_SESSION["view_type"];


$language_file = 'lang/en_EN.php'; 
if (isset($_GET['lang']) && $_GET['lang'] != 'undefined' && $_GET['lang']!='') {
    $path_parts = pathinfo($_GET['lang']);
    if(is_readable('lang/' .$path_parts['basename']. '.php')){ 
        $language_file = 'lang/' .$path_parts['basename']. '.php';
    }
}

require_once $language_file;

if(!isset($_GET['type'])) $_GET['type']=0;
if(!isset($_GET['field_id'])) $_GET['field_id']='';

$get_params = http_build_query(array(
    'type'      => $_GET['type'],
    'lang'      => $_GET['lang'] ? $_GET['lang'] : 'en_EN',
    'popup'     => $popup,
    'field_id'  => $_GET['field_id'] ? $_GET['field_id'] : '',
    'editor'    => $_GET['editor'] ? $_GET['editor'] : 'mce_0',
    'fldr'      => ''
));
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="robots" content="noindex,nofollow">
        <title>Responsive FileManager</title>
	<link rel="shortcut icon" href="ico/favicon.ico">
        <link href="css/bootstrap.min.css" rel="stylesheet" type="text/css" />
        <link href="css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css" />
        <link href="css/bootstrap-lightbox.min.css" rel="stylesheet" type="text/css" />
        <link href="css/style.css" rel="stylesheet" type="text/css" />
	<link href="css/dropzone.css" type="text/css" rel="stylesheet" />
	<!--[if lt IE 8]><style>
	.img-container span {
	    display: inline-block;
	    height: 100%;
	}
	</style><![endif]-->
        <script type="text/javascript" src="js/jquery.1.9.1.min.js"></script>
        <script type="text/javascript" src="js/bootstrap.min.js"></script>
        <script type="text/javascript" src="js/bootstrap-lightbox.min.js"></script>
	<script type="text/javascript" src="js/dropzone.min.js"></script>
	<script type="text/javascript" src="js/jquery.touchSwipe.min.js"></script>
	<script type="text/javascript" src="js/modernizr.custom.js"></script>
	<script type="text/javascript" src="js/bootbox.min.js"></script>
	<script>
	    var ext_img=new Array('<?php echo implode("','", $ext_img)?>');
	    var allowed_ext=new Array('<?php echo implode("','", $ext)?>');

	    //dropzone config
	    Dropzone.options.myAwesomeDropzone = {
		    dictInvalidFileType: "<?php echo lang_Error_extension;?>",
		    dictFileTooBig: "<?php echo lang_Error_Upload; ?>",
		    dictResponseError: "SERVER ERROR",
		    paramName: "file", // The name that will be used to transfer the file
		    maxFilesize: <?php echo $MaxSizeUpload; ?>, // MB
		    url: "upload.php",
		    accept: function(file, done) {
		    var extension=file.name.split('.').pop();
		    extension=extension.toLowerCase();
		      if ($.inArray(extension, allowed_ext) > -1) {
			done();
		      }
		      else { done("<?php echo lang_Error_extension;?>"); }
		    }
	    };
	</script>
	<script type="text/javascript" src="js/include.js"></script>
    </head>
    <body>
		<input type="hidden" id="popup" value="<?php echo $popup; ?>" />
		<input type="hidden" id="view" value="<?php echo $view; ?>" />
		<input type="hidden" id="track" value="<?php echo $_GET['editor']; ?>" />
		<input type="hidden" id="cur_dir" value="<?php echo $cur_dir; ?>" />
		<input type="hidden" id="cur_dir_thumb" value="<?php echo $thumbs_path.$subdir; ?>" />
		<input type="hidden" id="root" value="<?php echo $root; ?>" />
		<input type="hidden" id="insert_folder_name" value="<?php echo lang_Insert_Folder_Name; ?>" />
		<input type="hidden" id="new_folder" value="<?php echo lang_New_Folder; ?>" />
		<input type="hidden" id="ok" value="<?php echo lang_OK; ?>" />
		<input type="hidden" id="cancel" value="<?php echo lang_Cancel; ?>" />
		<input type="hidden" id="rename" value="<?php echo lang_Rename; ?>" />
		<input type="hidden" id="base_url" value="<?php echo $base_url?>"/>
		<input type="hidden" id="image_dimension_passing" value="<?php echo $image_dimension_passing; ?>" />
		
<?php if($upload_files){ ?>
<!----- uploader div start ------->
<div class="uploader">
    <center><button class="btn btn-inverse close-uploader"><i class="icon-backward icon-white"></i> <?php echo lang_Return_Files_List?></button></center>
	<div class="space10"></div><div class="space10"></div>
	<?php if($java_upload){ ?>
	<div class="tabbable upload-tabbable"> <!-- Only required for left/right tabs -->
	    <ul class="nav nav-tabs">
		<li class="active"><a href="#tab1" data-toggle="tab"><?php echo lang_Upload_base; ?></a></li>
		<li><a href="#tab2" id="uploader-btn" data-toggle="tab"><?php echo lang_Upload_java; ?></a></li>
	    </ul>
	    <div class="tab-content">
		<div class="tab-pane active" id="tab1">
		    <?php } ?>
		<form action="dialog.php" method="post" enctype="multipart/form-data" id="myAwesomeDropzone" class="dropzone">
		    <input type="hidden" name="path" value="<?php echo $cur_path?>"/>
		    <input type="hidden" name="path_thumb" value="<?php echo $thumbs_path.$subdir?>"/>
		    <div class="fallback">
			<?php echo  lang_Upload_file?>:<br/>
			<input name="file" type="file" />
			<input type="hidden" name="fldr" value="<?php echo $subdir; ?>"/>
			<input type="hidden" name="view" value="<?php echo $view; ?>"/>
			<input type="hidden" name="type" value="<?php echo $_GET['type']; ?>"/>
			<input type="hidden" name="field_id" value="<?php echo $_GET['field_id']; ?>"/>
			<input type="hidden" name="popup" value="<?php echo $popup; ?>"/>
			<input type="hidden" name="editor" value="<?php echo $_GET['editor']; ?>"/>
			<input type="hidden" name="lang" value="<?php echo $_GET['lang']; ?>"/>
			<input type="submit" name="submit" value="<?php echo lang_OK?>" />
		    </div>
		</form>
		<?php if($java_upload){ ?>
		</div>
		<div class="tab-pane" id="tab2">
		    <div id="iframe-container">
			
		    </div>
		    <div class="java-help"><?php echo lang_Upload_java_help; ?></div>
		</div>
		<?php } ?>
	    </div>
	</div>
	
</div>
<!----- uploader div start ------->

<?php } ?>		
          <div class="container-fluid">
          
          
<!----- header div start ------->
<div class="navbar navbar-fixed-top">
    <div class="navbar-inner">
        <div class="container-fluid">
	    <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
		<span class="icon-bar"></span>
	    </button>
	    <div class="brand"><?php echo lang_Toolbar; ?> -></div>
	    <div class="nav-collapse collapse">
		<div class="filters">
		    <div class="row-fluid">
			<div class="span3 half">
			    <span><?php echo lang_Actions; ?>:</span>
			    <?php if($upload_files){ ?>
						    <button class="tip btn upload-btn" title="<?php echo  lang_Upload_file; ?>"><i class="icon-plus"></i><i class="icon-file"></i></button> 
			    <?php } ?>
			    <?php if($create_folders){ ?>
						    <button class="tip btn new-folder" title="<?php echo  lang_New_Folder?>"><i class="icon-plus"></i><i class="icon-folder-open"></i></button> 
			    <?php } ?>
			</div>
			<div class="span3 half view-controller">
			    <span><?php echo lang_View; ?>:</span>
				<button class="btn tip<?php if($view==0) echo " btn-inverse"; ?>" id="view0" data-value="0" title="<?php echo lang_View_boxes; ?>"><i class="icon-th <?php if($view==0) echo "icon-white"; ?>"></i></button>
				<button class="btn tip<?php if($view==1) echo " btn-inverse"; ?>" id="view1" data-value="1" title="<?php echo lang_View_list; ?>"><i class="icon-align-justify <?php if($view==1) echo "icon-white"; ?>"></i></button>
				<button class="btn tip<?php if($view==2) echo " btn-inverse"; ?>" id="view2" data-value="2" title="<?php echo lang_View_columns_list; ?>"><i class="icon-fire <?php if($view==2) echo "icon-white"; ?>"></i></button>
			</div>
			<div class="span6 types">
			    <span><?php echo lang_Filters; ?>:</span>
			    
			    <input id="select-type-1" name="radio-sort" type="radio" data-item="ff-item-type-1" checked="checked"  class="hide"  />
			    <label id="ff-item-type-1" title="<?php echo lang_Files; ?>" for="select-type-1" class="tip btn ff-label-type-1"><i class="icon-file"></i></label>
			    <input id="select-type-2" name="radio-sort" type="radio" data-item="ff-item-type-2" class="hide"  />
			    <label id="ff-item-type-2" title="<?php echo lang_Images; ?>" for="select-type-2" class="tip btn ff-label-type-2"><i class="icon-picture"></i></label>
			    <input id="select-type-3" name="radio-sort" type="radio" data-item="ff-item-type-3" class="hide"  />
			    <label id="ff-item-type-3" title="<?php echo lang_Archives; ?>" for="select-type-3" class="tip btn ff-label-type-3"><i class="icon-inbox"></i></label>
			    <input id="select-type-4" name="radio-sort" type="radio" data-item="ff-item-type-4" class="hide"  />
			    <label id="ff-item-type-4" title="<?php echo lang_Videos; ?>" for="select-type-4" class="tip btn ff-label-type-4"><i class="icon-film"></i></label>
			    <input id="select-type-5" name="radio-sort" type="radio" data-item="ff-item-type-5" class="hide"  />
			    <label id="ff-item-type-5" title="<?php echo lang_Music; ?>" for="select-type-5" class="tip btn ff-label-type-5"><i class="icon-music"></i></label>
			    
			    <input accesskey="f" type="text" class="filter-input" id="filter-input" name="filter" placeholder="<?php echo strtolower(lang_Text_filter); ?>..." value=""/>
			    
			    <input id="select-type-all" name="radio-sort" type="radio" data-item="ff-item-type-all" class="hide" />
			    <label id="ff-item-type-all" title="<?php echo lang_All; ?>" for="select-type-all" class="tip btn btn-inverse ff-label-type-all"><i class="icon-align-justify icon-white"></i></label>
			    
			</div>
		    </div>
		</div>
	    </div>
	</div>
    </div>
</div>

<!----- header div end ------->



    <!----- breadcrumb div start ------->
    <div class="row-fluid">
	<?php	
	$link="dialog.php?".$get_params;
	?>
	<ul class="breadcrumb">
	<li class="pull-left"><a href="<?php echo $link?>"><i class="icon-home"></i></a></li><li><span class="divider">/</span></li>
	<?php
	$bc=explode(DIRECTORY_SEPARATOR,$subdir);
	$tmp_path='';
	if(!empty($bc))
	foreach($bc as $k=>$b){ 
		$tmp_path.=$b.DIRECTORY_SEPARATOR;
		if($k==count($bc)-2){
	?> <li class="active"><?php echo $b?></li><?php
		}elseif($b!=""){ ?>
		<li><a href="<?php echo $link.$tmp_path?>"><?php echo $b?></a></li><li><span class="divider"><?php echo DIRECTORY_SEPARATOR; ?></span></li>
	<?php }
	}
	?>
	<li class="pull-right"><a href="javascript:void('')" id="info"><i class="icon-question-sign"></i></a> <a id="refresh" href="dialog.php?<?php echo $get_params.$subdir."&".uniqid() ?>"><i class="icon-refresh"></i></a></li>
	</ul>
    </div>
    <!----- breadcrumb div end ------->




    <div class="row-fluid ff-container">
	<div class="span12">	    
	    <?php if(@opendir($root . $cur_dir)===FALSE){ ?>
	    <br/>
	    <div class="alert alert-error">There is an error! The root folder not exist. </div> 
	    <?php }else{ ?>
	    <h4 id="help"><?php echo lang_Swipe_help; ?></h4>
	    <?php if(isset($folder_message)){ ?>
		<div class="alert alert-block"><?php echo $folder_message; ?></div>
	    <?php } ?>
	    <?php if($show_sorting_bar){ ?>
	    <!-- sorter -->
	    <div class="sorter-container <?php echo "list-view".$view; ?>">
		<div class="file-name"><a class="sorter" href="javascript:void('')" data-sort="name"><?php echo lang_Filename; ?></a></div>
		<div class="file-date"><a class="sorter" href="javascript:void('')" data-sort="date"><?php echo lang_Date; ?></a></div>
		<div class="file-size"><a class="sorter" href="javascript:void('')" data-sort="size"><?php echo lang_Size; ?></a></div>
		<div class='img-dimension'><?php echo lang_Dimension; ?></div>
		<div class='file-extension'><a class="sorter" href="javascript:void('')" data-sort="extension"><?php echo lang_Type; ?></a></div>
		<div class='file-operations'>Operations</div>
	    </div>
	    <?php } ?>
	    
	    <!--ul class="thumbnails ff-items"-->
	    <ul class="grid cs-style-2 <?php echo "list-view".$view; ?>">
		<?php
		$class_ext = '';
		$src = '';
		
		 
		$dir = opendir($root . $cur_dir);
		$i = 0;
		$k=0;
		$start=false;
		$end=false;
		if ($_GET['type']==1) 	 $apply = 'apply_img';
		elseif($_GET['type']==2) $apply = 'apply_link';
		elseif($_GET['type']==0 && $_GET['field_id']=='') $apply = 'apply_none';
		elseif($_GET['type']==3 || $_GET['type']==4 || $_GET['type']==5) $apply = 'apply_video';
		else				     $apply = 'apply';
		
		$files = scandir($root . $cur_dir);
		
		foreach ($files as $file) {
			
			if($file == '.' || !is_dir($root . $cur_dir . $file) || ($file == '..' && $subdir == '') || in_array($file, $hidden_folders))
				continue;
			
			//add in thumbs folder if not exist 
			if (!file_exists($thumbs_path.$subdir.$file)) create_folder(false,$thumbs_path.$subdir.$file);
			$class_ext = 3;			
			if($file=='..' && trim($subdir) != '' ){
			    $src = explode(DIRECTORY_SEPARATOR,$subdir);
			    unset($src[count($src)-2]);
			    $src=implode(DIRECTORY_SEPARATOR,$src);
			}
			elseif ($file!='..') {
			    $src = $subdir . $file.DIRECTORY_SEPARATOR;
			}
			
			?>
			<li data-name="<?php echo $file ?>" <?php if($file=='..') echo 'class="back"'; ?>>
				<figure class="<?php if($file=="..") echo "back-"; ?>directory">
				    <a title="<?php echo lang_Open?>" class="folder-link" href="dialog.php?<?php echo $get_params.$src."&".uniqid() ?>">
				    <div class="img-precontainer">
					<div class="img-container directory"><span></span>
					<img class="directory-img"  src="ico/folder<?php if($file==".."){ echo "_return"; }?>.png" alt="folder" />
					</div>
				    </div>
				    <div class="img-container-mini directory">
					<img class="directory-img"  src="ico/folder<?php if($file==".."){ echo "_return"; }?>.png" alt="folder" />
				    </div>
			<?php if($file==".."){ ?>
				    <div class="box no-effect">
					<h4><?php echo lang_Back ?></h4>
				    </div>
				    </a>
				    
			<?php }else{ ?>
					
				    </a>
				    <div class="box">
					<h4><a title="<?php echo lang_Open?>" class="folder-link" data-file="<?php echo $file ?>" href="dialog.php?<?php echo $get_params.$src."&".uniqid() ?>"><?php echo $file ?></a></h4>
				    </div>
				    <?php $date=filemtime($root . $cur_dir . $file);
				    $size=foldersize($root . $cur_dir . $file);
				    ?>
				    <input type="hidden" class="name" value=""/>
				    <input type="hidden" class="date" value="<?php echo date('Y-mdHis',$date); ?>"/>
				    <input type="hidden" class="size" value="<?php echo $size ?>"/>
				    <input type="hidden" class="extension" value="<?php echo lang_Type_dir; ?>"/>
				    <div class="file-date"><?php echo date(lang_Date_type,$date)?></div>
				    <?php if($show_folder_size){ ?><div class="file-size"><?php echo makeSize($size)?></div><?php } ?>
				    <div class='file-extension'><?php echo lang_Type_dir; ?></div>
				    <figcaption>
					    <a href="javascript:void('')" class="tip-left edit-button <?php if($rename_folders) echo "rename-folder"; ?>" title="<?php echo lang_Rename?>" data-path="<?php echo $root. $cur_dir .$file; ?>" data-thumb="<?php echo $thumbs_path.$subdir.$file; ?>">
					    <i class="icon-pencil <?php if(!$rename_folders) echo 'icon-white'; ?>"></i></a>
					    <a href="javascript:void('')" class="tip-left erase-button <?php if($delete_folders) echo "delete-folder"; ?>" title="<?php echo lang_Erase?>" data-confirm="<?php echo lang_Confirm_Folder_del; ?>" data-path="<?php echo $root. $cur_dir .$file; ?>"  data-thumb="<?php echo $thumbs_path.$subdir .$file; ?>">
					    <i class="icon-trash <?php if(!$delete_folders) echo 'icon-white'; ?>"></i>
					    </a>
				    </figcaption>
			<?php } ?>
			    </figure>
			</li>
			<?php
			$k++;
		    }
			
		    foreach ($files as $nu=>$file) {
			
				$file_ext = substr(strrchr($file,'.'),1);		
			
				if($file == '.' || $file == '..' || is_dir($root . $cur_dir . $file) || in_array($file, $hidden_files) || !in_array($file_ext, $ext))
					continue;
				
			    $is_img=false;
			    $is_video=false;
			    $show_original=false;
			    $mini_src="";
			    $file_path=dirname( __FILE__ ). DIRECTORY_SEPARATOR.$current_path.$subfolder.DIRECTORY_SEPARATOR.$subdir.$file;
				if(in_array($file_ext, $ext_img)){
					$src = $base_url . $cur_dir . $file;
					$mini_src = $src_thumb = $thumbs_path.$subdir. $file;
					//add in thumbs folder if not exist 
					$thumb_path=str_replace(DIRECTORY_SEPARATOR.DIRECTORY_SEPARATOR,DIRECTORY_SEPARATOR,dirname( __FILE__ ).DIRECTORY_SEPARATOR."thumbs".DIRECTORY_SEPARATOR.$subfolder.DIRECTORY_SEPARATOR.$subdir.$file);
					
					if(!file_exists($thumb_path)){
						create_img_gd($file_path, $thumb_path, 122, 91);
					}
					$is_img=true;
					//check if is smaller tha thumb
					list($img_width, $img_height, $img_type, $attr)=getimagesize($file_path);
					
					if($img_width<122 && $img_height<91){
						$src_thumb=$current_path.$subfolder.DIRECTORY_SEPARATOR.$subdir.$file;
						$show_original=true;
					}
				}elseif(file_exists('ico/'.strtoupper($file_ext).".png")){
					$src_thumb ='ico/'.strtoupper($file_ext).".png";
				}else{
					$src_thumb = "ico/Default.png";
				}
				
				if($mini_src==""){
					if(file_exists('ico/file_extension_'.strtolower($file_ext).".png")){
						$mini_src  ='ico/file_extension_'.strtolower($file_ext).".png";
					}else{
						$mini_src ='ico/'.strtoupper($file_ext).".png";
					}
				}
				
				$class_ext=0;
				if (in_array($file_ext, $ext_video)) {
					$class_ext = 4;
					$is_video=true;
				}elseif (in_array($file_ext, $ext_img)) {
					$class_ext = 2;
				}elseif (in_array($file_ext, $ext_music)) {
					$class_ext = 5;
				}elseif (in_array($file_ext, $ext_misc)) {
					$class_ext = 3;
				}else{
					$class_ext = 1;
				}
				
				if((!($_GET['type']==1 && !$is_img) && !($_GET['type']>=3 && !$is_video)) && $class_ext>0){
?>
		<li class="ff-item-type-<?php echo $class_ext; ?>"  data-name="<?php echo $file ?>">
			<figure>
				<a href="javascript:void('')" title="<?php echo  lang_Select?>" class="link" data-file="<?php echo $file; ?>" data-type="<?php echo $_GET['type']; ?>" data-field_id="<?php echo $_GET['field_id']; ?>" data-function="<?php echo $apply; ?>">
				<div class="img-precontainer">
					<div class="img-container">
						<span></span>
						<img data-src="holder.js/122x91" alt="image" <?php echo $show_original ? "class='original'" : "" ?> src="<?php echo $src_thumb; ?>">
					</div>
				</div>
				<div class="img-container-mini <?php if($is_img) echo 'original-thumb' ?>">
				    <img alt="image" src="<?php echo $mini_src; ?>">
				</div>
				</a>	
				<div class="box">				
				<h4><a href="javascript:void('')" title="<?php echo  lang_Select?>" class="link" data-file="<?php echo $file; ?>" data-type="<?php echo $_GET['type']; ?>" data-field_id="<?php echo $_GET['field_id']; ?>" data-function="<?php echo $apply; ?>">
				<?php $filename=substr($file, 0, '-' . (strlen($file_ext) + 1)); echo $filename; ?></a> </h4>
				</div>
				<?php $date=filemtime($file_path);
				$size=filesize($file_path);
				?>
				<input type="hidden" class="date" value="<?php echo date('Y-mdHis',$date); ?>"/>
				<input type="hidden" class="size" value="<?php echo $size ?>"/>
				<input type="hidden" class="extension" value="<?php echo $file_ext; ?>"/>
				<input type="hidden" class="name" value=""/>
				<div class="file-date"><?php echo date(lang_Date_type,$date)?></div>
				<div class="file-size"><?php echo makeSize($size)?></div>
				<div class='img-dimension'><?php if($is_img){ echo $img_width."x".$img_height; } ?></div>
				<div class='file-extension'><?php echo $file_ext; ?></div>
				<figcaption>
				    <form action="force_download.php" method="post" class="download-form" id="form<?php echo $nu; ?>">
					<input type="hidden" name="path" value="<?php echo $root. $cur_dir. $file?>"/>
					<input type="hidden" name="name" value="<?php echo $file?>"/>
					
				    <a title="<?php echo lang_Download?>" class="tip-right" href="javascript:void('')" onclick="$('#form<?php echo $nu; ?>').submit();"><i class="icon-download"></i></a>
				    <?php if($is_img){ ?>
				    <a class="tip-right preview" title="<?php echo lang_Preview?>" data-url="<?php echo $src;?>" data-toggle="lightbox" href="#previewLightbox"><i class=" icon-eye-open"></i></a>
				    <?php }else{ ?>
				    <a class="preview disabled"><i class="icon-eye-open icon-white"></i></a>
				    <?php } ?>
				    <a href="javascript:void('')" class="tip-left edit-button <?php if($rename_files) echo "rename-file"; ?>" title="<?php echo lang_Rename?>" data-path="<?php echo $root. $cur_dir .$file; ?>" data-thumb="<?php echo $thumbs_path.$subdir .$file; ?>">
				    <i class="icon-pencil <?php if(!$rename_files) echo 'icon-white'; ?>"></i></a>
					    
				    <a href="javascript:void('')" class="tip-left erase-button <?php if($delete_files) echo "delete-file"; ?>" title="<?php echo lang_Erase?>" data-confirm="<?php echo lang_Confirm_del; ?>" data-path="<?php echo $root. $cur_dir .$file; ?>" data-thumb="<?php echo $thumbs_path.$subdir .$file; ?>">
				    <i class="icon-trash <?php if(!$delete_files) echo 'icon-white'; ?>"></i>
				    </a>
				    </form>
				</figcaption>
			</figure>			
		</li>
		    <?php
		    $i++;
		    }
		}
	?></div><?php
		closedir($dir);
		?>
	    </ul>
	    <?php } ?>
	</div>
    </div>
</div>
    
    <!----- lightbox div start ------->    
    <div id="previewLightbox" class="lightbox hide fade"  tabindex="-1" role="dialog" aria-hidden="true">
	    <div class='lightbox-content'>
		    <img id="full-img" src="">
	    </div>    
    </div>
    <!----- lightbox div end ------->

    <!----- loading div start ------->  
    <div id="loading_container" style="display:none;">
	    <div id="loading" style="background-color:#000; position:fixed; width:100%; height:100%; top:0px; left:0px;z-index:100000"></div>
	    <img id="loading_animation" src="img/storing_animation.gif" alt="loading" style="z-index:10001; margin-left:-32px; margin-top:-32px; position:fixed; left:50%; top:50%"/>
    </div>
    <!----- loading div end ------->
    
</body>
</html>
<?php } ?>
