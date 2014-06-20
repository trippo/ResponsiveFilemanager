<?php

include('config/config.php');
if($_SESSION['RF']["verify"] != "RESPONSIVEfilemanager") die('Access Denied!');
include('include/utils.php');

if (isset($_SESSION['RF']['language_file']) && file_exists($_SESSION['RF']['language_file'])){
	include($_SESSION['RF']['language_file']);
}
else {
	die('Language file is missing!');
}

if(isset($_GET['action'])) 
{
    switch($_GET['action']) 
    {
		case 'view':
		    if(isset($_GET['type'])) {
				$_SESSION['RF']["view_type"] = $_GET['type'];
			}
			else {
				die('view type number missing');
			}
			break;
		case 'sort':
			if(isset($_GET['sort_by'])) {
				$_SESSION['RF']["sort_by"] = $_GET['sort_by'];
			}
			
			if(isset($_GET['descending'])) {
				$_SESSION['RF']["descending"] = $_GET['descending'] === "TRUE";
			}
			break;
		case 'image_size': // not used
	    	$pos = strpos($_POST['path'],$upload_dir);
			if ($pos !== FALSE) 
			{
				$info=getimagesize(substr_replace($_POST['path'],$current_path,$pos,strlen($upload_dir)));
				echo json_encode($info);
			}
	    	break;
		case 'save_img':
		    $info=pathinfo($_POST['name']);

		    if (strpos($_POST['path'], '/') === 0
			|| strpos($_POST['path'], '../') !== FALSE
			|| strpos($_POST['path'], './') === 0
			|| strpos($_POST['url'], 'http://featherfiles.aviary.com/') !== 0
			|| $_POST['name'] != fix_filename($_POST['name'], $transliteration,$convert_spaces)
			|| !in_array(strtolower($info['extension']), array('jpg','jpeg','png')))
		    {
			    die('wrong data');
			}

		    $image_data = get_file_by_url($_POST['url']);
		    if ($image_data === FALSE) 
		    {
		        die(lang_Aviary_No_Save);
		    }

		    file_put_contents($current_path.$_POST['path'].$_POST['name'],$image_data);

		    create_img_gd($current_path.$_POST['path'].$_POST['name'], $thumbs_base_path.$_POST['path'].$_POST['name'], 122, 91);
		    // TODO something with this function cause its blowing my mind
		    new_thumbnails_creation($current_path.$_POST['path'],$current_path.$_POST['path'].$_POST['name'],$_POST['name'],$current_path,$relative_image_creation,$relative_path_from_current_pos,$relative_image_creation_name_to_prepend,$relative_image_creation_name_to_append,$relative_image_creation_width,$relative_image_creation_height,$relative_image_creation_option,$fixed_image_creation,$fixed_path_from_filemanager,$fixed_image_creation_name_to_prepend,$fixed_image_creation_to_append,$fixed_image_creation_width,$fixed_image_creation_height,$fixed_image_creation_option);
		    break;
		case 'extract':
		    if(strpos($_POST['path'],'/')===0 || strpos($_POST['path'],'../')!==FALSE || strpos($_POST['path'],'./')===0) {
				die('wrong path');
			}

		    $path = $current_path.$_POST['path'];
		    $info = pathinfo($path);
		    $base_folder = $current_path.fix_dirname($_POST['path'])."/";

		    switch($info['extension'])
		    {
				case "zip":
				    $zip = new ZipArchive;
				    if ($zip->open($path) === TRUE) {
						//make all the folders
						for($i = 0; $i < $zip->numFiles; $i++) 
						{ 
						    $OnlyFileName = $zip->getNameIndex($i);
						    $FullFileName = $zip->statIndex($i);    
						    if (substr($FullFileName['name'], -1, 1) =="/")
						    {
								create_folder($base_folder.$FullFileName['name']);
						    }
						}
						//unzip into the folders
						for($i = 0; $i < $zip->numFiles; $i++) 
						{ 
						    $OnlyFileName = $zip->getNameIndex($i);
						    $FullFileName = $zip->statIndex($i);    
					    
						    if (!(substr($FullFileName['name'], -1, 1) =="/"))
						    {
								$fileinfo = pathinfo($OnlyFileName);
								if(in_array(strtolower($fileinfo['extension']),$ext))
								{
								    copy('zip://'. $path .'#'. $OnlyFileName , $base_folder.$FullFileName['name'] ); 
								} 
						    }
						}
						$zip->close();
				    }
				    else {
						die(lang_Zip_No_Extract);
				    }

				    break;

				case "gz":
				    $p = new PharData($path);
				    $p->decompress(); // creates files.tar

				    break;

				case "tar":
				    // unarchive from the tar
				    $phar = new PharData($path);
				    $phar->decompressFiles();
				    $files = array();
				    check_files_extensions_on_phar( $phar, $files, '', $ext );
				    $phar->extractTo( $current_path.fix_dirname( $_POST['path'] )."/", $files, TRUE );

				    break;

				default:
					die(lang_Zip_Invalid);
		    }
		    break;
		case 'media_preview':    
			$preview_file = $_GET["file"];
			$info = pathinfo($preview_file);
			?>
			<div id="jp_container_1" class="jp-video " style="margin:0 auto;">
			    <div class="jp-type-single">
			      <div id="jquery_jplayer_1" class="jp-jplayer"></div>
			      <div class="jp-gui">
			        <div class="jp-video-play">
			          <a href="javascript:;" class="jp-video-play-icon" tabindex="1">play</a>
			        </div>
			        <div class="jp-interface">
			          <div class="jp-progress">
			            <div class="jp-seek-bar">
			              <div class="jp-play-bar"></div>
			            </div>
			          </div>
			          <div class="jp-current-time"></div>
			          <div class="jp-duration"></div>
			          <div class="jp-controls-holder">
			            <ul class="jp-controls">
			              <li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>
			              <li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>
			              <li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li>
			              <li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>
			              <li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>
			              <li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>
			            </ul>
			            <div class="jp-volume-bar">
			              <div class="jp-volume-bar-value"></div>
			            </div>
			            <ul class="jp-toggles">
			              <li><a href="javascript:;" class="jp-full-screen" tabindex="1" title="full screen">full screen</a></li>
			              <li><a href="javascript:;" class="jp-restore-screen" tabindex="1" title="restore screen">restore screen</a></li>
			              <li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>
			              <li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>
			            </ul>
			          </div>
			          <div class="jp-title" style="display:none;">
			            <ul>
			              <li></li>
			            </ul>
			          </div>
			        </div>
			      </div>
			      <div class="jp-no-solution">
			        <span>Update Required</span>
			        To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.
			      </div>
			    </div>
			  </div>
			<?php
			if(in_array(strtolower($info['extension']), $ext_music)) {
			?>

				<script type="text/javascript">
				    $(document).ready(function(){
						
				      $("#jquery_jplayer_1").jPlayer({
				        ready: function () {
				          $(this).jPlayer("setMedia", {
					    title:"<?php $_GET['title']; ?>",  
				            mp3: "<?php echo $preview_file; ?>",
				            m4a: "<?php echo $preview_file; ?>",
					    oga: "<?php echo $preview_file; ?>",
				            wav: "<?php echo $preview_file; ?>"
				          });
				        },
				        swfPath: "js",
					solution:"html,flash",
				        supplied: "mp3, m4a, midi, mid, oga,webma, ogg, wav",
					smoothPlayBar: true,
					keyEnabled: false
				      });
				    });
				  </script>

			<?php
			} elseif(in_array(strtolower($info['extension']), $ext_video)) {
			?>
			    
			    <script type="text/javascript">
			    $(document).ready(function(){
					
			      $("#jquery_jplayer_1").jPlayer({
			        ready: function () {
			          $(this).jPlayer("setMedia", {
				    title:"<?php $_GET['title']; ?>",  
			            m4v: "<?php echo $preview_file; ?>",
			            ogv: "<?php echo $preview_file; ?>"
			          });
			        },
			        swfPath: "js",
				solution:"html,flash",
			        supplied: "mp4, m4v, ogv, flv, webmv, webm",
				smoothPlayBar: true,
				keyEnabled: false
			    });
				  
			    });
			  </script>
			    
			<?php
			}
			break;
		case 'copy_cut':
			if ($_POST['sub_action'] != 'copy' && $_POST['sub_action'] != 'cut') {
				die('wrong sub-action');
			}

			if (trim($_POST['path']) == '' || trim($_POST['path_thumb']) == '') {
				die('no path');
			}

			$path = $current_path.$_POST['path'];

			if (is_dir($path))
			{
				// can't copy/cut dirs
				if ($copy_cut_dirs === FALSE){
					die(sprintf(lang_Copy_Cut_Not_Allowed, ($_POST['sub_action'] == 'copy' ? lcfirst(lang_Copy) : lcfirst(lang_Cut)), lang_Folders));
				}

				// size over limit
				if ($copy_cut_max_size !== FALSE && is_int($copy_cut_max_size)){
					if (($copy_cut_max_size * 1024 * 1024) < foldersize($path)){
						die(sprintf(lang_Copy_Cut_Size_Limit, ($_POST['sub_action'] == 'copy' ? lcfirst(lang_Copy) : lcfirst(lang_Cut)), $copy_cut_max_size));
					}
				}

				// file count over limit
				if ($copy_cut_max_count !== FALSE && is_int($copy_cut_max_count)){
					if ($copy_cut_max_count < filescount($path)){
						die(sprintf(lang_Copy_Cut_Count_Limit, ($_POST['sub_action'] == 'copy' ? lcfirst(lang_Copy) : lcfirst(lang_Cut)), $copy_cut_max_count));
					}
				}
			}
			else {
				// can't copy/cut files
				if ($copy_cut_files === FALSE){
					die(sprintf(lang_Copy_Cut_Not_Allowed, ($_POST['sub_action'] == 'copy' ? lcfirst(lang_Copy) : lcfirst(lang_Cut)), lang_Files));
				}
			}

			$_SESSION['RF']['clipboard']['path'] = $_POST['path'];
			$_SESSION['RF']['clipboard']['path_thumb'] = $_POST['path_thumb'];
			$_SESSION['RF']['clipboard_action'] = $_POST['sub_action'];
			break;
		case 'clear_clipboard':
			$_SESSION['RF']['clipboard'] = NULL;
			$_SESSION['RF']['clipboard_action'] = NULL;
			break;
		case 'chmod':
			$path = $current_path.$_POST['path'];
			if ( (is_dir($path) && $chmod_dirs === FALSE) ||
				 (is_file($path) && $chmod_files === FALSE) ||
				 (is_function_callable("chmod") === FALSE) )
			{
				die(sprintf(lang_File_Permission_Not_Allowed, (is_dir($path) ? lcfirst(lang_Folders) : lcfirst(lang_Files))));
			}
			else 
			{
				$perm = decoct(fileperms($path) & 0777);
				$perm_user = substr($perm, 0, 1);
				$perm_group = substr($perm, 1, 1);
				$perm_all = substr($perm, 2, 1);

				$ret = '<div id="files_permission_start">
				<form id="chmod_form">
					<table class="file-perms-table">
						<thead>
							<tr>
								<td></td>
								<td>r&nbsp;&nbsp;</td>
								<td>w&nbsp;&nbsp;</td>
								<td>x&nbsp;&nbsp;</td>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>'.lang_User.'</td>
								<td><input id="u_4" type="checkbox" data-value="4" data-group="user" onChange="chmod_logic();"'.(chmod_logic_helper($perm_user, 4) ? " checked" : "").'></td>
								<td><input id="u_2" type="checkbox" data-value="2" data-group="user" onChange="chmod_logic();"'.(chmod_logic_helper($perm_user, 2) ? " checked" : "").'></td>
								<td><input id="u_1" type="checkbox" data-value="1" data-group="user" onChange="chmod_logic();"'.(chmod_logic_helper($perm_user, 1) ? " checked" : "").'></td>
							</tr>
							<tr>
								<td>'.lang_Group.'</td>
								<td><input id="g_4" type="checkbox" data-value="4" data-group="group" onChange="chmod_logic();"'.(chmod_logic_helper($perm_group, 4) ? " checked" : "").'></td>
								<td><input id="g_2" type="checkbox" data-value="2" data-group="group" onChange="chmod_logic();"'.(chmod_logic_helper($perm_group, 2) ? " checked" : "").'></td>
								<td><input id="g_1" type="checkbox" data-value="1" data-group="group" onChange="chmod_logic();"'.(chmod_logic_helper($perm_group, 1) ? " checked" : "").'></td>
							</tr>
							<tr>
								<td>'.lang_All.'</td>
								<td><input id="a_4" type="checkbox" data-value="4" data-group="all" onChange="chmod_logic();"'.(chmod_logic_helper($perm_all, 4) ? " checked" : "").'></td>
								<td><input id="a_2" type="checkbox" data-value="2" data-group="all" onChange="chmod_logic();"'.(chmod_logic_helper($perm_all, 2) ? " checked" : "").'></td>
								<td><input id="a_1" type="checkbox" data-value="1" data-group="all" onChange="chmod_logic();"'.(chmod_logic_helper($perm_all, 1) ? " checked" : "").'></td>
							</tr>
							<tr>
								<td></td>
								<td colspan="3"><input type="text" name="chmod_value" id="chmod_value" value="'.$perm.'" data-def-value="'.$perm.'"></td>
							</tr>
						</tbody>
					</table>';

				if (is_dir($path)){
					$ret .= '<div>'.lang_File_Permission_Recursive.'
							<ul>
								<li><input value="none" name="apply_recursive" type="radio" checked> '.lang_No.'</li>
								<li><input value="files" name="apply_recursive" type="radio"> '.lang_Files.'</li>
								<li><input value="folders" name="apply_recursive" type="radio"> '.lang_Folders.'</li>
								<li><input value="both" name="apply_recursive" type="radio"> '.lang_Files.' & '.lang_Folders.'</li>
							</ul>
							</div>';
				}

				$ret .= '</form></div>';

				echo $ret;
			}
			break;
		case 'get_lang':
			if (!file_exists('lang/languages.php')){
				die(lang_Lang_Not_Found);
			}

			require_once('lang/languages.php');
			if (!isset($languages) || !is_array($languages)){
				die(lang_Lang_Not_Found);
			}

			$curr = $_SESSION['RF']['language'];

			$ret = '<select id="new_lang_select">';
			foreach ($languages as $code => $name) {
				$ret .= '<option value="'.$code.'"'.($code == $curr ? ' selected' : '').'>'.$name.'</option>';
			}
			$ret .= '</select>';

			echo $ret;

			break;
		case 'change_lang':
			$choosen_lang = $_POST['choosen_lang'];

			if (!file_exists('lang/'.$choosen_lang.'.php')) {
				die(lang_Lang_Not_Found);
			}

			$_SESSION['RF']['language'] = $choosen_lang;
			$_SESSION['RF']['language_file'] = 'lang/'.$choosen_lang.'.php';

			break;
		case 'get_file': // preview or edit
			$sub_action = $_GET['sub_action'];

			if ($sub_action != 'preview' && $sub_action != 'edit'){
				die("wrong action");
			}

			$selected_file = ($sub_action == 'preview' ? $_GET['file'] : $current_path.$_POST['path']);
			$info = pathinfo($selected_file);

			if (!file_exists($selected_file)) {
				die(lang_File_Not_Found);
			}

			$is_allowed = ($sub_action == 'preview' ? $preview_text_files : $edit_text_files);
			$allowed_file_exts = ($sub_action == 'preview' ? $previewable_text_file_exts : $editable_text_file_exts);

			if (!isset($allowed_file_exts) || !is_array($allowed_file_exts)){
				$allowed_file_exts = array();
			}

			if (!in_array($info['extension'], $allowed_file_exts) 
				|| !isset($is_allowed) 
				|| $is_allowed === FALSE
				|| !is_readable($selected_file)) 
			{
				die(sprintf(lang_File_Open_Edit_Not_Allowed, ($sub_action == 'preview' ? strtolower(lang_Open) : strtolower(lang_Edit))));
			}

			// get and sanities
			$data = file_get_contents($selected_file);
			$data = htmlspecialchars($data);
			$data = stripslashes($data);

			if ($sub_action == 'preview') {
				// echo '<h1>'.$info['basename'].'</h1><pre>'.$data.'</pre>';
				echo '<h2>'.$info['basename'].'</h2><textarea disabled style="width:100%;height:150px;">'.$data.'</textarea>';
			}
			else {
				echo '<textarea id="textfile_edit_area" style="width:100%;height:150px;">'.$data.'</textarea>';
			}

			break;
	    default: die('no action passed');
    }
}
else 
{
	die('no action passed');
}

?>