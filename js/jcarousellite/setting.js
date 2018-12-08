$(window).load(function() {
    'use strict';


    $(".scrolltop").jCarouselLite({
        vertical: true,
        easing: "easeOutBounce",
        visible: 1,
        auto: 6500,
        speed: 1000,
        beforeStart: function(anchorElement) {},
        afterEnd: function(anchorElement) {}
    });
});