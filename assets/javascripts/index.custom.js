;
var apiServiceBaseUri = 'http://localhost:8015/';

//jquery路由实现
function LoadMainContent(viewName){
    $("#mainContent").load(viewName+'.html',function(){
        $(this).trigger('loading-overlay:show');
        $('#loadingSpan').trigger('loading-overlay:show');
        $('.nav.nav-main').find('li:not(".nav-parent.nav-expanded.nav-active")').removeClass('nav-active');
        $('#menu-'+viewName).addClass('nav-active');
        jQuery.cumTheme();
        jQuery.cumThemeInit();
        // $(this).trigger('loading-overlay:hide');
    });
};

//ajax请求，在header中添加了认证信息
//param参数格式：
// {
//     url:'api/Admin/UserManager/GetAllUsers',
//     httptype:'GET',
//     data:{pageNumber:1, pageSize:10, orderName:''},
//     callBack:callBackFun
// }
function RequestByAjax(param){
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie("token"));
        },
        url: apiServiceBaseUri + param.url,
        type: param.httptype,
        data: param.data,
        dataType: 'json',
        success: function (data) {
            param.callBack(data);
        }
    });
};

//将请求的数据添加到table中
//格式DatatableInit('#tbodyContent','default',data.DataList,"UserName","Email","PhoneNumber")
//"default"表示默认的表结构，不带工具和detail(可选择details，tabletools，all)
// 从第三个字段起是要显示的字段名
// function DatatableInit(tableSelector,type,data) {
//     if(data!= undefined && data.length>0){
//         var trHtml="";
//         for(var i = 0; i < data.length; i++){
//             trHtml+="<tr>";
//             for(var j=3;j<arguments.length;j++){
//                 trHtml+="<td>"+data[i][arguments[j]]+"</td>";
//             }
//             trHtml+="</tr>";
//         }
//         $(tableSelector+" tbody").append(trHtml);
//         tableInit(tableSelector,type);
//     }
// }
function DatatableInit(param) {
    if(param.data!= undefined && param.data.length>0){
        var trHtml="";
        for(var i = 0; i < param.data.length; i++){
            trHtml+="<tr>";
            for(var j=0;j<param.fields.length;j++){
                trHtml+="<td>"+param.data[i][param.fields[j]]+"</td>";
            }
            trHtml+="</tr>";
        }
        $(param.table+" tbody").append(trHtml);
        tableInit(param.table,param.tableType);
    }
}
$(function() {
     if(window.location.hash.substring(1)!=undefined&&window.location.hash.substring(1)!=''){
         LoadMainContent(window.location.hash.substring(1))
     }else{
         LoadMainContent('main')
     }
     $('.a-route').click(function(){
         LoadMainContent($(this).attr("href").substring(1));
     });
});
