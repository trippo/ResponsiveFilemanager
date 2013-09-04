/**
 * plugin.js
 *
 * Copyright, Alberto Peripolli
 * Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *
 * Contributing: https://github.com/trippo/ResponsiveFilemanager
 */

tinymce.PluginManager.add('responsivefilemanager', function(editor) {
    
    function openmanager() {
	editor.focus(true);
        var title="RESPONSIVE FileManager";
        if (typeof tinymce.settings.filemanager_title !== "undefined" && tinymce.settings.filemanager_title) {
            title=tinymce.settings.filemanager_title;
        }
	var sort_by="";
	var descending="false";
	if (typeof tinymce.settings.filemanager_sort_by !== "undefined" && tinymce.settings.filemanager_sort_by) 
	    sort_by=tinymce.settings.filemanager_sort_by;
	if (typeof tinymce.settings.filemanager_descending !== "undefined" && tinymce.settings.filemanager_descending) 
	    descending=tinymce.settings.filemanager_descending;
        win = editor.windowManager.open({
            title: title,
            file: tinymce.settings.external_filemanager_path+'dialog.php?type=4&descending='+descending+'&sort_by='+sort_by+'&lang='+tinymce.settings.language,
            width: 880,
            height: 570,
            inline: 1,
	    resizable: true,
	    maximizable: true
        });
    }
    
	editor.addButton('responsivefilemanager', {
		icon: 'browse',
		tooltip: 'Insert file',
		shortcut: 'Ctrl+E',
                onclick:openmanager
	});
        
	editor.addShortcut('Ctrl+E', '', openmanager);

	editor.addMenuItem('responsivefilemanager', {
		icon: 'browse',
		text: 'Insert file',
		shortcut: 'Ctrl+E',
		onclick: openmanager,
		context: 'insert'
	});
	
});