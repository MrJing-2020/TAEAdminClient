//table结构初始化
function TableInit(param) {
    if(param.tableType=="default"){
        $(param.table).dataTable({
            serverSide: true,   //启用服务器端分页
            searching: false,    //禁用原生搜索
            processing: false,
            ajax : function(data, callback, settings) {
                var orderName=data.columns[(data.order[0].column)].data;
                RequestByAjax({
                    url:param.ajax.url,
                    type:param.ajax.type,
                    data:{
                        "pageNumber":(data.start/data.length)+1,
                        "pageSize":data.length,
                        "orderName":orderName,
                        "orderType":data.order[0].dir,
                        "search":{}
                    },
                    success:function (response) {
                        var returnData = {
                            draw : data.draw,
                            recordsTotal : response.Total,
                            recordsFiltered : response.Total,//后台不实现过滤功能，每次查询均视作全部结果
                            data : response.DataList
                        };
                        callback(returnData);
                        //初始化模态框
                        ModalInit(param.success);
                        $('.modal-dismiss').click(function (e) {
                            e.preventDefault();
                            $.magnificPopup.close();
                        });
                    } ,
                    error:param.ajax.error
                })
            },
            "columns":param.columns,
            fnInitComplete: function(settings, json) {
                // select 2
                if ($.isFunction($.fn['select2'])) {
                    $('.dataTables_length select', settings.nTableWrapper).select2({
                        minimumResultsForSearch: -1
                    });
                }

                var options = $('table', settings.nTableWrapper).data('plugin-options') || {};

                // search
                var $search = $('.dataTables_filter input', settings.nTableWrapper);

                $search
                    .attr({
                        placeholder: typeof options.searchPlaceholder !== 'undefined' ? options.searchPlaceholder : 'Search'
                    })
                    .addClass('form-control');

                if ($.isFunction($.fn.placeholder)) {
                    $search.placeholder();
                }
            },
            sDom: "<'row datatables-header form-inline'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>r><'table-responsive't><'row datatables-footer'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6'p>>",
            oLanguage: {
                sLengthMenu: '_MENU_ 显示条数',
                sProcessing: '<i class="fa fa-spinner fa-spin"></i> Loading',
                "sZeroRecords":  "没有匹配结果",
                "sInfo":         "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
                "sInfoEmpty":    "当前显示第 0 至 0 项，共 0 项",
                "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                "sInfoPostFix":  "",
                // "sSearch":       "搜索:",
                "sUrl":          "",
                "sEmptyTable":     "表中数据为空",
                "sLoadingRecords": "载入中...",
                "sInfoThousands":  ",",
                "oPaginate": {
                    "sFirst":    "首页",
                    "sPrevious": "上页",
                    "sNext":     "下页",
                    "sLast":     "末页",
                    "sJump":     "跳转"
                },
                "oAria": {
                    "sSortAscending":  ": 以升序排列此列",
                    "sSortDescending": ": 以降序排列此列"
                }
            },
        });
    }
    else if(param.tableType=="details"){
        detailsTableInit(param.table)
    }
    else if(param.tableType=="tabletools"){
        tabletoolsTableInit(param.table)
    }
    else if(param.tableType=="all"){
        detailsTableInit(param.table);
        tabletoolsTableInit(param.table)
    }
    else {
        $(param.table).dataTable();
    }
};
function detailsTableInit(tableSelector){
    var $table = $(tableSelector);
    // format function for row details
    var fnFormatDetails = function( datatable, tr ) {
        var data = datatable.fnGetData( tr );

        return [
            '<table class="table mb-none">',
            '<tr class="b-top-none">',
            '<td><label class="mb-none">Rendering engine:</label></td>',
            '<td>' + data[1]+ ' ' + data[4] + '</td>',
            '</tr>',
            '<tr>',
            '<td><label class="mb-none">Link to source:</label></td>',
            '<td>Could provide a link here</td>',
            '</tr>',
            '<tr>',
            '<td><label class="mb-none">Extra info:</label></td>',
            '<td>And any further details here (images etc)</td>',
            '</tr>',
            '</div>'
        ].join('');
    };
    // insert the expand/collapse column
    var th = document.createElement( 'th' );
    var td = document.createElement( 'td' );
    td.innerHTML = '<i data-toggle class="fa fa-plus-square-o text-primary h5 m-none" style="cursor: pointer;"></i>';
    td.className = "text-center";

    $table
        .find( 'thead tr' ).each(function() {
        this.insertBefore( th, this.childNodes[0] );
    });

    $table
        .find( 'tbody tr' ).each(function() {
        this.insertBefore(  td.cloneNode( true ), this.childNodes[0] );
    });
    // initialize
    var datatable = $table.dataTable({
        aoColumnDefs: [{
            bSortable: false,
            aTargets: [ 0 ]
        }],
        aaSorting: [
            [1, 'asc']
        ]
    });
    // add a listener
    $table.on('click', 'i[data-toggle]', function() {
        var $this = $(this),
            tr = $(this).closest( 'tr' ).get(0);

        if ( datatable.fnIsOpen(tr) ) {
            $this.removeClass( 'fa-minus-square-o' ).addClass( 'fa-plus-square-o' );
            datatable.fnClose( tr );
        } else {
            $this.removeClass( 'fa-plus-square-o' ).addClass( 'fa-minus-square-o' );
            datatable.fnOpen( tr, fnFormatDetails( datatable, tr), 'details' );
        }
    });
};
function tabletoolsTableInit(tableSelector){
    var $table = $(tableSelector);
    $table.dataTable({
        sDom: "<'text-right mb-md'T>" + $.fn.dataTable.defaults.sDom,
        oTableTools: {
            sSwfPath: $table.data('swf-path'),
            aButtons: [
                {
                    sExtends: 'pdf',
                    sButtonText: 'PDF'
                },
                {
                    sExtends: 'csv',
                    sButtonText: 'CSV'
                },
                {
                    sExtends: 'xls',
                    sButtonText: 'Excel'
                },
                {
                    sExtends: 'print',
                    sButtonText: 'Print',
                    sInfo: 'Please press CTR+P to print or ESC to quit'
                }
            ]
        }
    });
}

