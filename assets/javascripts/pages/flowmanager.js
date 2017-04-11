;
(function ($) {
    var listUrl='api/Admin/FlowManager/AllFlows';
    var detailUrl='api/Admin/FlowManager/GetFlow';
    var flowDetailUrl='api/Admin/FlowManager/GetFlowDetails';
    var subDataUrl='api/Admin/FlowManager/SubFlow';
    var delUrl="";
    var getComSelectUrl='api/Admin/Organization/ComSelectList';
    var getDepSelectUrl='api/Admin/UserManager/DepSelectList';

    //layer弹窗
    var layerModal = function (title,ele) {
        layer.open({
            type: 1,
            title:title,
            area: '500px',
            fixed: false, //不固定
            maxmin: true,
            zIndex:8888,
            content: ele
        });
    }
    //填充公司下拉框数据(加载页面是执行一次即可)
    var comSelectInit=function (callback) {
        RequestByAjax({
            url: getComSelectUrl,
            type: 'GET',
            data: {},
            success: function (response) {
                var optionsHtml='';
                if(response.length>0){
                    for(var key in response){
                        optionsHtml+='<option value='+response[key].Key+'>'+response[key].Value+'</option>';
                    }
                }
                $("#CompanyId").empty();
                $("#CompanyId").append(optionsHtml);
                if(callback!=undefined&&callback!=null)
                {
                    callback();
                }
            },
            error: function () {
            }
        })
    }
    //填充部门下拉框数据
    var depSelectInit=function (comId,callback) {
        RequestByAjax({
            url: getDepSelectUrl,
            type: 'GET',
            data: {id:comId},
            success: function (response) {
                var optionsHtml='';
                if(response.length>0){
                    for(var key in response){
                        optionsHtml+='<option value='+response[key].Key+'>'+response[key].Value+'</option>';
                    }
                }
                $("#DepartmentId").empty();
                $("#DepartmentId").append(optionsHtml);
                if(callback!=undefined&&callback!=null)
                {
                    callback();
                }
            },
            error: function () {
            }
        })
    }
    //填充流程明细弹窗数据
    var flowDetailListInit=function () {
        $("#tbPosList").empty();
        RequestByAjax({
            url: getPosUrl,
            type: 'GET',
            data: {id: $("#companyId").val()},
            success: function (response) {
                if (response != undefined) {
                    var trHtml="";
                    for(var key in response){
                        trHtml += [
                            '<tr><td>' + response[key].PositionName + '</td>',
                            '<td>' + response[key].Duty + '</td>',
                            '<td class="actions">',
                            '<a href="#modalPositionEdit" id=' + response[key].Id + ' class="modal-with-zoom-anim other posEdit"><i class="fa fa-pencil"></i></a>',
                            '<a href="" id=' + response[key].Id + ' class="delete-row actionDel"><i class="fa fa-trash-o"></i></a>',
                            '</td></tr>'
                        ].join('');
                    }
                    $("#tbPosList").append(trHtml);
                    ModalInit(beforeOpen);
                    $('.posEdit').click(function () {
                        $("#positionId").val($(this).attr("id"))
                        $("#PositionDuty").val($(this).parent().prev().text());
                        $("#PositionName").val($(this).parent().prev().prev().text());
                    })
                }else {
                    $("#tbPosList").append('<tr><td colspan="3">没有任何内容！</td></tr>>');
                }
            },
            error: function () {
            }
        });
    }
    //打开弹窗前执行
    var beforeOpen={
        edit:function () {
            RequestByAjax({
                url: detailUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success: function (response) {
                    for(var key in response){
                        $("#"+key).val(response[key]);
                    };
                    $("#CompanyId").val(response.CompanyId);
                    depSelectInit(response.CompanyId,function () {
                        $('#DepartmentId').val(response.DepartmentId);
                    });
                },
                error: function () {
                }
            });
        }
    }
    $('#addNewItem').on('click', function () {
        $('#editModalForm').find('input').val("");
    });
    $('#flowDetail').click(function () {
        layerModal("流程明细",$("#modalFlowDetial"));
        flowDetailListInit();
    });
    $("#CompanyId").change(function () {
        $("#DepartmentId").empty();
        depSelectInit($(this).val());
    });
    //弹框数据提交
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
    //数据表初始化和填充数据
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
                    data: "Name"
                },
                {
                    data: "CompanyName"
                },
                {
                    data: "DepartName"
                },
                {
                    data: "TypeName"
                },
                {
                    className:'actions table-td',
                    data:"Id",
                    render : function(data,type, row, meta) {
                        var trHtml='';
                        trHtml += '<button href="#modalEdit" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim edit mb-xs mt-xs mr-xs btn btn-xs btn-primary"><i class="fa fa-edit"></i> </button>';
                        trHtml += '<button href="#modalDelete" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim other mb-xs mt-xs mr-xs btn btn-xs btn-danger"><i class="fa fa-remove"></i> </button>';
                        trHtml += '<button href="javascript:void(0);" id="flowDetail" trkey="' + data + '" class="mb-xs mt-xs mr-xs btn btn-xs btn-info"><i class="fa fa-eye"></i> </button>';
                        return trHtml;
                    }
                }
            ],
            success: function () {
                ModalInit(beforeOpen);
                comSelectInit(function () {
                    depSelectInit($("#CompanyId").val());
                });
                $('#flowDetail').click(function () {
                    layerModal("流程明细",$("#modalFlowDetial"));
                    // flowDetailListInit();
                });
            }
        });
    };
    userManagerTableInit();
}).apply(this, [jQuery]);
