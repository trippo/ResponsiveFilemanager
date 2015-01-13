<?php

if ($_SESSION['RF']["verify"] != "RESPONSIVEfilemanager") die('forbiden');

function deleteDir($dir)
{
    if (!file_exists($dir)) return true;
    if (!is_dir($dir)) return unlink($dir);
    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') continue;
        if (!deleteDir($dir . DIRECTORY_SEPARATOR . $item)) return false;
    }
    return rmdir($dir);
}

function duplicate_file($old_path, $name)
{
    if (file_exists($old_path)) {
        $info = mb_pathinfo($old_path);
        $new_path = $info['dirname'] . "/" . $name . "." . $info['extension'];
        if (file_exists($new_path) && $old_path == $new_path) return false;
        return copy($old_path, $new_path);
    }
}

function rename_file($old_path, $name, $transliteration)
{
    $name = fix_filename($name, $transliteration);
    if (file_exists($old_path)) {
        $info = mb_pathinfo($old_path);
        $new_path = $info['dirname'] . "/" . $name . "." . $info['extension'];
        if (file_exists($new_path) && $old_path == $new_path) return false;
        return rename($old_path, $new_path);
    }
}

function rename_folder($old_path, $name, $transliteration)
{
    $name = fix_filename($name, $transliteration, false, '_', true);
    if (file_exists($old_path)) {
        $new_path = fix_dirname($old_path) . "/" . $name;
        if (file_exists($new_path) && $old_path == $new_path) return false;
        return rename($old_path, $new_path);
    }
}

function create_img($imgfile, $imgthumb, $newwidth, $newheight = "", $option = "crop")
{
    $timeLimit = ini_get('max_execution_time');
    set_time_limit(30);
    $result = false;
    if (image_check_memory_usage($imgfile, $newwidth, $newheight)) {
        require_once('php_image_magician.php');
        $magicianObj = new imageLib($imgfile);
        $magicianObj->resizeImage($newwidth, $newheight, $option);
        $magicianObj->saveImage($imgthumb, 80);
        $result = true;
    }
    set_time_limit($timeLimit);
    return $result;
}

function makeSize($size)
{
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    $u = 0;
    while ((round($size / 1024) > 0) && ($u < 4)) {
        $size = $size / 1024;
        $u++;
    }
    return (number_format($size, 0) . " " . $units[$u]);
}

function foldersize($path)
{
    $total_size = 0;
    $files = scandir($path);
    $cleanPath = rtrim($path, '/') . '/';

    foreach ($files as $t) {
        if ($t != "." && $t != "..") {
            $currentFile = $cleanPath . $t;
            if (is_dir($currentFile)) {
                $size = foldersize($currentFile);
                $total_size += $size;
            } else {
                $size = filesize($currentFile);
                $total_size += $size;
            }
        }
    }

    return $total_size;
}

function filescount($path)
{
    $total_count = 0;
    $files = scandir($path);
    $cleanPath = rtrim($path, '/') . '/';

    foreach ($files as $t) {
        if ($t != "." && $t != "..") {
            $currentFile = $cleanPath . $t;
            if (is_dir($currentFile)) {
                $size = filescount($currentFile);
                $total_count += $size;
            } else {
                $total_count += 1;
            }
        }
    }

    return $total_count;
}

function create_folder($path = false, $path_thumbs = false)
{
    $oldumask = umask(0);
    
    if ($path && !file_exists($path))
        mkdir($path, 0755, true); // or even 01777 so you get the sticky bit set 
    if ($path_thumbs && !file_exists($path_thumbs))
        mkdir($path_thumbs, 0755, true) or die("$path_thumbs cannot be found"); // or even 01777 so you get the sticky bit set 
    umask($oldumask);
}

function check_files_extensions_on_path($path, $ext)
{
    if (!is_dir($path)) {
        $fileinfo = mb_pathinfo($path);
        if (!in_array(mb_strtolower($fileinfo['extension']), $ext))
            unlink($path);
    } else {
        $files = scandir($path);
        foreach ($files as $file) {
            check_files_extensions_on_path(trim($path, '/') . "/" . $file, $ext);
        }
    }
}

