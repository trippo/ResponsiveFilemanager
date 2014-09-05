<?php
include('config/config.php');
if ($_SESSION['RF']["verify"] != "RESPONSIVEfilemanager") die('forbiden');
include('include/utils.php');

$thumb_pos  = strpos($_POST['path_thumb'], $thumbs_base_path);

if ($thumb_pos !=0
    || strpos($_POST['path_thumb'],'../',strlen($thumbs_base_path)+$thumb_pos)!==FALSE
    || strpos($_POST['path'],'/')===0
    || strpos($_POST['path'],'../')!==FALSE
    || strpos($_POST['path'],'./')===0)
{
    die('wrong path');
}

if (isset($_SESSION['RF']['language_file']) && file_exists($_SESSION['RF']['language_file'])){
    require_once($_SESSION['RF']['language_file']);
}
else {
    die('Language file is missing!');
}

$base = $current_path;
$path = $current_path.$_POST['path'];
$cycle = TRUE;
$max_cycles = 50;
$i = 0;
while($cycle && $i<$max_cycles)
{
    $i++;
    if ($path == $base)  $cycle=FALSE;
    
    if (file_exists($path."config.php"))
    {
	   require_once($path."config.php");
	   $cycle = FALSE;
    }
    $path = fix_dirname($path)."/";
    $cycle = FALSE;
}

$path = $current_path.$_POST['path'];
$path_thumb = $_POST['path_thumb'];
if (isset($_POST['name']))
{
    $name = $_POST['name'];
    if (strpos($name,'../') !== FALSE) die('wrong name');
}

$info = pathinfo($path);
if (isset($info['extension']) && !(isset($_GET['action']) && $_GET['action']=='delete_folder') && !in_array(strtolower($info['extension']), $ext) && $_GET['action'] != 'create_file')
{
    die('wrong extension');
}
    
