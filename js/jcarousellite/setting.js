$(window).load(function() {
    'use strict';


    $(".scrolltop").jCarouselLite({
        vertical: true,
        easing: "easeOutBounce",
        visible: 1,
        auto: 6500,
        speed: 1000,
        beforeStart: function(anchorElement) {
            console.log(anchorElement);
            $(anchorElement).addClass('typewriter');
        },
        afterEnd: function(anchorElement) {
            $(anchorElement).removeClass('typewriter');
        }
    });
});