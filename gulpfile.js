var elixir = require('laravel-elixir');
elixir.config.sourcemaps = false;
elixir(function (mix) {
    mix.less(
        [
            'style.less',
        ],
        'resources/tmp/css/style.css',
        'resources/assets/less'
    );

    mix.less(
        [
            "../../../bower_components/bootstrap/less/bootstrap.less",
            "../../../bower_components/bootstrap/less/responsive.less",
            "../../../bower_components/bootstrap-lightbox/less/bootstrap-lightbox.less"
        ],
        'resources/tmp/css/lib.css',
        'bower_components'
    );

    mix.styles(
        [
            "lib.css",
            "../../../bower_components/bootstrap-modal/css/bootstrap-modal.css",
            "../../../bower_components/jQuery-contextMenu/src/jquery.contextMenu.css",
            "style.css"
        ],
        'filemanager/css/style.css',
        'resources/tmp/css'
    );

    // mix.styles(
    //   ["rtl-style.less"],
    //   'filemanager/css/rtl-style.css',
    //   'resources/assets/less'
    // );

    mix.copy(
        [
            "bower_components/blueimp-file-upload/js/jquery.fileupload-audio.js",
            "bower_components/blueimp-file-upload/js/jquery.fileupload-image.js",
            "bower_components/blueimp-file-upload/js/jquery.fileupload-process.js",
            "bower_components/blueimp-file-upload/js/jquery.fileupload-ui.js",
            "bower_components/blueimp-file-upload/js/jquery.fileupload-validate.js",
            "bower_components/blueimp-file-upload/js/jquery.fileupload-video.js",
            "bower_components/blueimp-file-upload/js/jquery.fileupload.js",
            "bower_components/blueimp-file-upload/js/jquery.iframe-transport.js",
            "bower_components/bootbox.js/bootbox.js",
            "bower_components/bootstrap-lightbox/js/bootstrap-lightbox.js",
            "bower_components/bootstrap-modal/js/bootstrap-modal.js",
            "bower_components/bootstrap-modal/js/bootstrap-modalmanager.js",
            "bower_components/bootstrap/js/bootstrap-affix.js",
            "bower_components/bootstrap/js/bootstrap-alert.js",
            "bower_components/bootstrap/js/bootstrap-button.js",
            "bower_components/bootstrap/js/bootstrap-collapse.js",
            "bower_components/bootstrap/js/bootstrap-dropdown.js",
            "bower_components/bootstrap/js/bootstrap-dropdown.js",
            "bower_components/bootstrap/js/bootstrap-modal.js",
            "bower_components/bootstrap/js/bootstrap-popover.js",
            "bower_components/bootstrap/js/bootstrap-scrollspy.js",
            "bower_components/bootstrap/js/bootstrap-tab.js",
            "bower_components/bootstrap/js/bootstrap-tooltip.js",
            "bower_components/bootstrap/js/bootstrap-transition.js",
            "bower_components/bootstrap/js/bootstrap-typeahead.js",
            "bower_components/clipboard/dist/clipboard.js",
            "bower_components/jQuery-contextMenu/src/jquery.contextMenu.js",
            "bower_components/jquery-scrollstop/jquery.scrollstop.js",
            "bower_components/jquery-touchswipe/jquery.touchSwipe.js",
            "bower_components/jqueryui-touch-punch/jquery.ui.touch-punch.js",
            "bower_components/vanilla-lazyload/dist/lazyload.js",
        ],
        'filemanager/js/'
    );

    mix.copy(
        [
            "bower_components/blueimp-file-upload/css/jquery.fileupload.css",
            "bower_components/blueimp-file-upload/css/jquery.fileupload-ui.css",
        ],
        'filemanager/css/'
    )

    mix.scripts(
        ['include.js'],
        'filemanager/js/include.js'
    );

    mix.scripts(
        ['include.commercial.js'],
        'filemanager/js/include.commercial.js'
    );

    mix.scripts(
        ['plugin.js'],
        'filemanager/plugin.min.js'
    );

    mix.scripts(
        ['plugin_responsivefilemanager_plugin.js'],
        'tinymce/plugins/responsivefilemanager/plugin.min.js'
    );

    mix.scripts(
        ['modernizr.custom.js'],
        'filemanager/js/modernizr.custom.js'
    );
});