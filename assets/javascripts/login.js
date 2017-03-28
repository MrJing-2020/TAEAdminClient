;
var apiServiceBaseUri = 'http://localhost:8015/';
$(function(){
    jQuery.cumTheme();
    jQuery.cumThemeInit();
    $('.btn-login').click(function () {
        $('#loginApp').trigger('loading-overlay:show');
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
                window.location.href="./index.html";
            },
            error: function (xmlHttpRequest) {
                //$("#message").html(xmlHttpRequest.responseJSON.error_description);
                $('#loginApp').trigger('loading-overlay:hide');
                $('.alert.alert-danger').css('display','');
                setTimeout(function() {
                    $('.alert.alert-danger').css('display','none');
                }, 3000);
            }
        });
    });
});