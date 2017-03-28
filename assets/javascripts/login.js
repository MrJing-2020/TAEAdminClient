;
var apiServiceBaseUri = 'http://localhost:8015/';
$(function(){
    $('.btn-login').click(function () {
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
                $('.alert.alert-danger').css('display','');
                setTimeout(function() {
                    $('.alert.alert-danger').css('display','none');
                }, 3000);
            }
        });

    });
})
;