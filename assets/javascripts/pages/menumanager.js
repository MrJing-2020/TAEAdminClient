;
(function ($) {
    //该也难用到的api地址
    var listUrl = 'api/Admin/MenuManager/AllMenus';
    var detailUrl = 'api/Admin/MenuManager/GetMenuDetail';
    var subDataUrl = 'api/Admin/MenuManager/SubMenuData';
    var delUrl = "";
    var getActionsUrl = 'api/Admin/MenuManager/GetActions';
    var subActionUrl = 'api/Admin/MenuManager/SubAction';
    var getParMenusUrl='api/Admin/MenuManager/GetParMenus';

    var getParMenus= function () {
        RequestByAjax({
            url: getParMenusUrl,
            type: 'GET',
            data: {},
            success: function (response) {
                $("#MenuPareId").empty();
                var optionHtml='<option value="#">选择父级菜单</option>';
                for(var key in response){
                    optionHtml+='<option value='+response[key].Id+'>'+response[key].MenuName+'</option>'
                }
                $("#MenuPareId").append(optionHtml);
            },
            error: function () {
            }
        });
    };
    var bindFormEleEvent= function () {
        $("input[name='IsParent']").click(function () {
            if($("#IsParent").get(0).checked){
                $(".canHidden").css("display","none");
                $('#MenuLever').val(1);
                $('#MenuPareId').val("#");
            }else {
                $(".canHidden").css("display","")
            }
        });
        $('#MenuLever').change(function () {
            if($('#MenuLever').val()==1){
                $('#MenuPareId').val(0).attr("disabled",true);
            }else {
                $('#MenuPareId').removeAttr("disabled");
            }
        });
        $('#MenuIco').unbind("click");
        $("#MenuIco").click(function () {
            iconSelect();
            $(".demo-icon-hover").click(function () {
                alert($(this).find('i').attr("class"))
            })
        })

    }
    var iconSelect = function () {
        layer.open({
            type: 2,
            title:"图标选择",
            area: ['700px', '530px'],
            fixed: false, //不固定
            maxmin: true,
            content: './icon.html'
        });
    }
    //打开弹窗前执行
    var beforeOpen = {
        edit: function () {
            RequestByAjax({
                url: detailUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success: function (response) {
                    getParMenus();
                    if(response.IsParent==true){
                        $("#IsParent").get(0).checked=true;
                        $(".canHidden").css("display","none")
                    }else {
                        $("#NotParent").get(0).checked=true;
                        $(".canHidden").css("display","")
                    }
                    $('#MenuName').val(response.MenuName);
                    $('#MenuHtmlUrl').val(response.MenuHtmlUrl);
                    $('#Area').val(response.Area);
                    $('#Controller').val(response.Controller);
                    $('#Action').val(response.Action);
                    $('#MenuLever').val(response.MenuLever);
                    $('#MenuPareId').val(response.MenuPareId);
                    if($('#MenuLever').val()==1){
                        $('#MenuPareId').attr("disabled",true)
                    }
                    $('#Sort').val(response.Sort);
                    $('#MenuIco').val(response.MenuIco);
                    $(".iconShowContent i").attr("class",response.MenuIco)
                    bindFormEleEvent();
                },
                error: function () {
                }
            });
        },
        detail: function () {
            RequestByAjax({
                url: getActionsUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success: function (response) {
                    $("#detailContent").empty();
                    if (response != undefined) {
                        var htmlDetail = "";
                        for (var i = 0; i < response.length; i++) {
                            htmlDetail += [
                                '<tr><td>' + response[i].MenuName + '</td>',
                                '<td>' + response[i].Action + '</td>',
                                '<td class="actions">',
                                '<a href="#modalDetailEdit" id=' + response[i].Id + ' class="modal-with-zoom-anim other detailEdit"><i class="fa fa-pencil"></i></a>',
                                '<a href="" id=' + response[i].Id + ' class="delete-row actionDel"><i class="fa fa-trash-o"></i></a>',
                                '</td></tr>'
                            ].join('');
                        }
                        $("#detailContent").append(htmlDetail);
                        ModalInit(beforeOpen);
                        $('.detailEdit').click(function () {
                            $("#actionId").val($(this).attr("id"))
                            $("#methodName").val($(this).parent().prev().text());
                            $("#actionName").val($(this).parent().prev().prev().text());
                        })
                    } else {
                        $("#detailContent").append('<tr><td colspan="3">没有任何内容！</td></tr>>');
                    }
                },
                error: function () {
                }
            });
        }
    };
    $('#addNewItem').on('click', function () {
        $("#Id").val("");
        $('#editModalForm').find('input[type="text"]').val("");
        $(".iconShowContent i").attr("class","");
        $("#NotParent").get(0).checked=true;
        bindFormEleEvent();
        getParMenus();
    });
    $('#detailAdd').on('click',function () {
        $("#modalDetailEditForm input").val("")
        $("#actionId").val("");
    })
    //弹出框数据提交
    $('.modal-confirm.edit').on('click', function (e) {
        ModalDataSubmit({
            e:e,
            url:subDataUrl,
            data:JSON.stringify($("#editModalForm").serializeNestedObject()),
            reload:true
        });
    });
    $('.modal-confirm.del').on('click', function (e) {
        ModalDataSubmit({
            e:e,
            url:delUrl,
            data:$('#Id').val(),
            reload:true
        });
    });
    $('.modal-confirm.detailSub').on('click', function (e) {
        var data = {
            Id: $("#actionId").val(),
            MenuName: $("#actionName").val(),
            Action: $("#methodName").val(),
            MenuPareId: $("#Id").val()
        }
        ModalDataSubmit({
            e:e,
            url:subActionUrl,
            data:JSON.stringify(data),
            reload:true
        });
    });
    function userManagerTableInit() {
        TableInit({
            table: '#datatable',
            tableType: 'default',
            ajax: {
                url: listUrl,
                type: 'POST',
            },
            search: '',
            columns: [
                {
                    data: "MenuName"
                },
                {
                    data: "MenuHtmlUrl"
                },
                {
                    data: "MenuApiUrl"
                },
                {
                    data: "PareMenuName"
                },
                {
                    className:"center",
                    data: "MenuIco",
                    render: function (data, type, row, meta) {
                        return '<i class="' + data + '"></i>';
                    }
                },
                {
                    className: 'actions table-td',
                    data: "Id",
                    render: function (data, type, row, meta) {
                        var trHtml = '';
                        trHtml += '<button href="#modalEdit" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim edit mb-xs mt-xs mr-xs btn btn-xs btn-primary"><i class="fa fa-edit"></i> </button>';
                        trHtml += '<button href="#modalDelete" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim other mb-xs mt-xs mr-xs btn btn-xs btn-danger"><i class="fa fa-remove"></i> </button>';
                        if(row.IsParent==false){
                            trHtml += '<button href="#modalDetail" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim detail mb-xs mt-xs mr-xs btn btn-xs btn-info"><i class="fa fa-eye"></i> </button>';
                        }
                        return trHtml;
                    }
                }
            ],
            success: function () {
                ModalInit(beforeOpen)
            }
        });
    };
    userManagerTableInit();
}).apply(this, [jQuery]);
