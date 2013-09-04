/**
 * plugin.js
 *
 * Copyright, Alberto Peripolli
 * Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *
 * Contributing: https://github.com/trippo/ResponsiveFilemanager
 */

tinymce.PluginManager.add('filemanager', function(editor) {

	tinymce.activeEditor.settings.file_browser_callback = filemanager;
	
	function filemanager (id, value, type, win) {
		// DEFAULT AS FILE
		urltype=2;
		if (type=='image') { urltype=1; }
		if (type=='media') { urltype=3; }
		var title="RESPONSIVE FileManager";
		if (typeof tinymce.settings.filemanager_title !== "undefined" && tinymce.settings.filemanager_title) 
			title=tinymce.settings.filemanager_title;
		var sort_by="";
		var descending="false";
		if (typeof tinymce.settings.filemanager_sort_by !== "undefined" && tinymce.settings.filemanager_sort_by) 
					sort_by=tinymce.settings.filemanager_sort_by;
		if (typeof tinymce.settings.filemanager_descending !== "undefined" && tinymce.settings.filemanager_descending) 
					descending=tinymce.settings.filemanager_descending;

		// SETTINGS TO REMOVE DEPENDANCY OF CONFIG.PHP
		var base_url = 'http://rfm';
		if (typeof tinymce.settings.rfmConfig_base_url !== "undefined" && tinymce.settings.rfmConfig_base_url) {
			base_url=tinymce.settings.rfmConfig_base_url;
		}
		var upload_dir = '/source/';
		if (typeof tinymce.settings.rfmConfig_upload_dir !== "undefined" && tinymce.settings.rfmConfig_upload_dir) {
			upload_dir=tinymce.settings.rfmConfig_upload_dir;
		}
		var current_path = '../source/';
		if (typeof tinymce.settings.rfmConfig_current_path !== "undefined" && tinymce.settings.rfmConfig_current_path) {
			current_path=tinymce.settings.rfmConfig_current_path;
		}
		var thumbs_base_path = '../thumbs/';
		if (typeof tinymce.settings.rfmConfig_thumbs_base_path !== "undefined" && tinymce.settings.rfmConfig_thumbs_base_path) {
			thumbs_base_path=tinymce.settings.rfmConfig_thumbs_base_path;
		}
					
		tinymce.activeEditor.windowManager.open({
			title: title,
			file: tinymce.settings.external_filemanager_path+'dialog.php?type='+urltype+'&descending='+descending+'&sort_by='+sort_by+'&lang='+tinymce.settings.language+'&base_url='+base_url+'&upload_dir='+upload_dir+'&current_path='+current_path+'&thumbs_base_path='+thumbs_base_path,
			width: 870,	
			height: 570,
			resizable: true,
			maximizable: true,
			inline: 1
			}, {
			setUrl: function (url) {
				var fieldElm = win.document.getElementById(id);
				fieldElm.value = editor.convertURL(url);
				if ("fireEvent" in fieldElm) {
					fieldElm.fireEvent("onchange")
				} else {
					var evt = document.createEvent("HTMLEvents");
					evt.initEvent("change", false, true);
					fieldElm.dispatchEvent(evt);
				}
			}
		});
	};
	return false;
});
