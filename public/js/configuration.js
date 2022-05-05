$(document).ready( function () {
    if($('#tabla-consulta').length > 0){
        run_datatable($('#tabla-consulta'));
    }
});
var dterror = 0;
function run_datatable(selector){
    var id = selector.attr('id'),
        dt_url = '/ajax_dt_catalogos',
        orden = [], //desc //asc //[[ 1, "asc" ]]
        columnas = [],
        t_url = selector.attr('data-url'),
        ordenar = selector.attr('data-ordenar'),
        titulo = 'SGMES - DGECI - '+selector.attr('data-name');
    if(t_url != null && t_url != '' ){ dt_url = t_url; }
    if(ordenar != null && ordenar != '' ){ orden = eval( ordenar ); if( orden[0][0] >= $('.w3-cyan>th').length ){orden[0][0] = 0;}; }
    $.each($('#'+id+' th'), function( i, value ) {
        columnas.push({ "data": $(this).attr('data-dbcol')});
    });
    $(document).on( 'preInit.dt', function (e, settings) {
        //STYLES SEARCH
        if (!$("#"+id+"_filter").hasClass("g-input")) {
            var div = '<div><span class="glyphicon glyphicon-search"></span></div>';
            $("#"+id+"_filter").addClass("g-input");
            $("#"+id+"_filter>label>input").prependTo("#"+id+"_filter");
            $("#"+id+"_filter>input").before(div);
        }
        //STYLES LIST
        if (!$("#"+id+"_length").hasClass("g-input")) {
            var div2 = '<div><span class="glyphicon glyphicon-th-list"></span></div>';
            $("#"+id+"_length").addClass('g-input');
            $("#"+id+"_length>label>select").prependTo("#"+id+"_length");
            $("#"+id+"_length>select").before(div2);
            $("#"+id+"_length>select").select2({width: '100%'});
            //////iniciar_select($("#"+id+"_length>select"));
        }
        //botones intro
        var parabtn = selector.attr('data-consulta');
        if(parabtn){
            mover_boton = '.btnmover[data-para=\'#'+id+'[data-consulta="'+parabtn+'"]\']:not([data-nomover])';
            if( $(mover_boton).length > 0 ){
                $.each($(mover_boton), function( i, value ) {
                    $(this).insertAfter( $('#'+id+'_length') );
                })
            }            
        }
        //IF EXIST FILTROS
        if( $('[id^="g_dt_filto_"]:not([data-nomover])').length > 0){
            $.each($('[id^="g_dt_filto_"]:not([data-nomover])'), function( i, value ) {
                $(this).insertAfter( $('#'+id+'_length') );
            });
        }
        //if existen botones especiales
        if($('#export_dgeci').length > 0){
            $("#"+id+"_wrapper > .dt-buttons > button.dt-button.buttons-excel").css({'display':'none'});
            $('#export_dgeci').insertAfter( $("#"+id+"_wrapper > .dt-buttons > button.dt-button.buttons-copy") );
        }
        
    } );
    $(document).on( 'responsive-resize.dt', function (e, settings) {
        if($('select.dt_select').length > 0){ 
            $('select.dt_select').select2({width: '100%'});
        }
    });
    selector.DataTable({
        serverSide: true,
        processing: true,
        ajax:{
            url: dt_url,
            type: 'POST',
            data: function(d){
                var re_dataAttr = /^data\-(.+)$/,
                    filtros = $('[id^="dt_filto_"][data-para=\'#'+selector.attr('id')+'[data-consulta="'+selector.attr('data-consulta')+'"]\']');
                d._token = $('meta[name="csrf-token"]').attr('content');
                $.each(selector.get(0).attributes, function(index, attr) {
                    if (re_dataAttr.test(attr.nodeName)) {
                        var key = attr.nodeName.match(re_dataAttr)[1];
                        d[key] = attr.nodeValue;
                    }
                });
                d.filtros = {};
                $.each(filtros, function( i, value ) {
                    var f_key = $(this).attr('data-key');
                    d.filtros[f_key] = $(this).val() == 0 ? null : $(this).val();
                });         
/*********PAGINACIÓN*******/
            if(d){
                var  newvar = {
                    m: d.length ? d.length : 10,
                    p: d.start ? d.start : 0,
                    o: d.order && d.order[0] ? d.order[0].column : 0,
                    c: d.order && d.order[0] ? d.order[0].dir : 'desc',
                    t: $(selector.DataTable().column( d.order && d.order[0] ? d.order[0].column : 0 ).header()).attr('data-dbcol'),
                };
                newvarurl(newvar,selector);
            }         
/****************/
            },
            beforeSend: function (request) {
                request.setRequestHeader("X-CSRF-TOKEN", $('meta[name="csrf-token"]').attr('content'));
            },
            //dataSrc:function (r){ },
            error: function (xhr, error, thrown) {
                dterror++;
                stop_datatable(selector);
                if(dterror < 3){
                    run_datatable(selector);
                } else { 
                    var txt;
                    var r = confirm("Error en el sevidor, tabla no cargo, ¿Desea recargar la página actual?");
                    if (r == true) {
                        location.reload();
                    } else {
                        selector.remove();
                        $('body>section.contenido').append( '<a class="btn" href="'+window.location.href+'">Recargar</a>' );
                    }
                }
            }
        },
        columns: columnas,
        dom: 'Blfrtip',
        buttons: selector.attr('data-name')=="Grid Convocatorias" ? [
            {extend:'colvis',text:'<span class="glyphicon glyphicon-list"></span> <span class="glyphicon glyphicon-chevron-down"></span>',className: 'btn'},
        ] : [
            {extend:'colvis',text:'<span class="glyphicon glyphicon-list"></span> <span class="glyphicon glyphicon-chevron-down"></span>',className: 'btn'},
            {extend:'copy',text:'<span class="glyphicon glyphicon-copy"> </span>',className: 'btn'},
            {extend:'excel',text:'XLSX <span class="glyphicon glyphicon-file"></span>',className: 'btn'},
            {
				extend:'pdfHtml5',
				text:'PDF <span class="glyphicon glyphicon-file"></span>',
                className: 'btn',
				orientation: 'landscape',
				pageSize: 'LEGAL',
				title: titulo,
				exportOptions: {
				    columns: ':visible',
				    stripNewlines: false
                },
				message: '',
				customize: function (doc) {
					doc.pageMargins = [10,10,10,50];
					doc.defaultStyle.fontSize = 10;
					doc.styles.tableHeader.fontSize = 10;
        			doc.styles.title.fontSize = 14;
					// Remove spaces around page title
                    doc.content[0].text = doc.content[0].text.trim();
					doc['footer']=(function(page, pages) {
                        return {
                			columns: [
                                formatDate_t(new Date())+' | '+titulo,
                                {
                                    alignment: 'right',
                                    text: ['Página  ', { text: page.toString() },  ' de ', { text: pages.toString() }]
                                }
                            ],
                			margin: [10, 10]
                        }
                    });
				}
            },
            {extend:'print',text:'<span class="glyphicon glyphicon-print"></span>',className: 'btn'}            
        ]
        ,
        order: orden,
        displayStart: (typeof getUrlVars()['p'] != 'undefined' && getUrlVars()['p'] != '' ) ? getUrlVars()['p'] : 0,
        iDisplayLength: (typeof getUrlVars()['m'] != 'undefined' && getUrlVars()['m'] != '' ) ? getUrlVars()['m'] : 10,
        lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "Todos"] ],
        responsive: true,
        language: { "url": "/js/ui/table/datatables-espanol.json" },
        columnDefs: [
            { orderable: false, targets: "no_ordenar" },
            { type: 'locale-compare', targets: 1 } ,
        ],
        drawCallback: function (settings,json) { 
            $('.dataTables_paginate .paginate_button').addClass('btn');
            if($('select.dt_select').length > 0){ $('select.dt_select').select2({width: '100%'}); }
            buscar_finciones_extra_grid();
        },
        initComplete: function(settings, json) {}
    });
}
//function get_dt_data(d,selector){}
function stop_datatable(selector){selector.dataTable().fnDestroy();}
$(document).on('change', '[id^="dt_filto_"]', function (e) {
    //ACTUALIZA URL
    var url = document.URL,
        url_s = location.protocol + '//' + location.host + location.pathname,
        key = $(this).attr('data-key'),
        cadenaparamentros = '?',
        url_final = url_s;
    //no hay variables
    if (getUrlVars()[0] == url_s || getUrlVars()[0] == ''){
    	 if($(this).val() != 0){
             cadenaparamentros += key+'='+$(this).val()+'&';
        } 
    }else{
        $.each(getUrlVars(), function( i, value ) {
            if(typeof getUrlVars()[value] != 'undefined' && getUrlVars()[value] != '' && value != key ){
                cadenaparamentros += value+'='+getUrlVars()[value]+'&';
            }
        });
        if($(this).val() != 0){
            cadenaparamentros += key+'='+$(this).val()+'&';
       } 
    }
    if(cadenaparamentros.endsWith("&") || cadenaparamentros.endsWith("?") ) {
        cadenaparamentros = cadenaparamentros.slice(0,-1);
    }
    url_final = url_final+cadenaparamentros;
    history.pushState(null, null, url_final);
    //ACTUALIZA TABLA
    var para = $(this).attr('data-para');
    $(para).DataTable().ajax.reload()
});
function formatDate_t(date) {
  var monthNames = ["Enero", "Febrero", "Marzo","Abril", "Mayo", "Junio", "Julio","Agosto", "Septiembre", "Octubre","Noviembre", "Diciembre"];
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  var hota = date.getHours() +':'+ (date.getMinutes()<10?'0':'') + date.getMinutes() +':'+ (date.getSeconds()<10?'0':'') + date.getSeconds();
  return day + ' de ' + monthNames[monthIndex] + ' de ' + year + ', ' +hota;
  //return day + ' de ' + monthNames[monthIndex] + ' de ' + year;
}

