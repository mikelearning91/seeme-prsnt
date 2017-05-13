(function($) {
    "use strict"; // Start of use strict

    // ============================= jTinder initialization ============================= //
    $("#tinderslide").jTinder({
        // dislike callback
        onDislike: function(item) {
            // set the status text
            $('#status').html('Choose Wisely!');
        },
        // like callback
        onLike: function(item) {
            // set the status text
            $('#status').html('Good luck! Hope you two match!');
            // console.log(item);

            var gotLikedId = item["0"].children[1].id;
            var userWhoLikedId = $("#" + gotLikedId).parents().eq(2).attr("class");
            console.log("just got liked yo", gotLikedId);
            console.log("I just liked you yo", userWhoLikedId);
            // ajax to post to API to send to database table MATCHES
            $.ajax({
                type: "POST",
                url: "/api/matches",
                // contentType: "application/json; charset=utf-8",
                // timeout: 4000,
                data: {
                    glid: gotLikedId,
                    wlid: userWhoLikedId
                },
                success: function(data) {
                    //show content
                    console.log('Success!');
                },
                error: function(jqXHR, textStatus, err) {
                    //show error message
                    // console.log('text status ' + textStatus + ', err ' + err);
                }
            });
        },
        animationRevertSpeed: 200,
        animationSpeed: 400,
        threshold: 1,
        likeSelector: '.like',
        dislikeSelector: '.dislike'
    });

    /**
     * Set button action to trigger jTinder like & dislike.
     */
    $('.actions .like, .actions .dislike').click(function(e) {
        e.preventDefault();
        $("#tinderslide").jTinder($(this).attr('class'));
    });

    var nextLocation;
    $('.navo').on('click', function(e) {
        e.preventDefault();
        nextLocation = this.href;
        $('#body-master').fadeOut("fast", function() {
            followLink(function() {
                $("#body-master").fadeIn('fast');
            });
        });

    });

    function followLink() {
        window.location = nextLocation;
    }

    // jQuery for page scrolling feature - with jQuery Easing plugin
    $(document).on('click', 'a.page-scroll', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - 50)
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 100
    });

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function() {
        $('.navbar-toggle:visible').click();
    });

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 500
        }
    });

    // custom hamburger animation
    var hamburger = $('#menu-btn');

    hamburger.on('click', function(e) {
        e.preventDefault();
        if (hamburger.hasClass('open')) {
            hamburger.removeClass('open');
            hamburger.addClass('close');
        } else {
            hamburger.removeClass('close');
            hamburger.addClass('open');
        }
    });


    // play and pause video on video click
    $('.video').click(function() { this.paused ? this.play() : this.pause(); });





    // $('.pane1').hover(function() {
    //     this.find('video').get(0).play();
    // });

    // $(".video").on("tap click", function(event) {
    //     event.preventDefault();
    //     this.get(0).play();
    // });

})(jQuery); // End of use strict