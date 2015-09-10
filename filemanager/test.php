<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* Attempt to open */
ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);
$im = @imagecreatefromjpeg("../source/2.jpg");
//$im = @imagecreatefromjpeg("../source/imagen_1_facultad.jpg");
//$a=0/0;
/* See if it failed */
if (!$im) {
    /* Create a black image */
    $im = imagecreatetruecolor(150, 30);
    $bgc = imagecolorallocate($im, 255, 255, 255);
    $tc = imagecolorallocate($im, 0, 0, 0);

    imagefilledrectangle($im, 0, 0, 150, 30, $bgc);

    /* Output an error message */
    imagestring($im, 1, 5, 5, 'Error loading ' , $tc);
} else {
    
}
header('Content-Type: image/jpeg');

imagejpeg($im);
imagedestroy($im);
