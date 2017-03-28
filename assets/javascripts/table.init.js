//table结构初始化
function tableInit(tableSelector,type) {
    if(type=="default"){
        $(tableSelector).dataTable();
    }
    else if(type=="details"){
        detailsTableInit(tableSelector)
    }
    else if(type=="tabletools"){
        tabletoolsTableInit(tableSelector)
    }
    else if(type=="all"){
        detailsTableInit(tableSelector);
        tabletoolsTableInit(tableSelector)
    }
    else {
        $(tableSelector).dataTable();
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
