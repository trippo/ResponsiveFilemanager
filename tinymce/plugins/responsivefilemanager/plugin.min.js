/**
 * plugin.js
 *
 * Copyright, Alberto Peripolli
 * Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *
 * Contributing: https://github.com/trippo/ResponsiveFilemanager
 */
tinymce.PluginManager.add("responsivefilemanager",function(e){function t(){e.focus(true);var t="RESPONSIVE FileManager";if(typeof e.settings.filemanager_title!=="undefined"&&e.settings.filemanager_title){t=e.settings.filemanager_title}var n="";var r="false";if(typeof e.settings.filemanager_sort_by!=="undefined"&&e.settings.filemanager_sort_by)n=e.settings.filemanager_sort_by;if(typeof e.settings.filemanager_descending!=="undefined"&&e.settings.filemanager_descending)r=e.settings.filemanager_descending;win=e.windowManager.open({title:t,file:e.settings.external_filemanager_path+"dialog.php?type=4&descending="+r+"&sort_by="+n+"&lang="+e.settings.language,width:860,height:570,inline:1,resizable:true,maximizable:true})}e.addButton("responsivefilemanager",{icon:"browse",tooltip:"Insert file",shortcut:"Ctrl+E",onclick:t});e.addShortcut("Ctrl+E","",t);e.addMenuItem("responsivefilemanager",{icon:"browse",text:"Insert file",shortcut:"Ctrl+E",onclick:t,context:"insert"})})