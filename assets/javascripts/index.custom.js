;
//全局变量 服务地址
var apiServiceBaseUri = 'http://localhost:8015/';

//用jquery实现简单路由
function LoadMainContent(viewName) {
    $('.content-body').trigger('loading-overlay:show');
    $("#mainContent").load(viewName + '.html', function () {
        $('.nav.nav-main').find('li:not(".nav-parent.nav-expanded.nav-active")').removeClass('nav-active');
        $('#menu-' + viewName).addClass('nav-active');
        //重新绑定事件
        jQuery.cumTheme();
        jQuery.cumThemeInit();
    });
};

//ajax请求 向header中添加验证信息
//param参数格式
// {
//     url:'api/Admin/UserManager/GetAllUsers',
//     type:'GET',
//     data:{pageNumber:1, pageSize:10, orderName:''},
//     success:success,
//     error:error,
// }
function RequestByAjax(param) {
    $('.content-body').trigger('loading-overlay:show');
    $.ajax({
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + $.cookie("token"));
        },
        url: apiServiceBaseUri + param.url,
        type: param.type,
        cache : false,
        data: param.data,
        dataType: 'json',
        contentType: "application/json;charset=utf-8",
        success: function (response) {
            if (param.success != undefined) {
                param.success(response);
            }
            $('.content-body').trigger('loading-overlay:hide');
        },
        error: function (response) {
            if (param.error != undefined) {
                param.error(response);
            }else {
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
            $('.content-body').trigger('loading-overlay:hide');
        }
    });
};

//初始化模态框
function ModalInit(beforeOpen) {
    if(beforeOpen.edit!=undefined){
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
                beforeOpen: beforeOpen.edit
            }
        });
    };
    if(beforeOpen.allocation!=undefined){
        $('.modal-with-zoom-anim.allocation').magnificPopup({
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
                beforeOpen: beforeOpen.allocation
            }
        });
    };
    if(beforeOpen.detail!=undefined){
        $('.modal-with-zoom-anim.detail').magnificPopup({
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
                beforeOpen: beforeOpen.detail
            }
        });
    };
    if(beforeOpen.authority!=undefined){
        $('.modal-with-zoom-anim.authority').magnificPopup({
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
                beforeOpen: beforeOpen.authority
            }
        });
    };
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
    $('.modal-dismiss').click(function (e) {
        e.preventDefault();
        $.magnificPopup.close();
    });
};

function InitKey(ele) {
    $('#Id').val($(ele).attr('trkey'));
};

//提交modal数据
//参数格式
// {
//     e:e,
//     url:subComDataUrl,
//     data:{},
//     callback:function () {},
//     reload:false
// }
function ModalDataSubmit(param) {
    param.e.preventDefault();
    RequestByAjax({
        url: param.url,
        type: 'POST',
        data: param.data,
        success: function () {
            $.magnificPopup.close();
            if(param.reload==true){
                LoadMainContent(window.location.hash.substring(1))
            }
            if(param.callback!=null&&param.callback!=undefined){
                param.callback();
            }
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
});
