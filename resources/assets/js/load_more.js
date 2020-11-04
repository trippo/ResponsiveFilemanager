(function ($, undefined) {
   "use strict";

   var lazyLoad = null;
   var loadMoreAvail = true;
   var loadMoreInProgress = false;

   /**
    * Initializes the "Load more" plug-in.
    */
   function init() {
      lazyLoad = new LazyLoad();

      var $container = $('#load-more-container');
      if ($container.length) {
         // If auto-loading is enabled
         if ($container.data('auto') === 1) {
            // Handle window scroll event
            $(window).on('scroll', throttle(function () {
               onWindowScroll();
            }, 250));
         }

         // Handle click on "Load more" button
         $('#btn-load-more').on('click', function () {
            loadMore();
         });
      }
   }

   /**
    * Handles window scroll event.
    */
   function onWindowScroll() {
      // If more data is available
      if (loadMoreAvail) {
         var $grid = $('#main-item-container');
         var gridItemHeight = $grid.children('li:first-child').outerHeight();

         var offset = 0;

         // If layout is box view
         if ($grid.hasClass('list-view0')) {
            offset = 2 * gridItemHeight;

         // Otherwise, if layout is list or column list view
         } else {
            offset = 6 * gridItemHeight;
         }

         // When user scrolls to the bottom of the page
         if ($(window).scrollTop() >= $(document).height() - $(window).height() - offset) {
            // Load more files
            loadMore();
         }
      }
   }


   /**
    * Loads more files via Ajax request.
    */
   function loadMore() {

      // If Ajax request is in progress
      if (loadMoreInProgress) {
         return;
      }

      // Indicate that Ajax request is in progress
      loadMoreInProgress = true;

      var $container = $('#load-more-container');
      var $grid = $('#main-item-container');

      // Get next starting file number
      var start = $container.data('start') ? $container.data('start') : 0;

      // Show loading indicator
      $('#load-more-indicator').show();

      $.ajax({
            url: window.location + '&load_more_start=' + start
         })
         .done(function (html) {
            var $items = $(html).find('#main-item-container > li');

            if ($items.length) {
               $grid.append($items).fadeIn();

               // If layout is list view
               if ($grid.hasClass('list-view1')) {
                  // Apply list view layout to newly added items
                  $('#view1').trigger('click');

               // Otherwise, if layout is column list view
               } else if ($grid.hasClass('list-view2')) {
                  // Apply column list view layout to newly added items
                  $('#view2').trigger('click');

               // Otherwise, if layout is box view
               } else {
                  // Lazy load images
                  lazyLoad.update();
               }

            } else {
               // Indicate that no more data is available
               loadMoreAvail = false;

               $container.hide();
            }

            $container.data('start', start + $items.length);
         })
         .always(function () {
            // Hide loading indicator
            $('#load-more-indicator').hide();

            // Indicate that Ajax request is no longer in progress
            loadMoreInProgress = false;
         });
   }

   /**
    * Executes "func" function at most once every "wait" milliseconds
    *
    * See https://stackoverflow.com/a/27078401/3549014
    */
   function throttle(func, wait, options) {
      var context, args, result;
      var timeout = null;
      var previous = 0;
      if (!options) options = {};
      var later = function () {
         previous = options.leading === false ? 0 : Date.now();
         timeout = null;
         result = func.apply(context, args);
         if (!timeout) context = args = null;
      };
      return function () {
         var now = Date.now();
         if (!previous && options.leading === false) previous = now;
         var remaining = wait - (now - previous);
         context = this;
         args = arguments;
         if (remaining <= 0 || remaining > wait) {
            if (timeout) {
               clearTimeout(timeout);
               timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
         } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
         }
         return result;
      };
   }


   $(document).ready(function () {
      init();
   });

})(jQuery);