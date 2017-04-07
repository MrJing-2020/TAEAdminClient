;
(function ($) {
    var listUrl = 'api/Admin/RoleManager/AllRoles';
    var detailUrl = 'api/Admin/RoleManager/GetRoleDetail';
    var subDataUrl = 'api/Admin/RoleManager/SubRoleData';
    var getRoleAuthorityUrl='api/Admin/Authority/GetRoleAuthority';
    var updateAuthorityUrl='api/Admin/Authority/UpdateAuthority';
    var delUrl = "";
    //打开弹窗前执行
    var beforeOpen = {
        edit: function () {
            RequestByAjax({
                url: detailUrl,
                type: 'GET',
                data: {id: $('#Id').val()},
                success: function (response) {
                    $('#Name').val(response.Name);
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
                    className: 'actions table-td',
                    data: "Id",
                    render: function (data, type, row, meta) {
                        var trHtml = '';
                        trHtml += '<button href="#modalEdit" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim edit mb-xs mt-xs mr-xs btn btn-xs btn-primary"><i class="fa fa-edit"></i> </button>';
                        trHtml += '<button href="#modalDelete" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim other mb-xs mt-xs mr-xs btn btn-xs btn-danger"><i class="fa fa-remove"></i> </button>';
                        trHtml += '<button href="#modalAllocation" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim allocation mb-xs mt-xs mr-xs btn btn-xs btn-info"><i class="fa fa-user"></i> </button>';
                        trHtml += '<button href="#modalAllocation" onclick="InitKey(this)" trkey="' + data + '" class="modal-with-zoom-anim allocation mb-xs mt-xs mr-xs btn btn-xs btn-warning"><i class="fa fa-database"></i> </button>';
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
