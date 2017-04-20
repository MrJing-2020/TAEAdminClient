;
(function ($) {
    var listUrl = 'api/Admin/RoleManager/AllRoles';
    var detailUrl = 'api/Admin/RoleManager/GetRoleDetail';
    var subDataUrl = 'api/Admin/RoleManager/SubRoleData';
    var getRoleAuthorityUrl='api/Admin/Authority/GetRoleAuthority';
    var updateAuthorityUrl='api/Admin/Authority/UpdateAuthority';
    var getRoleDataAuthorityUrl='api/Admin/Authority/GetRoleDataAuthority';
    var updateDataAuthorityUrl='api/Admin/Authority/UpdateDataAuthority';
    var getAllCompanyUrl='api/Admin/Organization/ComSelectList';

    var delUrl = "";
    //填充公司下拉框数据
    var comSelectInit=function () {
        RequestByAjax({
            url: getAllCompanyUrl,
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
            },
            error: function () {
            }
        })
    }
    //打开弹窗前执行
    var beforeOpen = {
        edit: function () {
            RequestByAjax({
                url: detailUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success: function (response) {
                    $('#Name').val(response.Name);
                    $('#CompanyId').val(response.CompanyId);
                },
                error: function () {
                }
            })
        },
        allocation:function () {
            $('#treeContent').empty();
            RequestByAjax({
                url: getRoleAuthorityUrl,
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
                            'data':response
                        },
                        'plugins': ['checkbox']
                    })
                },
                error: function () {
                }
            });
        },
        allocationData:function () {
            $('#treeContentData').empty();
            RequestByAjax({
                url: getRoleDataAuthorityUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success:function (response) {
                    $('#treeContentData').append('<div id="treeCheckboxData"></div>');
                    $('#treeCheckboxData').jstree({
                        'core' : {
                            'themes' : {
                                'responsive': false
                            },
                            'check_callback' : true,
                            'data':response
                        },
                        'plugins': ['checkbox']
                    })
                },
                error: function () {
                }
            });
        }
    };
    $('#addNewItem').on('click', function () {
        $('#editModalForm').find('input').val("");
    });
    //弹窗数据提交
    $('.modal-confirm.edit').on('click', function (e) {
        ModalDataSubmit({
            e:e,
            url:subDataUrl,
            data:JSON.stringify($("#editModalForm").serializeNestedObject()),
            reload:true
        });
    });
    $('.modal-confirm.allocation').on('click', function (e) {
        var data={
            Id:$('#Id').val(),
            BindIds:[]
        }
        data.BindIds= $('#treeCheckbox').jstree('get_selected');
        ModalDataSubmit({
            e:e,
            url:updateAuthorityUrl,
            data:JSON.stringify(data),
            reload:true
        });
    });
    $('.modal-confirm.allocationData').on('click', function (e) {
        var data={
            Id:$('#Id').val(),
            BindIds:[]
        }
        data.BindIds= $('#treeCheckboxData').jstree('get_selected');
        ModalDataSubmit({
            e:e,
            url:updateDataAuthorityUrl,
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
                    className: 'actions table-td',
                    data: "Id",
                    render: function (data, type, row, meta) {
                        var trHtml = '';
                        trHtml += '<button href="#modalEdit" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim edit mb-xs mt-xs mr-xs btn btn-xs btn-primary authority-action authority-edit authority-hidden"><i class="fa fa-edit"></i> </button>';
                        trHtml += '<button href="#modalDelete" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim other mb-xs mt-xs mr-xs btn btn-xs btn-danger"><i class="fa fa-remove"></i> </button>';
                        trHtml += '<button href="#modalAllocation" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim allocation mb-xs mt-xs mr-xs btn btn-xs btn-info"><i class="fa fa-user"></i> </button>';
                        trHtml += '<button href="#modalAllocationData" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim allocationData mb-xs mt-xs mr-xs btn btn-xs btn-warning"><i class="fa fa-database"></i> </button>';
                        return trHtml;
                    }
                }
            ],
            success: function () {
                //按权限显示按钮
                ShowActionbtn('rolemanager');
                ModalInit(beforeOpen);
                comSelectInit();
            }
        });
    };
    userManagerTableInit();
}).apply(this, [jQuery]);