if (isset($_GET['action']))
{
    switch($_GET['action'])
    {
        case 'delete_file':
            if ($delete_files){
                unlink($path);
                if (file_exists($path_thumb)) unlink($path_thumb);
		    
        		$info=pathinfo($path);
        		if ($relative_image_creation){
        		    foreach($relative_path_from_current_pos as $k=>$path)
                    {
                        if ($path!="" && $path[strlen($path)-1]!="/") $path.="/";

            			if (file_exists($info['dirname']."/".$path.$relative_image_creation_name_to_prepend[$k].$info['filename'].$relative_image_creation_name_to_append[$k].".".$info['extension']))
                        {
            			    unlink($info['dirname']."/".$path.$relative_image_creation_name_to_prepend[$k].$info['filename'].$relative_image_creation_name_to_append[$k].".".$info['extension']);
            			}
        		    }
        		}
        		
        		if ($fixed_image_creation)
                {
        		    foreach($fixed_path_from_filemanager as $k=>$path)
                    {
            			if ($path!="" && $path[strlen($path)-1] != "/") $path.="/";

            			$base_dir=$path.substr_replace($info['dirname']."/", '', 0, strlen($current_path));
            			if (file_exists($base_dir.$fixed_image_creation_name_to_prepend[$k].$info['filename'].$fixed_image_creation_to_append[$k].".".$info['extension']))
                        {
            			    unlink($base_dir.$fixed_image_creation_name_to_prepend[$k].$info['filename'].$fixed_image_creation_to_append[$k].".".$info['extension']);
            			}
        		    }
        		}
            }
            break;
        case 'delete_folder':
            if ($delete_folders){
        		if (is_dir($path_thumb))
                {
        		    deleteDir($path_thumb);
                }

        		if (is_dir($path))
                {
        		    deleteDir($path);	
        		    if ($fixed_image_creation)
                    {
            			foreach($fixed_path_from_filemanager as $k=>$paths){
            			    if ($paths!="" && $paths[strlen($paths)-1] != "/") $paths.="/";

            			    $base_dir=$paths.substr_replace($path, '', 0, strlen($current_path));
            			    if (is_dir($base_dir)) deleteDir($base_dir);
            			}
        		    }
        		}
            }
            break;
        case 'create_folder':
            if ($create_folders)
            {
                create_folder(fix_path($path,$transliteration,$convert_spaces),fix_path($path_thumb,$transliteration,$convert_spaces));
            }
            break;
        case 'rename_folder':
            if ($rename_folders){
                $name=fix_filename($name,$transliteration,$convert_spaces);
                $name=str_replace('.','',$name);
		
                if (!empty($name)){
                    if (!rename_folder($path,$name,$transliteration,$convert_spaces)) die(lang_Rename_existing_folder);

                    rename_folder($path_thumb,$name,$transliteration,$convert_spaces);
        		    if ($fixed_image_creation){
            			foreach($fixed_path_from_filemanager as $k=>$paths){
            			    if ($paths!="" && $paths[strlen($paths)-1] != "/") $paths.="/";
            			    
                            $base_dir=$paths.substr_replace($path, '', 0, strlen($current_path));
            			    rename_folder($base_dir,$name,$transliteration,$convert_spaces);
            			}
		           }
                }
                else {
                    die(lang_Empty_name);
                }
            }
            break;
        case 'create_file':
            if ($create_text_files === FALSE) {
                die(sprintf(lang_File_Open_Edit_Not_Allowed, strtolower(lang_Edit)));
            }

            if (!isset($editable_text_file_exts) || !is_array($editable_text_file_exts)){
                $editable_text_file_exts = array();
            }

            // check if user supplied extension
            if (strpos($name, '.') === FALSE){
                die(lang_No_Extension.' '.sprintf(lang_Valid_Extensions, implode(', ', $editable_text_file_exts)));
            }

            // correct name
            $old_name = $name;
            $name=fix_filename($name,$transliteration,$convert_spaces);
            if (empty($name))
            {
                die(lang_Empty_name);
            }

            // check extension
            $parts = explode('.', $name);
            if (!in_array(end($parts), $editable_text_file_exts)) {
                die(lang_Error_extension.' '.sprintf(lang_Valid_Extensions, implode(', ', $editable_text_file_exts)));
            }

            // correct paths
            $path = str_replace($old_name, $name, $path);
            $path_thumb = str_replace($old_name, $name, $path_thumb);

            // file already exists
            if (file_exists($path)) {
                die(lang_Rename_existing_file);
            }

            $content = $_POST['new_content'];

            if (@file_put_contents($path, $content) === FALSE) {
                die(lang_File_Save_Error);
            }
            else {
                if (is_function_callable('chmod') !== FALSE){
                    chmod($path, 0644);
                }
                echo lang_File_Save_OK;
            }

            break;
        case 'rename_file':
            if ($rename_files){
                $name=fix_filename($name,$transliteration,$convert_spaces);
                if (!empty($name))
                {
                    if (!rename_file($path,$name,$transliteration)) die(lang_Rename_existing_file);

                    rename_file($path_thumb,$name,$transliteration);

        		    if ($fixed_image_creation)
                    {
                        $info=pathinfo($path);

            			foreach($fixed_path_from_filemanager as $k=>$paths)
                        {
            			    if ($paths!="" && $paths[strlen($paths)-1] != "/") $paths.="/";

            			    $base_dir = $paths.substr_replace($info['dirname']."/", '', 0, strlen($current_path));
            			    if (file_exists($base_dir.$fixed_image_creation_name_to_prepend[$k].$info['filename'].$fixed_image_creation_to_append[$k].".".$info['extension']))
                            {
            				    rename_file($base_dir.$fixed_image_creation_name_to_prepend[$k].$info['filename'].$fixed_image_creation_to_append[$k].".".$info['extension'],$fixed_image_creation_name_to_prepend[$k].$name.$fixed_image_creation_to_append[$k],$transliteration);
            			    }
            			}
        		    }
                }
                else {
                    die(lang_Empty_name);
                }
            }
            break;
	   case 'duplicate_file':
            if ($duplicate_files)
            {
                $name=fix_filename($name,$transliteration,$convert_spaces);
                if (!empty($name))
                {
                    if (!duplicate_file($path,$name)) die(lang_Rename_existing_file);
                    
                    duplicate_file($path_thumb,$name);
        		    
                    if ($fixed_image_creation)
                    {
                        $info=pathinfo($path);
            			foreach($fixed_path_from_filemanager as $k=>$paths)
                        {
            			    if ($paths!="" && $paths[strlen($paths)-1] != "/") $paths.= "/";

            			    $base_dir=$paths.substr_replace($info['dirname']."/", '', 0, strlen($current_path));

            			    if (file_exists($base_dir.$fixed_image_creation_name_to_prepend[$k].$info['filename'].$fixed_image_creation_to_append[$k].".".$info['extension']))
                            {
            				duplicate_file($base_dir.$fixed_image_creation_name_to_prepend[$k].$info['filename'].$fixed_image_creation_to_append[$k].".".$info['extension'],$fixed_image_creation_name_to_prepend[$k].$name.$fixed_image_creation_to_append[$k]);
            			    }
            			}
        		    }
                }
                else
                {
                    die(lang_Empty_name);
                }
            }
            break;
        case 'paste_clipboard':
            if ( ! isset($_SESSION['RF']['clipboard_action'], $_SESSION['RF']['clipboard']['path'], $_SESSION['RF']['clipboard']['path_thumb']) 
                || $_SESSION['RF']['clipboard_action'] == '' 
                || $_SESSION['RF']['clipboard']['path'] == ''
                || $_SESSION['RF']['clipboard']['path_thumb'] == '')
            {
                die();
            }

            $action = $_SESSION['RF']['clipboard_action'];
            $data = $_SESSION['RF']['clipboard'];
            $data['path'] = $current_path.$data['path'];
            $pinfo = pathinfo($data['path']);
            
            // user wants to paste to the same dir. nothing to do here...
            if ($pinfo['dirname'] == rtrim($path, '/')) {
                die();
            }

            // user wants to paste folder to it's own sub folder.. baaaah.
            if (is_dir($data['path']) && strpos($path, $data['path']) !== FALSE){
                die();
            } 

            // something terribly gone wrong
            if ($action != 'copy' && $action != 'cut'){
                die('no action');
            }

            // check for writability
            if (is_really_writable($path) === FALSE || is_really_writable($path_thumb) === FALSE){
                die(lang_Dir_No_Write.'<br/>'.str_replace('../','',$path).'<br/>'.str_replace('../','',$path_thumb));
            }

            // check if server disables copy or rename
            if (is_function_callable(($action == 'copy' ? 'copy' : 'rename')) === FALSE){
                die(sprintf(lang_Function_Disabled, ($action == 'copy' ? lcfirst(lang_Copy) : lcfirst(lang_Cut))));
            }

            if ($action == 'copy')
            {
                rcopy($data['path'], $path);
                rcopy($data['path_thumb'], $path_thumb);
            }
            elseif ($action == 'cut')
            {
                rrename($data['path'], $path);
                rrename($data['path_thumb'], $path_thumb);

                // cleanup
                if (is_dir($data['path']) === TRUE){
                    rrename_after_cleaner($data['path']);
                    rrename_after_cleaner($data['path_thumb']);
                }
            }

            // cleanup
            $_SESSION['RF']['clipboard']['path'] = NULL;
            $_SESSION['RF']['clipboard']['path_thumb'] = NULL;
            $_SESSION['RF']['clipboard_action'] = NULL;

            break;
        case 'chmod':
            $mode = $_POST['new_mode'];
            $rec_option = $_POST['is_recursive'];
            $valid_options = array('none', 'files', 'folders', 'both');
            $chmod_perm = (is_dir($path) ? $chmod_dirs : $chmod_files);

            // check perm
            if ($chmod_perm === FALSE) {
                die(sprintf(lang_File_Permission_Not_Allowed, (is_dir($path) ? lcfirst(lang_Folders) : lcfirst(lang_Files))));
            }

            // check mode
            if (!preg_match("/^[0-7]{3}$/", $mode)){
                die(lang_File_Permission_Wrong_Mode);
            }

            // check recursive option
            if (!in_array($rec_option, $valid_options)){
                die("wrong option");
            }

            // check if server disabled chmod
            if (is_function_callable('chmod') === FALSE){
                die(sprintf(lang_Function_Disabled, 'chmod'));
            }
            
            $mode = "0".$mode;
            $mode = octdec($mode);

            rchmod($path, $mode, $rec_option);

            break;
        case 'save_text_file':
            $content = $_POST['new_content'];
            // $content = htmlspecialchars($content); not needed
            // $content = stripslashes($content);

            // no file
            if (!file_exists($path)) {
                die(lang_File_Not_Found);
            }

            // not writable or edit not allowed
            if (!is_writable($path) || $edit_text_files === FALSE) {
                die(sprintf(lang_File_Open_Edit_Not_Allowed, strtolower(lang_Edit)));
            }

            if (@file_put_contents($path, $content) === FALSE) {
                die(lang_File_Save_Error);
            }
            else {
                echo lang_File_Save_OK;
            }

            break;
        default:
            die('wrong action');
    }  
}

?>