var elixir = require('laravel-elixir');
elixir.config.sourcemaps = false;
elixir(function(mix) {
    mix.less(
            [                             
                'style.less'
            ],
            'resources/tmp/css/app2.css');

    mix.styles(
            [                
                "../../../bower_components/dropzone/dist/dropzone.css",
                "../../../bower_components/jQuery-contextMenu/src/jquery.contextMenu.css",                
                "../../assets/css/metro.css",
                "app2.css"
            ],
            'filemanager/css/style.css',
            'resources/tmp/css'
            );

    mix.scripts(
            [
                "jquery/jquery.js",                              
                "jQuery-contextMenu/src/jquery.contextMenu.js",
                "jquery_lazyload/jquery.lazyload.js",                
                "dropzone/dist/dropzone.js",
                "jquery-touchswipe/jquery.touchSwipe.js",
                "zeroclipboard/dist/ZeroClipboard.js",
                "jquery-ui/ui/jquery.ui.core.js",
                "jquery-ui/ui/jquery.ui.position.js",
                "jquery-ui/ui/jquery.ui.widget.js",
                "jquery-ui/ui/jquery.ui.mouse.js",
                "jquery-ui/ui/jquery.ui.draggable.js",
                "jquery-ui/ui/jquery.ui.droppable.js",
                "jqueryui-touch-punch/jquery.ui.touch-punch.js",
                "../resources/assets/js/metro.js"
            ],
            'filemanager/js/plugins.js',
            'bower_components'
            );

    mix.scripts(
            ['include.js', 'custom.js'],
            'filemanager/js/include.js');

    mix.scripts(
            ['plugin.js'],
            'filemanager/plugin.min.js');

    mix.scripts(
            ['plugin_responsivefilemanager_plugin.js'],
            'tinymce/plugins/responsivefilemanager/plugin.min.js');

    mix.scripts(
            ['modernizr.custom.js'],
            'filemanager/js/modernizr.custom.js'
            );

    mix.copy('bower_components/jPlayer', 'filemanager/js/jPlayer/');
    mix.copy('bower_components/viewerjs/ViewerJS', 'filemanager/js/ViewerJS/');
    mix.copy('bower_components/zeroclipboard/dist/ZeroClipboard.swf', 'filemanager/js/ZeroClipboard.swf');
});