function check_files_extensions_on_phar($phar, &$files, $basepath, $ext)
{
    foreach ($phar as $file) {
        if ($file->isFile()) {
            if (in_array(mb_strtolower($file->getExtension()), $ext)) {
                $files[] = $basepath . $file->getFileName();
            }
        } else if ($file->isDir()) {
            $iterator = new DirectoryIterator($file);
            check_files_extensions_on_phar($iterator, $files, $basepath . $file->getFileName() . '/', $ext);
        }
    }
}

function fix_get_params($str)
{
    return strip_tags(preg_replace("/[^a-zA-Z0-9\.\[\]_| -]/", '', $str));
}

function fix_filename($str, $transliteration, $convert_spaces = false, $replace_with = "_", $is_folder = false)
{
    if ($convert_spaces) {
        $str = str_replace(' ', $replace_with, $str);
    }

    if ($transliteration) {
        if (function_exists('transliterator_transliterate')) {
            $str = transliterator_transliterate('Accents-Any', $str);
        } else {
            $str = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $str);
        }

        $str = preg_replace("/[^a-zA-Z0-9\.\[\]_| -]/", '', $str);
    }

    $str = str_replace(array('"', "'", "/", "\\"), "", $str);
    $str = strip_tags($str);

    // Empty or incorrectly transliterated filename.
    // Here is a point: a good file UNKNOWN_LANGUAGE.jpg could become .jpg in previous code.
    // So we add that default 'file' name to fix that issue.
    if (strpos($str, '.') === 0 && $is_folder === false) {
        $str = 'file' . $str;
    }

    return trim($str);
}

function fix_dirname($str)
{
    return str_replace('~', ' ', dirname(str_replace(' ', '~', $str)));
}

function fix_strtoupper($str)
{
    if (function_exists('mb_strtoupper'))
        return mb_strtoupper($str);
    else
        return strtoupper($str);
}


function fix_strtolower($str)
{
    if (function_exists('mb_strtoupper'))
        return mb_strtolower($str);
    else
        return strtolower($str);
}
function mb_pathinfo($filepath) {
    preg_match('%^(.*?)[\\\\/]*(([^/\\\\]*?)(\.([^\.\\\\/]+?)|))[\\\\/\.]*$%im',$filepath,$m);
    if($m[1]) $ret['dirname']=$m[1];
    if($m[2]) $ret['basename']=$m[2];
    if($m[5]) $ret['extension']=$m[5];
    if($m[3]) $ret['filename']=$m[3];
    return $ret;
}

function fix_path($path, $transliteration, $convert_spaces = false, $replace_with = "_")
{
    
    $info = mb_pathinfo($path);
    $tmp_path = $info['dirname'];
    $str = fix_filename($info['filename'], $transliteration, $convert_spaces, $replace_with);
    if ($tmp_path != "")
        return $tmp_path . DIRECTORY_SEPARATOR . $str;
    else
        return $str;
}

function base_url()
{
    return sprintf(
        "%s://%s",
        isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
        $_SERVER['HTTP_HOST']
    );
}

function config_loading($current_path, $fld)
{
    if (file_exists($current_path . $fld . ".config")) {
        require_once($current_path . $fld . ".config");
        return true;
    }
    echo "!!!!" . $parent = fix_dirname($fld);
    if ($parent != "." && !empty($parent)) {
        config_loading($current_path, $parent);
    }

    return false;
}


