;
var apiServiceBaseUri = 'http://localhost:8015/';

//用jquery实现简单路由
function LoadMainContent(viewName) {
    $('.content-body').trigger('loading-overlay:show');
    $("#mainContent").load(viewName + '.html', function () {
        $('.nav.nav-main').find('li:not(".nav-parent.nav-expanded.nav-active")').removeClass('nav-active');
        $('#menu-' + viewName).addClass('nav-active');
        jQuery.cumTheme();
        jQuery.cumThemeInit();
    });
};

//ajax请求 向header中添加验证信息
//param参数格式
// {
//     url:'api/Admin/UserManager/GetAllUsers',
//     httptype:'GET',
//     data:{pageNumber:1, pageSize:10, orderName:''},
//     callBack:callBackFun
// }
function RequestByAjax(param) {
    $('.content-body').trigger('loading-overlay:show');
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie("token"));
        },
        url: apiServiceBaseUri + param.url,
        type: param.httptype,
        data: param.data,
        dataType: 'json',
        success: function (response) {
            if (param.callBack != undefined && param.callBack != undefined) {
                param.callBack(response);
            }
            $(this).trigger('loading-overlay:hide');

        },
        error: function (response) {
            new PNotify({
                title: '发生错误！',
                text: response.error_description==undefined?"服务器错误":response.error_description,
                type: 'error',
                shadow: true,
                stack: {
                    "push": "top",
                    "context": ($('.mfp-container').length && $('.mfp-container').length > 0) ? $('.mfp-container') : $("body"),
                    "modal": false
                }
            });
            $('.content-body').trigger('loading-overlay:hide');
        }
    });
};

//将请求到的数据填充到table中，并配置表结构和工具
//参数格式
// {
//     table:'#datatable',  //待填充的表
//     tableType:'default', //表结构类型(可选default details tabletools all四种)
//     data:data.DataList,  //数据
//     key:'Id',            //key字段，行的唯一性
//     fields:["UserName","Email","PhoneNumber"] //需要显示的字段
// }
function DatatableInit(param) {
    if (param.data != undefined && param.data.length > 0) {
        var trHtml = "";
        for (var i = 0; i < param.data.length; i++) {
            trHtml += "<tr>";
            for (var j = 0; j < param.fields.length; j++) {
                trHtml += "<td>" + param.data[i][param.fields[j]] + "</td>";
            }
            trHtml += '<td class="actions table-td">';
            trHtml += '<button href="#modalEdit" onclick="InitKey(this)" trkey="' + param.data[i][param.key] + '" class="modal-with-zoom-anim edit mb-xs mt-xs mr-xs btn btn-xs btn-primary"><i class="fa fa-edit"></i> </button>';
            trHtml += '<button href="#modalDelete" onclick="InitKey(this)" trkey="' + param.data[i][param.key] + '" class="modal-with-zoom-anim other mb-xs mt-xs mr-xs btn btn-xs btn-danger"><i class="fa fa-remove"></i> </button>';
            trHtml += "</td></tr>";
        }
        $(param.table + " tbody").append(trHtml);
        TableInit(param.table, param.tableType);
    }
}
//初始化模态框
function ModalInit(beforeOpen) {
    $('.modal-with-zoom-anim.edit').magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in',
        modal: true,
        callbacks: {
            beforeOpen: beforeOpen
        }
    });
    $('.modal-with-zoom-anim.other').magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        closeBtnInside: true,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'my-mfp-zoom-in',
        modal: true
    });
};
function InitKey(ele) {
    $('#Id').val($(ele).attr('trkey'));
};
//提交modal数据
function ModalDataSubmit(e, url, data) {
    e.preventDefault();
    RequestByAjax({
        url: url,
        httptype: 'POST',
        data: data,
        callBack: function () {
            $.magnificPopup.close();
        }
    });
}

$(function () {
    if (window.location.hash.substring(1) != '') {
        LoadMainContent(window.location.hash.substring(1))
    } else {
        LoadMainContent('main')
    }
    $('.a-route').click(function () {
        LoadMainContent($(this).attr("href").substring(1));
    });

    $('.modal-dismiss').click(function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });
});
