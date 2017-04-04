;
(function ($) {
    var listUrl = 'api/Admin/MenuManager/AllMenus';
    var detailUrl = 'api/Admin/MenuManager/GetMenuDetail';
    var subDataUrl = 'api/Admin/MenuManager/SubMenuData';
    var delUrl = "";
    var getActionsUrl = 'api/Admin/MenuManager/GetActions';
    var subActionUrl = 'api/Admin/MenuManager/SubAction';
    //打开弹窗前执行
    var beforeOpen = {
        edit: function () {
            RequestByAjax({
                url: detailUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success: function (response) {
                    $('#MenuName').val(response.MenuName);
                    $('#MenuHtmlUrl').val(response.MenuHtmlUrl);
                    $('#MenuApiUrl').val(response.MenuApiUrl);
                    $('#MenuLever').val(response.MenuLever);
                    $('#MenuPareId').val(response.MenuPareId);
                    $('#Sort').val(response.Sort);
                    $('#MenuIco').val(response.MenuIco);
                    if(response.IsParent==true){
                        $("#IsParent").get(0).checked=true;
                    }else {
                        $("#NotParent").get(0).checked=true;
                    }
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
                                '<a href="#modalActionEdit" id=' + response[i].Id + ' class="modal-with-zoom-anim other actionEdit"><i class="fa fa-pencil"></i></a>',
                                '<a href="" id=' + response[i].Id + ' class="delete-row actionDel"><i class="fa fa-trash-o"></i></a>',
                                '</td></tr>'
                            ].join('');
                        }
                        $("#detailContent").append(htmlDetail);
                        ModalInit(beforeOpen);
                        $('.actionEdit').click(function () {
                            $("#actionId").val($(this).attr("id"))
                            $("#methodName").val($(this).parent().prev().text());
                            $("#actionName").val($(this).parent().prev().prev().text());
                        })
                    } else {
                        $("#detailContent").append("没有任何内容！");
                    }
                },
                error: function () {
                }
            });
        }
    };
    $('#addNewItem').on('click', function () {
        $('#editModalForm').find('input').val("");
    });
    $('.modal-confirm.edit').on('click', function (e) {
        ModalDataSubmit(e, subDataUrl, JSON.stringify($("#editModalForm").serializeNestedObject()));
    });
    $('.modal-confirm.del').on('click', function (e) {
        ModalDataSubmit(e, delUrl, $('#Id').val());
    });
    $('.modal-confirm.actionSub').on('click', function (e) {
        var data = {
            Id: $("#actionId").val(),
            MenuName: $("#actionName").val(),
            Action: $("#methodName").val(),
            MenuPareId: $("#Id").val()
        }
        ModalDataSubmit(e, subActionUrl, JSON.stringify(data));
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
                            trHtml += '<button href="#modalChild" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim detail mb-xs mt-xs mr-xs btn btn-xs btn-info"><i class="fa fa-eye"></i> </button>';
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
