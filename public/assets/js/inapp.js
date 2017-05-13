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


    // Options for Message
    //----------------------------------------------
    var options = {
        'btn-loading': '<i class="fa fa-spinner fa-pulse"></i>',
        'btn-success': '<i class="fa fa-check"></i>',
        'btn-error': '<i class="fa fa-remove"></i>',
        'msg-success': 'All Good! Redirecting...',
        'msg-error': 'Wrong login credentials!',
        'useAJAX': true,
    };

    // Login Form
    //----------------------------------------------
    // Validation
    $("#login-form").validate({
        rules: {
            lg_username: "required",
            lg_password: "required",
        },
        errorClass: "form-invalid"
    });

    // Register Form
    //----------------------------------------------
    // Validation
    $("#register-form").validate({
        rules: {
            reg_username: "required",
            reg_password: {
                required: true,
                minlength: 5
            },
            reg_password_confirm: {
                required: true,
                minlength: 5,
                equalTo: "#register-form [name=reg_password]"
            },
            reg_email: {
                required: true,
                email: true
            },
            reg_agree: "required",
        },
        errorClass: "form-invalid",
        errorPlacement: function(label, element) {
            if (element.attr("type") === "checkbox" || element.attr("type") === "radio") {
                element.parent().append(label); // this would append the label after all your checkboxes/labels (so the error-label will be the last element in <div class="controls"> )
            } else {
                label.insertAfter(element); // standard behaviour
            }
        }
    });


    // Loading
    //----------------------------------------------
    function remove_loading($form) {
        $form.find('[type=submit]').removeClass('error success');
        $form.find('.login-form-main-message').removeClass('show error success').html('');
    }

    function form_loading($form) {
        $form.find('[type=submit]').addClass('clicked').html(options['btn-loading']);
    }

    function form_success($form) {
        $form.find('[type=submit]').addClass('success').html(options['btn-success']);
        $form.find('.login-form-main-message').addClass('show success').html(options['msg-success']);
    }

    function form_failed($form) {
        $form.find('[type=submit]').addClass('error').html(options['btn-error']);
        $form.find('.login-form-main-message').addClass('show error').html(options['msg-error']);
    }

    var slider = document.getElementById('slider');

    noUiSlider.create(slider, {
        start: [18, 60],
        connect: true,
        tooltips: true,
        format: wNumb({
            decimals: 0
        }),
        range: {
            'min': 18,
            'max': 60
        }
    });
    var ageMin = document.getElementById('age-min');
    var ageMax = document.getElementById('age-max');

    slider.noUiSlider.on('update', function(values, handle) {

        var value = values[handle];

        if (handle) {
            ageMax.value = value;
        } else {
            ageMin.value = value;
        }
    });
    var actualMin = ageMin.getAttribute("value");
    slider.noUiSlider.set([actualMin, null]);
    var actualMax = ageMax.getAttribute("value");
    slider.noUiSlider.set([null, actualMax]);

    ageMin.addEventListener('change', function() {
        slider.noUiSlider.set([this.value, null]);
    });
    ageMax.addEventListener('change', function() {
        slider.noUiSlider.set([null, this.value]);
    });

    var thisVideo = $(".pane1 > div > video");
    $("#tinderslide").click(function() { thisVideo.paused ? thisVideo.play() : thisVideo.pause(); });



    $('.video').click(function() { this.paused ? this.play() : this.pause(); });
    $('.video-pro').click(function() { this.paused ? this.play() : this.pause(); });

})(jQuery); // End of use strict