function image_check_memory_usage($img, $max_breedte, $max_hoogte)
{
    if (file_exists($img)) {
        $K64 = 65536; // number of bytes in 64K
        $memory_usage = memory_get_usage();
        $memory_limit = abs(intval(str_replace('M', '', ini_get('memory_limit')) * 1024 * 1024));
        $image_properties = getimagesize($img);
        $image_width = $image_properties[0];
        $image_height = $image_properties[1];
        $image_bits = $image_properties['bits'];
        $image_memory_usage = $K64 + ($image_width * $image_height * ($image_bits) * 2);
        $thumb_memory_usage = $K64 + ($max_breedte * $max_hoogte * ($image_bits) * 2);
        $memory_needed = intval($memory_usage + $image_memory_usage + $thumb_memory_usage);

        if ($memory_needed > $memory_limit) {
            ini_set('memory_limit', (intval($memory_needed / 1024 / 1024) + 5) . 'M');
            if (ini_get('memory_limit') == (intval($memory_needed / 1024 / 1024) + 5) . 'M') {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function endsWith($haystack, $needle)
{
    return $needle === "" || substr($haystack, -strlen($needle)) === $needle;
}

function new_thumbnails_creation($targetPath, $targetFile, $name, $current_path, $relative_image_creation, $relative_path_from_current_pos, $relative_image_creation_name_to_prepend, $relative_image_creation_name_to_append, $relative_image_creation_width, $relative_image_creation_height, $relative_image_creation_option, $fixed_image_creation, $fixed_path_from_filemanager, $fixed_image_creation_name_to_prepend, $fixed_image_creation_to_append, $fixed_image_creation_width, $fixed_image_creation_height, $fixed_image_creation_option)
{
    //create relative thumbs
    $all_ok = true;
    if ($relative_image_creation) {
        foreach ($relative_path_from_current_pos as $k => $path) {
            if ($path != "" && $path[strlen($path) - 1] != "/") $path .= "/";
            if (!file_exists($targetPath . $path)) create_folder($targetPath . $path, false);
            $info = mb_pathinfo($name);
            if (!endsWith($targetPath, $path))
                if (!create_img($targetFile, $targetPath . $path . $relative_image_creation_name_to_prepend[$k] . $info['filename'] . $relative_image_creation_name_to_append[$k] . "." . $info['extension'], $relative_image_creation_width[$k], $relative_image_creation_height[$k], $relative_image_creation_option[$k]))
                    $all_ok = false;
        }
    }

    //create fixed thumbs
    if ($fixed_image_creation) {
        foreach ($fixed_path_from_filemanager as $k => $path) {
            if ($path != "" && $path[strlen($path) - 1] != "/") $path .= "/";
            $base_dir = $path . substr_replace($targetPath, '', 0, strlen($current_path));
            if (!file_exists($base_dir)) create_folder($base_dir, false);
            $info = mb_pathinfo($name);
            if (!create_img($targetFile, $base_dir . $fixed_image_creation_name_to_prepend[$k] . $info['filename'] . $fixed_image_creation_to_append[$k] . "." . $info['extension'], $fixed_image_creation_width[$k], $fixed_image_creation_height[$k], $fixed_image_creation_option[$k]))
                $all_ok = false;
        }
    }
    return $all_ok;
}


// Get a remote file, using whichever mechanism is enabled
function get_file_by_url($url)
{
    if (ini_get('allow_url_fopen')) {
        return file_get_contents($url);
    }
    if (!function_exists('curl_version')) {
        return false;
    }

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

// test for dir/file writability properly
function is_really_writable($dir)
{
    $dir = rtrim($dir, '/');
    // linux, safe off
    if (DIRECTORY_SEPARATOR == '/' && @ini_get("safe_mode") == FALSE) {
        return is_writable($dir);
    }

    // Windows, safe ON. (have to write a file :S)
    if (is_dir($dir)) {
        $dir = $dir . '/' . md5(mt_rand(1, 1000) . mt_rand(1, 1000));

        if (($fp = @fopen($dir, 'ab')) === FALSE) {
            return FALSE;
        }

        fclose($fp);
        @chmod($dir, 0755);
        @unlink($dir);
        return TRUE;
    } elseif (!is_file($dir) || ($fp = @fopen($dir, 'ab')) === FALSE) {
        return FALSE;
    }

    fclose($fp);
    return TRUE;
}

/**
 * Check if a function is callable.
 * Some servers disable copy,rename etc.
 *
 * Returns TRUE if callable and everything is OK
 * Otherwise returns FALSE
 */
function is_function_callable($name)
{
    if (function_exists($name) === FALSE) return FALSE;
    $disabled = explode(',', ini_get('disable_functions'));
    return !in_array($name, $disabled);
}

// recursivly copies everything
function rcopy($source, $destination, $is_rec = FALSE)
{
    if (is_dir($source)) {
        if ($is_rec === FALSE) {
            $pinfo = mb_pathinfo($source);
            $destination = rtrim($destination, '/') . DIRECTORY_SEPARATOR . $pinfo['basename'];
        }
        if (is_dir($destination) === FALSE) {
            mkdir($destination, 0755, true);
        }

        $files = scandir($source);
        foreach ($files as $file) {
            if ($file != "." && $file != "..") {
                rcopy($source . DIRECTORY_SEPARATOR . $file, rtrim($destination, '/') . DIRECTORY_SEPARATOR . $file, TRUE);
            }
        }
    } else {
        if (file_exists($source)) {
            if (is_dir($destination) === TRUE) {
                $pinfo = mb_pathinfo($source);
                $dest2 = rtrim($destination, '/') . DIRECTORY_SEPARATOR . $pinfo['basename'];
            } else {
                $dest2 = $destination;
            }

            copy($source, $dest2);
        }
    }
}

// recursivly renames everything
// I know copy and rename could be done with just one function
// but i split the 2 because sometimes rename fails on windows
// Need more feedback from users and refactor if needed
function rrename($source, $destination, $is_rec = FALSE)
{
    if (is_dir($source)) {
        if ($is_rec === FALSE) {
            $pinfo = mb_pathinfo($source);
            $destination = rtrim($destination, '/') . DIRECTORY_SEPARATOR . $pinfo['basename'];
        }
        if (is_dir($destination) === FALSE) {
            mkdir($destination, 0755, true);
        }

        $files = scandir($source);
        foreach ($files as $file) {
            if ($file != "." && $file != "..") {
                rrename($source . DIRECTORY_SEPARATOR . $file, rtrim($destination, '/') . DIRECTORY_SEPARATOR . $file, TRUE);
            }
        }
    } else {
        if (file_exists($source)) {
            if (is_dir($destination) === TRUE) {
                $pinfo = mb_pathinfo($source);
                $dest2 = rtrim($destination, '/') . DIRECTORY_SEPARATOR . $pinfo['basename'];
            } else {
                $dest2 = $destination;
            }

            rename($source, $dest2);
        }
    }
}

// On windows rename leaves folders sometime
// This will clear leftover folders
// After more feedback will merge it with rrename
function rrename_after_cleaner($source)
{
    $files = scandir($source);

    foreach ($files as $file) {
        if ($file != "." && $file != "..") {
            if (is_dir($source . DIRECTORY_SEPARATOR . $file)) {
                rrename_after_cleaner($source . DIRECTORY_SEPARATOR . $file);
            } else {
                unlink($source . DIRECTORY_SEPARATOR . $file);
            }
        }
    }

    return rmdir($source);
}

function rchmod($source, $mode, $rec_option = "none", $is_rec = FALSE)
{
    if ($rec_option == "none") {
        chmod($source, $mode);
    } else {
        if ($is_rec === FALSE) {
            chmod($source, $mode);
        }

        $files = scandir($source);

        foreach ($files as $file) {
            if ($file != "." && $file != "..") {
                if (is_dir($source . DIRECTORY_SEPARATOR . $file)) {
                    if ($rec_option == "folders" || $rec_option == "both") {
                        chmod($source . DIRECTORY_SEPARATOR . $file, $mode);
                    }
                    rchmod($source . DIRECTORY_SEPARATOR . $file, $mode, $rec_option, TRUE);
                } else {
                    if ($rec_option == "files" || $rec_option == "both") {
                        chmod($source . DIRECTORY_SEPARATOR . $file, $mode);
                    }
                }
            }
        }
    }
}

function chmod_logic_helper($perm, $val)
{
    $valid = array(
        1 => array(1, 3, 5, 7),
        2 => array(2, 3, 6, 7),
        4 => array(4, 5, 6, 7)
    );

    if (in_array($perm, $valid[$val])) {
        return TRUE;
    } else {
        return FALSE;
    }
}

function debugger($input, $trace = FALSE, $halt = FALSE)
{
    ob_start();

    echo "<br>----- DEBUG DUMP -----";
    echo "<pre>";
    var_dump($input);
    echo "</pre>";

    if ($trace) {
        if (is_php('5.3.6')) {
            $debug = debug_backtrace(DEBUG_BACKTRACE_IGNORE_ARGS);
        } else {
            $debug = debug_backtrace(FALSE);
        }

        echo "<br>-----STACK TRACE-----";
        echo "<pre>";
        var_dump($debug);
        echo "</pre>";
    }

    echo "</pre>";
    echo "---------------------------<br>";

    $ret = ob_get_contents();
    ob_end_clean();

    echo $ret;

    if ($halt == TRUE) {
        exit();
    }
}

function is_php($version = '5.0.0')
{
    static $phpVer;
    $version = (string)$version;

    if (!isset($phpVer[$version])) {
        $phpVer[$version] = (version_compare(PHP_VERSION, $version) < 0) ? FALSE : TRUE;
    }

    return $phpVer[$version];
}

?>
