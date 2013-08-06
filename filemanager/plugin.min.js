tinymce.PluginManager.add('filemanager', function(editor) {
    function openmanager() {
        var win, data, dom = editor.dom,
            imgElm = editor.selection.getNode();
        var width, height, imageListCtrl;
        win = editor.windowManager.open({
            title: 'File Manager',
            file: tinyMCE.baseURL + '/plugins/filemanager/dialog.php?editor=' + editor.id + '&lang=' + tinymce.settings.language + '&subfolder=' + tinymce.settings.subfolder,
            filetype: 'all',
            classes: 'filemanager',
            width: 900,
            height: 600,
            inline: 1
        })
    }
    editor.addButton('filemanager', {
        icon: 'browse',
        tooltip: 'Insert file',
        onclick: openmanager,
        stateSelector: 'img:not([data-mce-object])'
    });
    editor.addMenuItem('filemanager', {
        icon: 'browse',
        text: 'Insert file',
        onclick: openmanager,
        context: 'insert',
        prependToContext: true
    })
});