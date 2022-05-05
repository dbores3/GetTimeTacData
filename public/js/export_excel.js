//EXPORT EXCEL
$(document).on('click', '[data-export-excel-ies]', function (event) {
    send_ajax_gobal(
      '/consulta_excel',
      {
        tipo: 'descargar_excel_gestionar_grid',
        id_convocatoria:$(this).attr('data-idconv')
      },
      '|eval|',
      'set_load("Generando EXCEL")'
    );
  })
  function descargar_excel_gestionar_grid(res){
    var convo_nombre = $("#convo_nombre").val();
    var a = jQuery('<a>',{
          id:"downconsulta",
          download:'Solicitudes en seguimiento - '+convo_nombre+' }}.xls',
          'data-table':'aexportar',
          'data-hoja':'Consultas por IES',
          //html:''
        }),
      table = jQuery('<table>',{
          id:"aexportar",
        }).append(res.datos);
    $('#hidemodal').append(table);
    $('#hidemodal').append(a);
    $('#downconsulta')[0].click();
    $('#aexportar,#downconsulta').remove();
  }
  $(document).on('click', '#downconsulta', function (event) {
    var tabla = $(this).attr('data-table'),
      hoja = $(this).attr('data-hoja');
    return ExcellentExport.excel(this, tabla, hoja);
  })
  