var inicialsorting = $('.w3-cyan>th:nth-child(1)').attr('data-dbcol');
var valor2 = 'desc';
$(document).ready( function () {
    inicialsorting = $('.w3-cyan>th:nth-child(1)').attr('data-dbcol');
});
//utl orden
function newvarurl(data,selector){
    //ACTUALIZA URL
    var url = document.URL,
        url_s = location.protocol + '//' + location.host + location.pathname,
        ke1 = 'm',
        ke2 = 'p',
        ke3 = 'o',
        ke4 = 'c',
        ke5 = 't',
        cadenaparamentros = '?',
        url_final = url_s;
    //atrubutos defaul
        var vdo = $(selector).attr('data-do'),
            vdc = $(selector).attr('data-dc'),
            vdt = $(selector).attr('data-dt');
    if(!(typeof vdo !== typeof undefined && vdo !== false)) {
        vdo = 0;
    }
    if(!(typeof vdc !== typeof undefined && vdc !== false)) {
        vdc = 'desc';
    }
    if(!(typeof vdt !== typeof undefined && vdt !== false)) {
        vdt = $(selector.DataTable().column( vdo ).header()).attr('data-dbcol');
    }
    if (getUrlVars()[0] == url_s || getUrlVars()[0] == ''){
    }else{
        $.each(getUrlVars(), function( i, value ) {
            if(
                typeof getUrlVars()[value] != 'undefined'
                    && 
                getUrlVars()[value] != '' 
                    && 
                value != ke1 
                    && 
                value != ke2 
                    && 
                value != ke3
                    && 
                value != ke4 
                    && 
                value != ke5 
            ){
                cadenaparamentros += value+'='+getUrlVars()[value]+'&';
            }
        });
    }
    if(data.m != 10){
        cadenaparamentros += ke1+'='+data.m+'&';
    }
    if(data.p != 0){
        cadenaparamentros += ke2+'='+data.p+'&';
    }
    if(data.c != vdc || data.o != vdo ){
        cadenaparamentros += ke3+'='+data.c+'&';
    }
    if(data.o != vdo){
        cadenaparamentros += ke4+'='+data.o+'&';
    }
    if(data.t != vdt){
        cadenaparamentros += ke5+'='+data.t+'&';
    }
    if(cadenaparamentros.endsWith("&") || cadenaparamentros.endsWith("?") ) { cadenaparamentros = cadenaparamentros.slice(0,-1); }
    url_final = url_final+cadenaparamentros;
    history.pushState(null, null, url_final);    
}
//funciones adicionales
function buscar_finciones_extra_grid(){
	var selector_data = $('table [data-fextra]');
	if( selector_data.length ){
        var funciones = [];
        $.each(selector_data, function(k, i) {
            funciones.push($(this).attr('data-fextra')); 
        });
        $.each(funciones.unique(), function(k, i) {
            var nombrefuncion = i.replace(/\(.*?\)/g,''),
                evaluar =  "typeof "+nombrefuncion+" !== 'undefined' && jQuery.isFunction( "+nombrefuncion+" )",
                ejecutar = i;
            if(eval(evaluar)){
                eval(ejecutar);
            } else {
                $('[data-fextra="'+i+'"]').removeAttr('data-fextra');
            }
        });
	}
}
function ajax_contadores_grid_convo(){
	var selector_data = $('[data-id-tableajax]:first');
	var url = $('#tabla-consulta').data('url');
	if( selector_data.length ){
		var id_convocatoria = selector_data.data('id-tableajax');
		var data = { id: id_convocatoria, consulta:'contadores_conv' }
		send_ajax_gobal(url,data);
	}
}
function ajax_cargar_contadores_grid(id = null,data){
	var tabla = $('#tabla-consulta').DataTable();
    var selector1 = $('[data-id-tableajax="'+id+'"][data-type="ajax_nies"]').parent();
	if(selector1.length){
        var nies = tabla.cell( selector1 );
            nies.data(data.nies);
    };
    var selector2 = $('[data-id-tableajax="'+id+'"][data-type="ajax_npai"]').parent();
    if(selector2.length){
        var npai = tabla.cell( selector2 );
            npai.data(data.npai);
    };
    var selector3 = $('[data-id-tableajax="'+id+'"][data-type="ajax_nsol"]').parent();
    if(selector3.length){
        var nsol = tabla.cell( selector3 );
            nsol.data(data.nsol);
    };
    var selector4 = $('[data-id-tableajax="'+id+'"][data-type="ajax_nlug"]').parent();
    if(selector4.length){
        var nlug = tabla.cell( selector4 );
            nlug.data(data.nlug);
    };
    var selector5 = $('[data-id-tableajax="'+id+'"][data-type="ajax_nasi"]').parent();
    if(selector5.length){
        var nasi = tabla.cell( selector5 );
            nasi.data(data.nasi);
    };
    var selector6 = $('[data-id-tableajax="'+id+'"][data-type="ajax_nasm"]').parent();
    if(selector6.length){
        var nasm = tabla.cell( selector6 );
            nasm.data(data.nasm);
    };
    ajax_contadores_grid_convo();
}
$(document).on('click', '.dt-button.buttons-columnVisibility', function (e) {
    ajax_contadores_grid_convo();
});