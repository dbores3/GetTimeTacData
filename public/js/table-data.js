// @des Datable configuration and buttons to be used
$(document).ready(function() {
    $('#usersTable').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            {
                text: 'Export as CSV',
                action: function ( e, dt, node, config ) {
                    var type = 'CSV'
                    download_file(type)
                }
            },
            {
                text: 'Export as JSON',
                action: function ( e, dt, node, config ) {
                    var type = 'JSON'
                    download_file(type)
                }
            },
            {
                text: 'Export as HTML',
                action: function ( e, dt, node, config ) {
                    var type = 'HTML'
                    download_file(type)
                }
            }
        ]
    } );
} );
