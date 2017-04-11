;
(function ($) {
    var listUrl='api/Admin/UserManager/AllUsers';
    var detailUrl='api/Admin/UserManager/GetUserDetail';
    var subDataUrl='api/Admin/UserManager/SubUserData';
    var getRoleUrl='api/Admin/UserManager/GetRoleByUser';
    var delUrl="";
    var allocationUrl="api/Admin/UserManager/RoleAllocationSub";
    var authoritylUrl="api/Admin/Authority/GetUserAuthority";
    var getComSelectUrl='api/Admin/Organization/ComSelectList';
    var getDepSelectUrl='api/Admin/UserManager/DepSelectList';
    var getPosSelectUrl='api/Admin/UserManager/PosSelectList';

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
    //填充职位下拉框数据
    var posSelectInit=function (comId,callback) {
        RequestByAjax({
            url: getPosSelectUrl,
            type: 'GET',
            data: {id:comId},
            success: function (response) {
                var optionsHtml='';
                if(response.length>0){
                    for(var key in response){
                        optionsHtml+='<option value='+response[key].Key+'>'+response[key].Value+'</option>';
                    }
                }
                $("#PositionId").empty();
                $("#PositionId").append(optionsHtml);
                if(callback!=undefined&&callback!=null)
                {
                    callback();
                }
            },
            error: function () {
            }
        })
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
                    $('#Password').val('');
                    $("#CompanyId").val(response.CompanyId);
                    depSelectInit(response.CompanyId,function () {
                        $("#DepartmentId").val(response.DepartmentId);
                        posSelectInit($("#CompanyId").val(),function () {
                            $("#PositionId").val(response.PositionId);
                        });
                    });
                },
                error: function () {
                }
            });
        },
        allocation:function () {
            $('#userIn').empty();
            $("#userNotIn").empty();
            RequestByAjax({
                url: getRoleUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success: function (response) {
                    var htmlIn="";
                    for(var i=0;i<response.UserIn.length;i++){
                        htmlIn+=[
                            '<div class="checkbox-custom checkbox-primary">',
                            '<input type="checkbox" checked="" id='+ response.UserIn[i].Id +' value='+ response.UserIn[i].Id +'>',
                            '<label for='+response.UserIn[i].Id+'>'+response.UserIn[i].Name+'</label>',
                            '</div>'
                        ].join('')
                    };

                    $('#userIn').append(htmlIn);
                    var htmlNotIn="";
                    for(var i=0;i<response.UserNotIn.length;i++){
                        htmlNotIn+=[
                            '<div class="checkbox-custom checkbox-default">',
                            '<input type="checkbox" id='+ response.UserNotIn[i].Id +' value='+ response.UserNotIn[i].Id +'>',
                            '<label for='+response.UserNotIn[i].Id+'>'+response.UserNotIn[i].Name+'</label>',
                            '</div>'
                        ].join('')
                    };

                    $("#userNotIn").append(htmlNotIn);
                },
                error: function () {
                }
            });
        },
        authority:function () {
            $('#treeContent').empty();
            $('#treeContentData').empty();
            RequestByAjax({
                url: authoritylUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success:function (response) {
                    $('#treeContent').append('<div id="treeCheckbox"></div>');
                    $('#treeCheckbox').jstree({
                        'core' : {
                            'themes' : {
                                'responsive': false
                            },
                            'check_callback' : true,
                            'data':response.optionList
                        }
                    });
                    $('#treeContentData').append('<div id="treeCheckboxData"></div>');
                    $('#treeCheckboxData').jstree({
                        'core' : {
                            'themes' : {
                                'responsive': false
                            },
                            'check_callback' : true,
                            'data':response.dataList
                        }
                    });
                },
                error: function () {
                }
            });
        },
    }
    $('#addNewItem').on('click', function () {
        $('#editModalForm').find('input').val("");
    });
    $("#CompanyId").change(function () {
        $("#DepartmentId").empty();
        depSelectInit($(this).val());
        posSelectInit($(this).val());
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
    $('.modal-confirm.allocation').on('click', function (e) {
        var bindIds = new Array();
        $('#allocationModalForm').find('input[type=checkbox]:checked').each(function () {
            bindIds.push($(this).val());
        })
        var data={
            Id:$('#Id').val(),
            BindIds:bindIds
        }
        ModalDataSubmit({
            e:e,
            url:allocationUrl,
            data:JSON.stringify(data),
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
                    data: "UserName"
                },
                {
                    data: "RealName"
                },
                {
                    data: "CompanyName"
                },
                {
                    data: "DepartName"
                },
                {
                    data: "PositionName"
                },
                {
                    className:'actions table-td',
                    data:"Id",
                    render : function(data,type, row, meta) {
                        var trHtml='';
                        trHtml += '<button href="#modalEdit" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim edit mb-xs mt-xs mr-xs btn btn-xs btn-primary"><i class="fa fa-edit"></i> </button>';
                        trHtml += '<button href="#modalDelete" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim other mb-xs mt-xs mr-xs btn btn-xs btn-danger"><i class="fa fa-remove"></i> </button>';
                        trHtml += '<button href="#modalAllocation" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim allocation mb-xs mt-xs mr-xs btn btn-xs btn-info"><i class="fa fa-user"></i> </button>';
                        trHtml += '<button href="#modalAuthority" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim authority mb-xs mt-xs mr-xs btn btn-xs btn-success"><i class="fa fa-user-secret"></i> </button>';
                        return trHtml;
                    }
                }
            ],
            success: function () {
                ModalInit(beforeOpen);
                comSelectInit();
            }
        });
    };
    userManagerTableInit();
}).apply(this, [jQuery]);
