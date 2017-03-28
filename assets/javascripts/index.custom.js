;
var apiServiceBaseUri = 'http://localhost:8015/';
$(function() {
     $("#mainContent").load("main.html",function(){
         jQuery.cumTheme();
         jQuery.cumThemeInit();
     });
     $('.a-route').click(function(){
         $("#mainContent").load($(this).attr("href").substring(1) + ".html",function(){
             jQuery.cumTheme();
             jQuery.cumThemeInit();
         });
     });
    var getOrders = function () {
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie("token"));
            },
            url: apiServiceBaseUri + 'api/orders',
            type: "GET",
            dataType: 'json',
            success: function (data) {

            }
        });
    }
});
