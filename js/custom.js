(function($) {
    'use strict';

    $('.ig-container').addClass('animated').removeClass('hidden').addClass('fadeIn');

    /*
    Smooth scroll
    =========================== */
    $('ul.navbar-nav li a, .btn-scroll').smoothScroll();

    /*
    Bounce animated
    =========================== */
    $(".e_bounce").hover(
        function() {
            $(this).addClass("animated bounce");
        },
        function() {
            $(this).removeClass("animated bounce");
        }
    );

    /*
    tooltip
    =========================== */
    $('.tooltips').tooltip({
        selector: "a[data-toggle^=tooltip]"
    })

    /* Client logo hover
    =========================== */
    $(".logo-hover").css({ 'opacity': '0', 'filter': 'alpha(opacity=0)' });
    $('.client-link').hover(function() {
        $(this).find('.logo-hover').stop().fadeTo(900, 1);
        $(this).find('.client-logo').stop().fadeTo(900, 0);
    }, function() {
        $(this).find('.logo-hover').stop().fadeTo(900, 0);
        $(this).find('.client-logo').stop().fadeTo(900, 1);
    });

    /*
    Hover image
    =========================== */
    $(".image-caption").css({ 'opacity': '0', 'filter': 'alpha(opacity=0)' });
    $('.image-wrapper').hover(
        function() {
            $(this).find('.image-caption').stop().fadeTo(800, 1);
            $(".zoom", this).stop().animate({ top: '28%' }, { queue: false, duration: 300 });
            $(".image-title", this).stop().animate({ bottom: '20%' }, { queue: false, duration: 500 });
        },
        function() {
            $(this).find('.image-caption').stop().fadeTo(800, 0);
            $(".zoom", this).stop().animate({ top: '-28%' }, { queue: false, duration: 300 });
            $(".image-title", this).stop().animate({ bottom: '-20%' }, { queue: false, duration: 500 });
        }
    )

    /*
    Team
    =========================== */
    $(".team-profile").css({ 'opacity': '0', 'filter': 'alpha(opacity=0)' });
    $('.team-image-wrapper').hover(
        function() {
            $(this).find('.team-profile').stop().fadeTo(800, 1);
            $(this).find('.team-image').stop().fadeTo(800, 0.4);
        },
        function() {
            $(this).find('.team-profile').stop().fadeTo(800, 0);
            $(this).find('.team-image').stop().fadeTo(800, 1);
        }
    )

    /*
    cbpScroller
    =========================== */
    new cbpScroller(document.getElementById('cbp-so-scroller'));

})(jQuery);