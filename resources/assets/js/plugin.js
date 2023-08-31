/**
 * plugin.js
 *
 * Copyright, Alberto Peripolli
 * Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *
 * Contributing: https://github.com/trippo/ResponsiveFilemanager
 */

tinymce.PluginManager.add('filemanager', function(editor) {

	const settings = {
		external_filemanager_path: '/filemanager/',
		filemanager_title: 'RESPONSIVE FileManager',
		filemanager_access_key: 'key',
		filemanager_sort_by: 'name',
		filemanager_descending: false,
		filemanager_subfolder: '',
		filemanager_crossdomain: false,
		language: 'en'		
	}

	// From TinyMCE 6.0 the settings API has changed
	if (tinymce.majorVersion > 5) {
		// register settings
		editor.options.register('external_filemanager_path', {
			processor: 'string',
			default: '/filemanager/'
		  })
		  editor.options.register('filemanager_title', {
			  processor: 'string',
			  default: 'RESPONSIVE FileManager'
		  })
		  editor.options.register('filemanager_access_key', {
			  processor: 'string',
			  default: 'key'
		  })
		  editor.options.register('filemanager_sort_by', {
			  processor: 'string',
			  default: 'name'
		  })
		  editor.options.register('filemanager_descending', {
			  processor: 'boolean',
			  default: false
		  })
		  editor.options.register('filemanager_subfolder', {
			  processor: 'string',
			  default: ''
		  })
		  editor.options.register('filemanager_crossdomain', {
			  processor: 'boolean',
			  default: false
		  })
	  
		  // register callback and types
		  editor.options.set('file_picker_types', 'file image media')
		  editor.options.set('file_picker_callback', filemanager)
	} else {
		editor.settings.file_picker_types = 'file image media';
		editor.settings.file_picker_callback = filemanager;
	}

	resolveSettings()

	function resolveSettings () {
		if (tinymce.majorVersion > 5) {
			settings.external_filemanager_path = editor.options.get('external_filemanager_path')
			settings.filemanager_title = editor.options.get('filemanager_title')
			settings.filemanager_access_key = editor.options.get('filemanager_access_key')
			settings.filemanager_sort_by = editor.options.get('filemanager_sort_by')
			settings.filemanager_descending = editor.options.get('filemanager_descending')
			settings.filemanager_subfolder = editor.options.get('filemanager_subfolder')
			settings.filemanager_crossdomain = editor.options.get('filemanager_crossdomain')
			settings.language = editor.options.get('language')
		} else {
			settings.external_filemanager_path = editor.settings.external_filemanager_path
			settings.filemanager_title = editor.settings.filemanager_title
			settings.filemanager_access_key = editor.settings.filemanager_access_key
			settings.filemanager_sort_by = editor.settings.filemanager_sort_by
			settings.filemanager_descending = editor.settings.filemanager_descending
			settings.filemanager_subfolder = editor.settings.filemanager_subfolder
			settings.filemanager_crossdomain = editor.settings.filemanager_crossdomain
			settings.language = editor.settings.language
		}
	}

	function filemanager_onMessage(event){
		if(settings.external_filemanager_path.toLowerCase().indexOf(event.origin.toLowerCase()) === 0){
			if(event.data.sender === 'responsivefilemanager'){
				tinymce.activeEditor.windowManager.getParams().setUrl(event.data.url);
				tinymce.activeEditor.windowManager.close();

				// Remove event listener for a message from ResponsiveFilemanager
				if(window.removeEventListener){
					window.removeEventListener('message', filemanager_onMessage, false);
				} else {
					window.detachEvent('onmessage', filemanager_onMessage);
				}
			}
		}
	}

	function filemanager(callback, value, meta) {
		resolveSettings()
		var width = window.innerWidth-30;
		var height = window.innerHeight-60;
		if(width > 1800) width=1800;
		if(height > 1200) height=1200;
		if(width>600){
			var width_reduce = (width - 20) % 138;
			width = width - width_reduce + 10;
		}

		// DEFAULT AS FILE
		var urltype=2;
		if (meta.filetype === 'image' || meta.mediaType === 'image') { urltype=1; }
		if (meta.filetype === 'media' || meta.mediaType === 'media') { urltype=3; }

		var title="RESPONSIVE FileManager";
		if (typeof settings.filemanager_title !== "undefined" && settings.filemanager_title) {
			title=settings.filemanager_title;
		}
		var akey="key";
		if (typeof settings.filemanager_access_key !== "undefined" && settings.filemanager_access_key) {
			akey=settings.filemanager_access_key;
		}
		var sort_by="";
		if (typeof settings.filemanager_sort_by !== "undefined" && settings.filemanager_sort_by) {
			sort_by="&sort_by="+settings.filemanager_sort_by;
		}
		var descending=0;
		if (typeof settings.filemanager_descending !== "undefined" && settings.filemanager_descending) {
			descending=settings.filemanager_descending;
		}
		var fldr="";
		if (typeof settings.filemanager_subfolder !== "undefined" && settings.filemanager_subfolder) {
			fldr="&fldr="+settings.filemanager_subfolder;
		}
		var crossdomain="";
		if (typeof settings.filemanager_crossdomain !== "undefined" && settings.filemanager_crossdomain) {
			crossdomain="&crossdomain=1";

			// Add handler for a message from ResponsiveFilemanager
			if(window.addEventListener){
				window.addEventListener('message', filemanager_onMessage, false);
			} else {
				window.attachEvent('onmessage', filemanager_onMessage);
			}
		}

		window.addEventListener('message', function receiveMessage(event) {
			//window.removeEventListener('message', receiveMessage, false);
			if (event.data.sender === 'responsivefilemanager') {
				callback(event.data.url);
			}
		}, false);

		var dialogUrl = settings.external_filemanager_path+'dialog.php?type='+urltype+'&descending='+descending+sort_by+fldr+crossdomain+'&lang='+settings.language+'&akey='+akey;

		if (tinymce.majorVersion > 4) {
			tinymce.activeEditor.windowManager.openUrl({
				title: title,
				url: dialogUrl,
				width: width,
				height: height,
				resizable: true,
				maximizable: true,
				inline: 1,
			});
		} else {
			tinymce.activeEditor.windowManager.open({
				title: title,
				file: dialogUrl,
				width: width,
				height: height,
				resizable: true,
				maximizable: true,
				inline: 1,
			});
		}
	}

	return false;
});
