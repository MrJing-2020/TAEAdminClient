;
var apiServiceBaseUri = 'http://localhost:8015/';
$(function(){
    jQuery.cumTheme();
    jQuery.cumThemeInit();
    $('.btn-login').click(function () {
        $('body').trigger('loading-overlay:show');
        var data = {
            'grant_type': 'password',
            'username': $('#userName').val(),
            'password': $('#password').val()
        };
        $.ajax({
            url: apiServiceBaseUri + 'token',
            type: "POST",
            data: data,
            dataType: 'json',
            success: function (response) {
                $.cookie("token", response.access_token);
                window.location.href="../../../index.html";
            },
            error: function (response) {
                $('body').trigger('loading-overlay:hide');
                new PNotify({
                    title: '发生错误！',
                    text: response.msg==undefined?"服务器错误":response.msg,
                    type: 'error',
                    shadow: true,
                    stack: {
                        "push": "top",
                        "context": ($('.mfp-container').length && $('.mfp-container').length > 0) ? $('.mfp-container') : $("body"),
                        "modal": false
                    }
                });
            }
        });
    });
});