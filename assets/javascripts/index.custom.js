;
var apiServiceBaseUri = 'http://localhost:8015/';

//jqueryʵ��·��
function LoadMainContent(viewName){
    $("#mainContent").load(viewName+'.html',function(){
        $(this).trigger('loading-overlay:show');
        $('#loadingSpan').trigger('loading-overlay:show');
        $('.nav.nav-main').find('li:not(".nav-parent.nav-expanded.nav-active")').removeClass('nav-active');
        $('#menu-'+viewName).addClass('nav-active');
        jQuery.cumTheme();
        jQuery.cumThemeInit();
        $(this).trigger('loading-overlay:hide');
    });
};

//ajax������header���������֤��Ϣ
//param������ʽ��
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

//�����ݲ��뵽table�У�����ʽ�����
//������ʽ
// {
//     table:'#datatable',  //Ҫ�����ı��
//     tableType:'default', //�������(default details tabletools all)
//     data:data.DataList,  //����
//     fields:["UserName","Email","PhoneNumber"] //Ҫ��ʾ�ֶ�
// }
function DatatableInit(param) {
    if(param.data!= undefined && param.data.length>0){
        var trHtml="";
        for(var i = 0; i < param.data.length; i++){
            trHtml+="<tr>";
            for(var j=0;j<param.fields.length;j++){
                trHtml+="<td>"+param.data[i][param.fields[j]]+"</td>";
            }
            trHtml+='<td class="actions table-td">';
            // trHtml+='<a href="#modalEdit" class="modal-with-zoom-anim"><i class="fa fa-pencil"></i></a>';
            // trHtml+='<a href="#modalDelete" class="modal-with-zoom-anim delete-row"><i class="fa fa-trash-o"></i></a>';
            trHtml+='<button href="#modalEdit" class="modal-with-zoom-anim mb-xs mt-xs mr-xs btn btn-xs btn-primary"><i class="fa fa-edit"></i> </button>';
            trHtml+='<button href="#modalDelete" class="modal-with-zoom-anim mb-xs mt-xs mr-xs btn btn-xs btn-danger"><i class="fa fa-remove"></i> </button>';
            trHtml+="</td></tr>";
        }
        $(param.table+" tbody").append(trHtml);
        tableInit(param.table,param.tableType);
    }
}
$(function() {
     if(window.location.hash.substring(1)!=''){
         LoadMainContent(window.location.hash.substring(1))
     }else{
         LoadMainContent('main')
     }
     $('.a-route').click(function(){
         LoadMainContent($(this).attr("href").substring(1));
     });
});
