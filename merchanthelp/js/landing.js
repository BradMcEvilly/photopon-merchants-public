jQuery.extend( jQuery.easing,
{
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t==0) return b;
        if (t==d) return b+c;
        if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
        return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

!function ($) {

  $(function(){

    Parse.$ = jQuery;
    Parse.initialize("qyY21OT36AiP5hIEdrzrBvbOS1HgXzIK52oyzrAN", "vJIGuBlr7sPADL5PUISygvp55PbGXtrdhst3w3Jv");

    if (window.location.hash == "#requestsent") {
        $("#requestsenttext").removeClass("hidden");
    }

    $('[data-ride="animated"]').addClass('invisible');
    $('[data-ride="animated"]').appear();
	$('[data-ride="animated"]').on('appear', function() {
        var $el = $(this), $ani = ($el.data('animation') || 'fadeIn'), $delay;
        if ( !$el.hasClass('animated') ) {
        	$delay = $el.data('delay') || 0;
            setTimeout(function(){
                $el.removeClass('invisible').addClass( $ani + " animated" );
            }, $delay);
        }
    });
    
    $(document).on('click.app','[data-ride="scroll"]',function (e) {
        e.preventDefault();
        var $target = this.hash;
        $('html, body').stop().animate({
            'scrollTop': $($target).offset().top - 80
        }, 1000, 'easeInOutExpo', function () {
            window.location.hash = $target;
        });
    });


    $("#merchantform").on("submit", function() {

        Parse.User.logIn($("#username").val(), $("#password").val(), {
          success: function(user) {


            var fileUploadControl = $("#logo")[0];
            if (fileUploadControl.files.length > 0) {
            var file = fileUploadControl.files[0];
            var name = "weblogo.jpg";
            var parseFile = new Parse.File(name, file);


            parseFile.save().then(function() {

                var ReqClass = Parse.Object.extend("MerchantRequests");
                var req = new ReqClass();

                req.set("taxID", $("#taxid").val());
                req.set("businessName", $("#business").val());
                req.set("phoneNumber", $("#phone").val());
                req.set("user", Parse.User.current());
                req.set("logo", parseFile);


                req.save(null, {
                    success: function(req) {
                        window.location.href="index.html#requestsent";
                    },
                    error: function(req, error) {
                         $("errormessage").text("Failed to send request").show();
                    }
                });

                }, function(error) {
                    $("errormessage").text("Failed to upload file").show();
                });
            }

            
          },
          error: function(user, error) {

            $("errormessage").text("Invalid username/password combination").show();
          }
        });


        return false;
    });
    $("errormessage").hide();


  });
}(window.jQuery);



