/**
 * plugin.js
 *
 * Copyright, Alberto Peripolli
 * Released under Creative Commons Attribution-NonCommercial 3.0 Unported License.
 *
 * Contributing: https://github.com/trippo/ResponsiveFilemanager
 */

tinymce.PluginManager.add('responsivefilemanager', function(editor) {

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

	function responsivefilemanager_onMessage(event){
		if(settings.external_filemanager_path.toLowerCase().indexOf(event.origin.toLowerCase()) === 0){
			if(event.data.sender === 'responsivefilemanager'){
				tinymce.activeEditor.insertContent(event.data.html);
				tinymce.activeEditor.windowManager.close();

				// Remove event listener for a message from ResponsiveFilemanager
				if(window.removeEventListener){
					window.removeEventListener('message', responsivefilemanager_onMessage, false);
				} else {
					window.detachEvent('onmessage', responsivefilemanager_onMessage);
				}
			}
		}
	}
    
	function openmanager() {
		resolveSettings()
		var width = window.innerWidth-20;
		var height = window.innerHeight-40;
		if(width > 1800) width=1800;
		if(height > 1200) height=1200;
		if(width>600){
			var width_reduce = (width - 20) % 138;
			width = width - width_reduce + 10;
		}

		editor.focus(true);
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
		var descending="false";
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
				window.addEventListener('message', responsivefilemanager_onMessage, false);
			} else {
				window.attachEvent('onmessage', responsivefilemanager_onMessage);
			}
		}

		const fileUrl = settings.external_filemanager_path+'dialog.php?type=4&descending='+descending+sort_by+fldr+crossdomain+'&lang='+settings.language+'&akey='+akey;

		if (tinymce.majorVersion < 5) {
			win = editor.windowManager.open({
				title: title,
				file: fileUrl,
				width: width,
				height: height,
				inline: 1,
				resizable: true,
				maximizable: true
			});
		} else {
			win = editor.windowManager.openUrl({
				title: title,
				url: fileUrl,
				width: width,
				height: height,
				inline: 1,
				resizable: true,
				maximizable: true
			});
		}
	}

	if (tinymce.majorVersion < 5) {
		editor.addButton('responsivefilemanager', {
			icon: 'browse',
			tooltip: 'Insert file',
			shortcut: 'Ctrl+E',
			onClick: openmanager
		});

		editor.addShortcut('Ctrl+E', '', openmanager);

		editor.addMenuItem('responsivefilemanager', {
			icon: 'browse',
			text: 'Insert file',
			shortcut: 'Ctrl+E',
			onClick: openmanager,
			context: 'insert'
		});
	} else {
		editor.ui.registry.addButton('responsivefilemanager', {
			icon: 'browse',
			tooltip: 'Insert file',
			shortcut: 'Ctrl+E',
			onAction: openmanager
		});

		editor.addShortcut('Ctrl+E', '', openmanager);

		editor.ui.registry.addMenuItem('responsivefilemanager', {
			icon: 'browse',
			text: 'Insert file',
			shortcut: 'Ctrl+E',
			onAction: openmanager,
			context: 'insert'
		});
	}
});
