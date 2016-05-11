<?php

$config = include 'config/config.php';

//TODO switch to array
extract($config, EXTR_OVERWRITE);

include 'include/utils.php';

if ($_SESSION['RF']["verify"] != "RESPONSIVEfilemanager")
{
	response(trans('forbiden').AddErrorLocation(), 403)->send();
	exit;
}

include 'include/mime_type_lib.php';

if (
	strpos($_POST['path'], '/') === 0
	|| strpos($_POST['path'], '../') !== false
	|| strpos($_POST['path'], './') === 0
)
{
	response(trans('wrong path'.AddErrorLocation()), 400)->send();
	exit;
}


if (strpos($_POST['name'], '/') !== false)
{
	response(trans('wrong path'.AddErrorLocation()), 400)->send();
	exit;
}

$path = $current_path . $_POST['path'];
$name = $_POST['name'];

$info = pathinfo($name);

if ( ! in_array(fix_strtolower($info['extension']), $ext))
{
	response(trans('wrong extension'.AddErrorLocation()), 400)->send();
	exit;
}

if ( ! file_exists($path . $name))
{
	response(trans('File_Not_Found'.AddErrorLocation()), 404)->send();
	exit;
}

$file_name  = $info['basename'];
$file_ext   = $info['extension'];
$file_path  = $path . $name;

// make sure the file exists
if (is_file($file_path))
{
	@ini_set('zlib.output_compression', 'Off');


	$file_size  = filesize($file_path);
	$file = @fopen($file_path,"rb");
	if ($file)
	{
		// set the headers, prevent caching
		header("Pragma: public");
		header("Expires: -1");
		header("Cache-Control: public, must-revalidate, post-check=0, pre-check=0");
		header("Content-Disposition: attachment; filename=\"$file_name\"");

		// set the mime type based on extension, add yours if needed.
		$ctype = get_file_mime_type($file_path);
        header("Content-Type: " . $ctype);

		//check if http_range is sent by browser (or download manager)
		if(isset($_SERVER['HTTP_RANGE']))
		{
			list($size_unit, $range_orig) = explode('=', $_SERVER['HTTP_RANGE'], 2);
			if ($size_unit == 'bytes')
			{
				//multiple ranges could be specified at the same time, but for simplicity only serve the first range
				//http://tools.ietf.org/id/draft-ietf-http-range-retrieval-00.txt
				list($range, $extra_ranges) = explode(',', $range_orig, 2);
			}
			else
			{
				$range = '';
				header('HTTP/1.1 416 Requested Range Not Satisfiable');
				exit;
			}
		}
		else
		{
			$range = '';
		}

		//figure out download piece from range (if set)
		list($seek_start, $seek_end) = explode('-', $range, 2);

		//set start and end based on range (if set), else set defaults
		//also check for invalid ranges.
		$seek_end   = (empty($seek_end)) ? ($file_size - 1) : min(abs(intval($seek_end)),($file_size - 1));
		$seek_start = (empty($seek_start) || $seek_end < abs(intval($seek_start))) ? 0 : max(abs(intval($seek_start)),0);

		//Only send partial content header if downloading a piece of the file (IE workaround)
		if ($seek_start > 0 || $seek_end < ($file_size - 1))
		{
			header('HTTP/1.1 206 Partial Content');
			header('Content-Range: bytes '.$seek_start.'-'.$seek_end.'/'.$file_size);
			header('Content-Length: '.($seek_end - $seek_start + 1));
		}
		else
		  header("Content-Length: $file_size");

		header('Accept-Ranges: bytes');

		set_time_limit(0);
		fseek($file, $seek_start);

		while(!feof($file)) 
		{
			print(@fread($file, 1024*8));
			ob_flush();
			flush();
			if (connection_status()!=0) 
			{
				@fclose($file);
				exit;
			}
		}

		// file save was a success
		@fclose($file);
		exit;
	}
	else 
	{
		// file couldn't be opened
		header("HTTP/1.0 500 Internal Server Error");
		exit;
	}
}
else
{
	// file does not exist
	header("HTTP/1.0 404 Not Found");
	exit;
}

exit;