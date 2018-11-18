$(window).load(function() {
    'use strict';


    $(".scrolltop").jCarouselLite({
        vertical: true,
        hoverPause: true,
        easing: "easeOutBounce",
        visible: 1,
        auto: 6500,
        speed: 1000,
        beforeStart: function(element) {
            const $element = $(element).find('h3').removeClass('hidden').fadeOut().fadeIn('slow');
        },
        afterEnd: function(element) {

        }
    });
});