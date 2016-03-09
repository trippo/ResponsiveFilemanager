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

$img_size = (string) (filesize($path . $name)); // Get the image size as string

$mime_type = get_file_mime_type($path . $name); // Get the correct MIME type depending on the file.

response(file_get_contents($path . $name), 200, array(
	'Pragma'              => 'private',
	'Cache-control'       => 'private, must-revalidate',
	'Content-Type'        => $mime_type,
	'Content-Length'      => $img_size,
	'Content-Disposition' => 'attachment; filename="' . ($name) . '"'
))->send();

exit;
?>