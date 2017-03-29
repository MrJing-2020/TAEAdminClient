;
var apiServiceBaseUri = 'http://localhost:8015/';

//jqueryʵ��·��
function LoadMainContent(viewName) {
    $("#mainContent").load(viewName + '.html', function () {
        $(this).trigger('loading-overlay:show');
        $('#loadingSpan').trigger('loading-overlay:show');
        $('.nav.nav-main').find('li:not(".nav-parent.nav-expanded.nav-active")').removeClass('nav-active');
        $('#menu-' + viewName).addClass('nav-active');
        jQuery.cumTheme();
        jQuery.cumThemeInit();
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
function RequestByAjax(param) {
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie("token"));
        },
        url: apiServiceBaseUri + param.url,
        type: param.httptype,
        data: param.data,
        dataType: 'json',
        success: function (response) {
            if(param.callBack!=undefined&&param.callBack!=undefined){
                param.callBack(response);
            }
        },
        error: function (response) {
            new PNotify({
                title: 'With Shadow',
                text: response.error_description,
                type: 'error',
                index: 100000,
                shadow: true,
                stack: { "push": "top", "context": $("body"), "modal": false}
            });
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
//��ʼ��ģ̬��
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
//�ύ����
function ModalDataSubmit(e,url,data) {
    e.preventDefault();
    RequestByAjax({
        url:url,
        httptype:'POST',
        data:data,
        callBack:function () {
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
