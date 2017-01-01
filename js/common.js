/*!--------------------------------------------------------------------------------

 Theme Name: WebApp
 Version:    1.0.0
 Author:     trungnghia112 <trungnghia112@gmail.com>

 -----------------------------------------------------------------------------------*/

if (Modernizr.touch === true && $(window).width() <= 767) {
  //alert('Touch Screen');
} else {

}

(function ($) {
  'use strict';

  // Scroll to top
  function scrollToTop() {
    $('.x-toTop').on('click', function (e) {
      e.preventDefault();
      $('html, body').animate({
        scrollTop: 0
      }, 1000);
      return false;
    });
  }

  function getBarwidth() {
    // Create the measurement node
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'scrollbar-measure';
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    //console.warn(scrollbarWidth); // Mac:  15

    // Delete the DIV
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  function init() {
    scrollToTop();
    getBarwidth();
  }

  init();


  if ($('.x-toTop').length) {
    var scrollTrigger = 100, // px
      backToTop = function () {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > scrollTrigger) {
          $('.x-toTop').addClass('active');
        } else {
          $('.x-toTop').removeClass('active');
        }
      };
    backToTop();
    $(window).on('scroll', function () {
      backToTop();
    });
  }

})(jQuery);
