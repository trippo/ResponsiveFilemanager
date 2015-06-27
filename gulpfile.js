var elixir = require('laravel-elixir');
elixir.config.sourcemaps = false;
elixir(function(mix) {
  mix.less(
    [
      'style.less',
      "../../../bower_components/bootstrap/less/bootstrap.less",
      //"../../../bower_components/bootstrap/less/responsive.less",
      "../../../bower_components/bootstrap-lightbox/less/bootstrap-lightbox.less"
    ],
    'resources/tmp/css');

  mix.styles(
    [
      "bootstrap.css",
      "responsive.css",
      "bootstrap-lightbox.css",
      "../../../bower_components/bootstrap-modal/css/bootstrap-modal.css",
      "../../../bower_components/dropzone/dist/dropzone.css",
      "../../../bower_components/jQuery-contextMenu/src/jquery.contextMenu.css",
      "style.css"
    ],
    'filemanager/css/style.css',
    'resources/tmp/css'
  );

  mix.scripts(
    [
      "jquery/jquery.js",
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
      "jquery_lazyload/jquery.lazyload.js",
      "jquery-scrollstop/jquery.scrollstop.js",
      "bootbox.js/bootbox.js",
      "dropzone/dist/dropzone.js",
      "jquery-touchswipe/jquery.touchSwipe.js",
      "bootstrap-modal/js/bootstrap-modalmanager.js",
      "bootstrap-modal/js/bootstrap-modal.js",
      "zeroclipboard/dist/ZeroClipboard.js",
      "jquery-ui/ui/jquery.ui.core.js",
      "jquery-ui/ui/jquery.ui.position.js",
      "jquery-ui/ui/jquery.ui.widget.js",
      "jquery-ui/ui/jquery.ui.mouse.js",
      "jquery-ui/ui/jquery.ui.draggable.js",
      "jquery-ui/ui/jquery.ui.droppable.js",
      "jqueryui-touch-punch/jquery.ui.touch-punch.js",
    ],
    'filemanager/js/plugins.js',
    'bower_components'
  );

  mix.scripts(
    ['include.js'], 
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