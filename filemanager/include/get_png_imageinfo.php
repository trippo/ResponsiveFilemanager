<?php
/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 *
 * This code was originally taken from:
 * https://github.com/ktomk/Miscellaneous/blob/master/get_png_imageinfo/get_png_imageinfo.php
 * It has been modified to fix bugs and improve code formatting
 *
 * Get image-information from PNG file
 *
 * php's getimagesize does not support additional image information
 * from PNG files like channels or bits.
 *
 * get_png_imageinfo() can be used to obtain this information
 * from PNG files.
 *
 * @author Tom Klingenberg <lastflood.net>
 * @license Apache 2.0
 * @link https://github.com/ktomk/Miscellaneous/blob/master/get_png_imageinfo/get_png_imageinfo.php
 * @link http://www.libpng.org/pub/png/spec/iso/index-object.html#11IHDR
 *
 * @param string $file filename
 * @return array|bool image information, FALSE on error
 */
function get_png_imageinfo($file) {
    if (! is_file($file)) {
        return false;
    }

    $info = unpack(
        'a8sig/Nchunksize/A4chunktype/Nwidth/Nheight/Cbit-depth/Ccolor/Ccompression/Cfilter/Cinterface',
        file_get_contents($file, 0, null, 0, 29)
    );
    
    if (empty($info)) {
        return false;
    }
    if ("\x89\x50\x4E\x47\x0D\x0A\x1A\x0A" != array_shift($info)) {
        return false; // no PNG signature
    }
    if (13 != array_shift($info)) {
        return false; // wrong length for IHDR chunk
    }
    if ('IHDR'!==array_shift($info)) {
        return false; // a non-IHDR chunk singals invalid data
    }

    $color = $info['color'];
    $type = [
        0 => 'Greyscale',
        2 => 'Truecolour',
        3 => 'Indexed-colour',
        4 => 'Greyscale with alpha',
        6 => 'Truecolour with alpha'
    ];

    if (empty($type[$color])) {
        return false; // invalid color value
    }

    $info['color-type'] = $type[$color];
    $samples = ((($color % 4) % 3) ? 3 : 1) + ($color > 3 ? 1 : 0);
    $info['channels'] = $samples;
    $info['bits'] = $info['bit-depth'];

    return $info;
}
