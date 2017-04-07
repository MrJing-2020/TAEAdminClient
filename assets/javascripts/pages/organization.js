;
(function ($) {
    //页面用到的api地址
    var getAllOrgzUrl = 'api/Admin/Organization/GetAllOrgz';
    var subComDataUrl='api/Admin/Organization/SubComData';
    var getComDetailUrl='api/Admin/Organization/GetComDetail';
    var getAllCompanyUrl='api/Admin/Organization/ComSelectList';
    var getDepsUrl='api/Admin/Organization/GetDeps';
    var subDepsUrl='api/Admin/Organization/SubDepData';

    //填充公司下拉框数据
    var comSelectInit=function () {
        RequestByAjax({
            url: getAllCompanyUrl,
            type: 'GET',
            data: {},
            success: function (response) {
                var optionsHtml='<option value="#">选择母公司(没有可不选)</option>';
                if(response.length>0){
                    for(var key in response){
                        optionsHtml+='<option value='+response[key].Key+'>'+response[key].Value+'</option>';
                    }
                }
                $("#PreCompanyId").empty();
                $("#PreCompanyId").append(optionsHtml);
            },
            error: function () {
            }
        })
    }
    //初始化公司信息显示页信息
    var comInfoInit=function () {
        RequestByAjax({
            url: getComDetailUrl,
            type: 'GET',
            data: {id: $('#Id').val()},
            success: function (DetailData) {
                $("#companyId").val(DetailData.Id);
                for(var key in DetailData){
                    $("#show"+key).text(DetailData[key]);
                }
            },
            error: function () {
            }
        })
    }
    //求情组织结构树
    var orgTreeInit=function () {
        RequestByAjax({
            url: getAllOrgzUrl,
            type: 'GET',
            data: {},
            success: function (response) {
                if(response.length>0){
                    for(var key in response){
                        if(response[key].type=="root"){
                            response[key].state={"opened": true};
                        }
                    };
                    $('#treeOrgz').jstree({
                        'core' : {
                            'themes' : {
                                'responsive': false
                            },
                            'check_callback' : true,
                            'data':response
                        }
                    });
                    $("#treeOrgz").bind("select_node.jstree", function (e, data) {
                        var id=data.node.id;
                        $('#Id').val(id);
                        comInfoInit();
                    });
                }
            },
            error: function () {
            }
        })
    }
    //打开弹窗前执行
    var beforeOpen = {
        edit: function () {
            comSelectInit();
            RequestByAjax({
                url: getComDetailUrl,
                type: 'GET',
                data: {id: $("#companyId").val()},
                success: function (response) {
                    for(var key in response){
                        $("#"+key).val(response[key]);
                    }
                },
                error: function () {
                }
            })
        },
        detail: function () {
            RequestByAjax({
                url: getDepsUrl,
                type: 'GET',
                data: {id: $('#companyId').val()},
                success: function (response) {
                    $("#detailContent").empty();
                    if (response != undefined) {
                        var htmlDetail = "";
                        for (var i = 0; i < response.length; i++) {
                            htmlDetail += [
                                '<tr><td>' + response[i].DepartName + '</td>',
                                '<td>' + response[i].Duty + '</td>',
                                '<td class="actions">',
                                '<a href="#modalDetailEdit" id=' + response[i].Id + ' class="modal-with-zoom-anim other detailEdit"><i class="fa fa-pencil"></i></a>',
                                '<a href="" id=' + response[i].Id + ' class="delete-row actionDel"><i class="fa fa-trash-o"></i></a>',
                                '</td></tr>'
                            ].join('');
                        }
                        $("#detailContent").append(htmlDetail);
                        ModalInit(beforeOpen);
                        $('.detailEdit').click(function () {
                            $("#departId").val($(this).attr("id"))
                            $("#Duty").val($(this).parent().prev().text());
                            $("#DepartName").val($(this).parent().prev().prev().text());
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
    //新增公司弹窗打开时执行
    $('#addNewItem').on('click', function () {
        $('#editModalForm').find('input,textarea').val("");
        comSelectInit();
    });
    //提交编辑和新增表单
    $('.modal-confirm.edit').on('click', function (e) {
        ModalDataSubmit({
            e:e,
            url:subComDataUrl,
            data:JSON.stringify($("#editModalForm").serializeNestedObject()),
            callback:function () {
                orgTreeInit();
                comInfoInit();
            },
            reload:false
        });
    });
    $('.modal-confirm.detailSub').on('click', function (e) {
        var data = {
            Id: $("#departId").val(),
            DepartName: $("#DepartName").val(),
            Duty: $("#Duty").val(),
            CompanyId: $("#companyId").val()
        }
        ModalDataSubmit({
            e:e,
            url:subDepsUrl,
            data:JSON.stringify(data),
            reload:true
        });
    });
    //初始化弹出框
    ModalInit(beforeOpen);
    //求情组织结构树
    orgTreeInit();
}).apply(this, [jQuery]);
