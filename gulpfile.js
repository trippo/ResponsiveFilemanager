var elixir = require('laravel-elixir');
elixir.config.sourcemaps = false;
elixir(function(mix) {
  mix.less(
    [
      'style.less',
      //"../../../bower_components/bootstrap/less/bootstrap.less",
      //"../../../bower_components/bootstrap/less/responsive.less",
      //"../../../bower_components/bootstrap-lightbox/less/bootstrap-lightbox.less"
    ],
    'resources/tmp/css/style.css');

  mix.styles(
    [
      "bootstrap.css",
      "responsive.css",
      "bootstrap-lightbox.css",
      "../../../bower_components/bootstrap-modal/css/bootstrap-modal.css",
      "../../../bower_components/jQuery-contextMenu/src/jquery.contextMenu.css",
      "style.css"
    ],
    'filemanager/css/style.css',
    'resources/tmp/css'
  );
  mix.styles(
    ["rtl-style.less"],
    'filemanager/css/rtl-style.css',
    'resources/assets/less'
  );

  mix.scripts(
    [
      "bootstrap/js/bootstrap-transition.js",
      "bootstrap/js/bootstrap-affix.js",
      "bootstrap/js/bootstrap-dropdown.js",
      "bootstrap/js/bootstrap-alert.js",
      "bootstrap/js/bootstrap-button.js",
      "bootstrap/js/bootstrap-collapse.js",
      "bootstrap/js/bootstrap-dropdown.js",
      "bootstrap/js/bootstrap-modal.js",
      "bootstrap/js/bootstrap-tooltip.js",
      "bootstrap/js/bootstrap-popover.js",
      "bootstrap/js/bootstrap-scrollspy.js",
      "bootstrap/js/bootstrap-tab.js",
      "bootstrap/js/bootstrap-typeahead.js",
      "bootstrap-lightbox/js/bootstrap-lightbox.js",
      "jQuery-contextMenu/src/jquery.contextMenu.js",
      "vanilla-lazyload/dist/lazyload.js",
      "jquery-scrollstop/jquery.scrollstop.js",
      "bootbox.js/bootbox.js",
      "jquery-touchswipe/jquery.touchSwipe.js",
      "bootstrap-modal/js/bootstrap-modalmanager.js",
      "bootstrap-modal/js/bootstrap-modal.js",
      "clipboard/dist/clipboard.js",
      "jqueryui-touch-punch/jquery.ui.touch-punch.js",
    ],
    'filemanager/js/plugins.js',
    'bower_components'
  );

  mix.scripts(
    ['include.js'], 
    'filemanager/js/include.js');

  mix.scripts(
    ['include.commercial.js'], 
    'filemanager/js/include.commercial.js');

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
});