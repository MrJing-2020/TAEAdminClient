;
(function ($) {
    var listUrl='api/Admin/FlowManager/AllFlowAndType';
    var detailUrl='api/Admin/FlowManager/GetFlow';
    var flowAndDetailUrl='api/Admin/FlowManager/GetFlowAndDetails';
    var flowDetailUrl='api/Admin/FlowManager/GetFlowDetail';
    var subDataUrl='api/Admin/FlowManager/SubFlow';
    var subDataDetailUrl='api/Admin/FlowManager/SubFlowDetail';
    var delUrl="";
    var getComSelectUrl='api/Admin/Organization/ComSelectList';
    var getDepSelectUrl='api/Admin/UserManager/DepSelectList';
    var getTypeSelectUrl='api/Admin/FlowManager/FlowTypeSelectList';
    var getUserSelectUrl='api/Admin/UserManager/UserSelectList';

    //填充流程类型下拉框数据(加载页面时执行一次即可)
    var typeSelectInit=function (callback) {
        RequestByAjax({
            url: getTypeSelectUrl,
            type: 'GET',
            data: {},
            success: function (response) {
                var optionsHtml='';
                if(response.length>0){
                    for(var key in response){
                        optionsHtml+='<option value='+response[key].Key+'>'+response[key].Value+'</option>';
                    }
                }
                $("#Type").empty();
                $("#Type").append(optionsHtml);
                if(callback!=undefined&&callback!=null)
                {
                    callback();
                }
            },
            error: function () {
            }
        })
    }
    //填充公司下拉框数据(加载页面时执行一次即可)
    var comSelectInit=function (callback) {
        RequestByAjax({
            url: getComSelectUrl,
            type: 'GET',
            data: {},
            success: function (response) {
                var optionsHtml='<option>请选择公司</option>';
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
    //请求工作流树
    var flowTreeInit=function () {
        $('#treeContent').empty();
        $('#treeContent').append('<div id="treeFlow"></div>');
        RequestByAjax({
            url: listUrl,
            type: 'GET',
            data: {},
            success: function (response) {
                if(response.length>0){
                    for(var key in response){
                        if(response[key].type=="root"){
                            response[key].state={"opened": true};
                        }
                    };
                    $('#treeFlow').jstree({
                        'core' : {
                            'themes' : {
                                'responsive': false
                            },
                            'check_callback' : true,
                            'data':response
                        }
                    });
                    $("#treeFlow").bind("select_node.jstree", function (e, data) {
                        var id=data.node.id;
                        $('#Id').val(id);
                        flowInfoInit();
                    });
                }
                //填充流程类型下拉框数据
                typeSelectInit();
                //填充公司下拉框数据
                comSelectInit();
            }
        })
    }
    //初始化流程信息显示页信息
    var flowInfoInit=function () {
        RequestByAjax({
            url: flowAndDetailUrl,
            type: 'GET',
            data: {id: $('#Id').val()},
            success: function (DetailData) {
                $("#flowId").val(DetailData.Id);
                $('#flowCompanyId').val(DetailData.CompanyId);
                $('#flowDepartmentId').val(DetailData.DepartmentId)
                for(var key in DetailData){
                    $("#show"+key).text(DetailData[key]);
                }
                var stepHtml="";
                for(var key in DetailData.WorkFlowDetail){
                    var num=parseInt(key)+1;
                    stepHtml+=[
                        '<li><div class="tm-box">',
                        '<div class="flow-detial-item">',
                        '<p class="text-muted mb-none">'+num+'.'+DetailData.WorkFlowDetail[key].Name+'</p>',
                        '<p class="message">默认审核人：'+DetailData.WorkFlowDetail[key].DefualtAuditRealName+'</p>',
                        '</div><div class="flow-detial-action">',
                        '<span class="hvr-icon-bob"></span>',
                        '<span href="#modalDetailEdit" onclick="initFlowDetailId(this)" id='+DetailData.WorkFlowDetail[key].Id+' class="hvr-icon-edit modal-with-zoom-anim detail"></span>',
                        '</div></li>'
                    ].join('');
                };
                $('#workFlowDetails').empty();
                $('#workFlowDetails').append(stepHtml);
                //初始化弹出框
                ModalInit(beforeOpen);
                $('.tm-box').hover(
                    function () {
                        $('.flow-detial-action').css("visibility","hidden");
                        $(this).find('.flow-detial-action').css("visibility","visible");
                    },
                    function () {
                        $('.flow-detial-action').css("visibility","hidden")
                    }
                );
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
    //填充步骤弹窗中部门下拉框数据
    var StepDepSelectInit = function (callback) {
        RequestByAjax({
            url: getDepSelectUrl,
            type: 'GET',
            data: { id: $("#flowCompanyId").val() },
            success: function (response) {
                var optionsHtml = '<option>请选择部门</option>';
                if (response.length > 0) {
                    for (var key in response) {
                        optionsHtml += '<option value=' + response[key].Key + '>' + response[key].Value + '</option>';
                    }
                }
                $("#StepDep").empty();
                $("#StepDep").append(optionsHtml);
                if (callback != undefined && callback != null) {
                    callback();
                }
            },
            error: function () {
            }
        })
    }
    //填充审核人下拉框数据
    var userSelectInit = function (DepId,callback) {
        RequestByAjax({
            url: getUserSelectUrl,
            type: 'GET',
            data: { id: DepId },
            success: function (response) {
                var optionsHtml='';
                if(response.length>0){
                    for(var key in response){
                        optionsHtml+='<option value='+response[key].Key+'>'+response[key].Value+'</option>';
                    }
                }
                if (optionsHtml == '')
                {
                    optionsHtml += '<option></option>';
                }
                $("#DefualtAuditUserId").empty();
                $("#DefualtAuditUserId").append(optionsHtml);
                if(callback!=undefined&&callback!=null)
                {
                    callback();
                }
            },
            error: function () {
            }
        })
    }
    //次序列表展示
    var aa = "";
    var stepData = function (callback) {
        RequestByAjax({
            url: flowAndDetailUrl,
            type: 'GET',
            data: { id: $('#Id').val() },
            success: function (DetailData) {
                if (DetailData.WorkFlowDetail == "")
                {
                    $("#Ts").text("(该步骤默认为第一步)");
                    $("#StepValue").val("1");
                }
                else
                {
                    $("#Ts").text("(步骤将添加于选中步骤的下方)");
                    var stepHtml = "";
                    for (var key in DetailData.WorkFlowDetail) {
                        var WorkFlowID = DetailData.WorkFlowDetail[key].Step;
                        var num = parseInt(key) + 1;
                        stepHtml += [
                            '<li class="' + WorkFlowID + '" ><div class="tm-box">',
                            '<div class="flow-detial-item">',
                            '<p class="text-muted mb-none">' + num + '.' + DetailData.WorkFlowDetail[key].Name + '</p>',
                            '<p class="message">默认审核人：' + DetailData.WorkFlowDetail[key].DefualtAuditRealName + '</p>',
                            '</div><div class="flow-detial-action">',
                            '<span class="hvr-icon-bob"></span>',
                            '<span href="#modalDetailEdit" onclick="initFlowDetailId(this)" id=' + DetailData.WorkFlowDetail[key].Id + ' class="hvr-icon-edit modal-with-zoom-anim detail"></span>',
                            '</div></li>'
                        ].join('');
                    };
                    $('#Step').empty();
                    $('#Step').append(stepHtml);
                    StepClick();
                }
               
            }
        })
    }
    var StepClick = function () {
        $("#Step li").each(function () {
            $(this).click(function () {
                var id = $(this).attr("class");
                $("#StepValue").val(id);
                alert($("#StepValue").val());
                $(this).attr("style", "background:#E0E0E0").siblings().attr("style", "background:");
            })
        })
    }
    //打开弹窗前执行
    var beforeOpen={
        edit:function () {
            RequestByAjax({
                url: detailUrl,
                type: 'GET',
                data: {id: $('#flowId').val()},
                success: function (response) {
                    for(var key in response){
                        $("#"+key).val(response[key]);
                    };
                    $("#CompanyId").val(response.CompanyId);
                    depSelectInit(response.CompanyId,function () {
                        $('#DepartmentId').val(response.DepartmentId);
                    });
                }
            });
        },
        detail:function () {
            var id=$('#FlowDetialId').val();
            RequestByAjax({
                url: flowDetailUrl,
                type: 'GET',
                data: {id: id},
                success: function (response) {
                    $('#FlowDetialId').val(response.Id);
                    $('#FlowDetialName').val(response.Name);
                    $('#Step').val(response.Step);
                    $('#DefualtAuditUserId').val(response.DefualtAuditUserId);
                    userSelectInit(function () {
                        $('#DefualtAuditUserId').val(response.DefualtAuditUserId);
                    });
                }
            });
        }
    }

    $('#addNewItem').on('click', function () {
        $('#editModalForm').find('input').val("");
    });
    $("#CompanyId").change(function () {
        $("#DepartmentId").empty();
        depSelectInit($(this).val());
    });
    $("#StepDep").change(function () {
        $("#DefualtAuditUserId").empty();
        userSelectInit($(this).val());
    })
    $('#flowDetailAdd').click(function () {
        $('#FlowDetialId').val("");
        $("#detailEditModalForm").find("input").val("");
        StepDepSelectInit();
        stepData();
    });
    //弹框数据提交
    $('.modal-confirm.edit').on('click', function (e) {
        ModalDataSubmit({
            e:e,
            url:subDataUrl,
            data:JSON.stringify($("#editModalForm").serializeNestedObject()),
            reload:false,
            callback:function () {
                flowInfoInit();
                flowTreeInit();
            }
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
    //初始化弹出框
    ModalInit(beforeOpen);
    //请求组织结构树
    flowTreeInit();
    $(document).on('click', '.modal-confirm.detailEdit', function (e) {
        if ($('#StepDep').val() == "请选择部门")
        {
            if ($('#FlowDetialName').val() == "")
            {

            }
            if ($("#StepValue").val() == "")
            {
            }
        }
        else
        {
            var data = {
                Id: $('#FlowDetialId').val(),
                WorkFlowId: $('#flowId').val(),
                Name: $('#FlowDetialName').val(),
                CompanyId: $('#flowCompanyId').val(),
                DepartmentId: $('#StepDep').val(),
                DefualtAuditUserId: $('#DefualtAuditUserId').val(),
                Step: $("#StepValue").val()
            };
            ModalDataSubmit({
                e: e,
                url: subDataDetailUrl,
                data: JSON.stringify(data),
                reload: false,
                callback: flowInfoInit
            });
        }
        
    });
}).apply(this, [jQuery]);

