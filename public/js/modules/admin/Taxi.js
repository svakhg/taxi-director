/**
 * Javascript for DIST 2.
 *
 * @category Dist
 * @author Victor Villca <victor.villca@people-trust.com>
 * @copyright Copyright (c) 2012 Gisof A/S
 * @license Proprietary
 */

var com = com || {};
com.em = com.em ||{};
	com.em.Taxi = function () {
		// For create or update register
		this.dialogForm;
		// For show message to client
		this.alert;
		// For data table
		this.table;
		// urls
		this.url = {};
		this.validator;
		
		this.initFlashMessage();
		//this.initEvents();
		
		this.dtHeaders = undefined;
		this.actionSort = undefined;
	};
com.em.Taxi.prototype = {

	/**
	 * Initializes JQuery flash message component
	 */
	initFlashMessage: function() {
		this.alert = new com.em.Alert();
	},

	/**
	 * Initializes Display start of datatable
	 */
	initDisplayStart: function() {with(this) {
		var oSettings = table.fnSettings();
		oSettings._iDisplayStart = 0;
	}},

	/**
	 * Sets headers of datatable
	 * @param pheaders
	 */
	setHeaders: function(pheaders){with(this) {
		pheaders = typeof pheaders !== 'undefined' ? pheaders : dtHeaders;

		if (typeof dtHeaders === 'undefined') {
			dtHeaders = pheaders;
		}

		var headers = pheaders['headerArray'];
		
		$("#datatable-headers").empty();

		for ( var i = 0; i < headers.length; i++) {
			$("#datatable-headers").append('<th>'+headers[i]+'</th>');
		}

		$("#datatable-headers").prepend('<th >Id</th>');
	}},

	/**
	 * Configures the table and elements
	 * @param selector
	 */	
	configureTable: function(selector, pdestroy) { with (this) {
		table = $(selector).dataTable({
			"bProcessing"   : true,
			"bFilter"       : false,
			"bSort"         : false,
			"bInfo"         : false, 
			"bLengthChange" : false,
			"bServerSide"   : true,
			"sAjaxSource"   : url.toTable,
			"aoColumns"     : getColumns(),
			"oLanguage": {
				"sUrl": "/js/lib/jquery-datatables/languages/dataTables.spanish.txt"
			},
			"fnDrawCallback": function() {
				clickToUpdate('#tblTaxi a[id^=update-taxi-]');
			},

			"fnServerData": function (sSource, aoData, fnCallback ) {
				$.getJSON(sSource, aoData, function (json) {
					fnCallback(json);
				});
			}
		});
		$(selector).width("100%");
	}},

	configureTable2: function(selector, pdestroy) { with (this) {
		table = $(selector).dataTable({
			"bProcessing"   : false,
			"bFilter"       : false,
			"bSort"         : false,
			"bInfo"         : false, 
			"bLengthChange" : false,
			"bServerSide"   : true,
			"sAjaxSource"   : url.toTable,
			"aoColumns"     : getColumns2(),
			"oLanguage": {
				"sUrl": "/js/lib/jquery-datatables/languages/dataTables.spanish.txt"
			},
			"fnDrawCallback": function() {
				//clickToShowTaxi('#tblTaxi a[id^=update-taxi-]');
			},

			"fnServerData": function (sSource, aoData, fnCallback ) {
				$.getJSON(sSource, aoData, function (json) {
					fnCallback(json);
				});
			}
		});
		$(selector).width("100%");
	}},

	/**
	 * Gets columns configuration for datatable
	 * @return Array
	 */
	getColumns: function() {with (this) {
		var columns = new Array;
		//Sets every element of the table headers
		columns.push({bVisible:false});
		columns.push({
			"sWidth": "15%",
			"bSercheable": "true",
			fnRender : function (oObj){
				if(oObj.aData[0] > 0) {
					return '<a id="update-taxi-'+oObj.aData[0]+'" href="'+url.toUpdate+'/id/'+oObj.aData[0]+'">'+oObj.aData[1]+'</a>';
				} else {
					return '<a id="create-taxi" href="/admin/Taxi/add">'+oObj.aData[1]+'</a>';
				}				
			}
			});
		return columns;
	}},

	getColumns2: function() {with (this) {
		var columns = new Array;
		//Sets every element of the table headers
		columns.push({bVisible:false});
		columns.push({
			"sWidth": "15%",
			"bSercheable": "true",
			fnRender : function (oObj){
				return '<a id="update-taxi-'+oObj.aData[0]+'" href="#" onclick="centerTaxi('+oObj.aData[0]+');return false;">'+oObj.aData[1]+'</a>';
				}
			});
		return columns;
	}},

	/**
	 * Shows proccessing display for data table
	 * @param bShow boolean
	 */
	processingDisplay: function(bShow) {
		var settings = table.fnSettings();
		settings.oApi._fnProcessingDisplay(settings, bShow);
	},

	/**
	 *
	 * Configures the form
	 * @param selector (dialog of form)
	 */
	configureDialogForm: function(selector) {with (this) {
		dialogForm = $(selector).dialog({
			autoOpen: false,
			height: 525,
			width: 475,
			modal: true,
			close: function(event, ui) {
				$(this).remove();
			}
		});
		// Configs font-size for header dialog and buttons
		$(selector).parent().css('font-size','0.7em');
	}},

	/**
	 * Opens dialog and manages the creation of new register
	 * @param selector
	 */
	clickToAdd: function(selector) {with (this) {
		$(selector).bind('click',function(event) {
			event.preventDefault();
			// Begins to get data
			var action = $(this).attr('href');
			// Sends request by ajax
			$.ajax({
				url: action ,
				type: "GET",
				beforeSend : function(XMLHttpRequest) {
					processingDisplay(true);
				},

				success: function(data, textStatus, XMLHttpRequest) {
					if (textStatus == 'success') {
						var contentType = XMLHttpRequest.getResponseHeader('Content-Type');
						if (contentType == 'application/json') {
							alert.show(data.message, {header: com.em.Alert.FAILURE});
						} else {
							// Getting html dialog
							$('#dialog').html(data);
							// Configs dialog
							configureDialogForm('#dialog-form', 'insert');
							// Sets validator
							setValidatorForm("#formId");
							// Opens dialog
							$('#dialog-form').dialog('open');
							$('#dialog-form').dialog( "option" , 'buttons', dialogButtons);
							// Loads buttons for dialog. dialogButtons is defined by ajax
							$('#dialog-form').dialog( "option" , 'buttons', dialogButtons);
						}
					} 
				},

				complete: function(jqXHR, textStatus) {
					processingDisplay(false);
				},

				error: function(jqXHR, textStatus, errorThrown) {
					$('#dialog-form').dialog('close');
					alert.flashError(errorThrown,{header : com.em.Alert.ERROR});
				}
			});
		});
	}},

	/**
	 * Opens dialog and manages the update of register
	 * @param selector
	 */
	clickToUpdate: function(selector) {with (this) {
		$(selector).bind('click',function(event) {
			event.preventDefault();
			// Begins to get data
			var action = $(this).attr('href');
			// Sends request by ajax
			$.ajax({
				url: action,
				type: "GET",
				beforeSend: function(XMLHttpRequest) {
					processingDisplay(true);
				},

				success: function(data, textStatus, XMLHttpRequest) {
					if (textStatus == 'success') {
						var contentType = XMLHttpRequest.getResponseHeader('Content-Type');
						if (contentType == 'application/json') {
							alert.show(data.message, {header: com.em.Alert.FAILURE});
						} else {
							// Getting html dialog
							$('#dialog').html(data);
							// Configs dialog
							configureDialogForm('#dialog-form', 'update');
							// Sets validator
							setValidatorForm("#formId");
							// open dialog
							dialogForm.dialog('open');
							// Loads buttons for dialog. dialogButtons is defined by ajax
							dialogForm.dialog( "option" , 'buttons' , dialogButtons);
						}
					} 
				},

				complete: function(jqXHR, textStatus) {
					processingDisplay(false);
				},

				error: function(jqXHR, textStatus, errorThrown) {
					dialogForm.dialog('close');
					alert.flashError(errorThrown,{header: com.em.Alert.ERROR});
				}
			});
		});
	}},

	/**
	 * Deletes n items
	 * @param selector
	 */
	clickToDelete: function(selector) {with (this) {
		$(selector).bind('click',function(event) {
			event.preventDefault();
			// Serializes items checked
			var items = $('#tblTaxi :checked');
			var itemsChecked = items.serialize();
			if (itemsChecked == '') {
				alert.flashInfo('No hay registro seleccionado', {header: com.em.Alert.NOTICE});
				return;
			}
			var action = $(this).attr('href');

			jConfirm('Estas seguro de Eliminar ?', 'Eliminar Administrador', function(r) {
				if (r) {
					$.ajax({
						dataType: 'json', 
						type: "POST", 
						url: action,
						// Gets element checkbox checked
						data: itemsChecked,
						beforeSend : function(XMLHttpRequest) {
							processingDisplay(true);
						},
						
						success: function(data, textStatus, XMLHttpRequest) {
							if (textStatus == 'success') {
								if (data.success) {
									table.fnDraw();
									alert.flashSuccess(data.message, {header: com.em.Alert.SUCCESS});
								} else {
									alert.flashInfo(data.message, {header: com.em.Alert.NOTICE});
								}
							}
						},

						complete: function(jqXHR, textStatus) {
							processingDisplay(false);
						},

						error: function(jqXHR, textStatus, errorThrown) {
							alert.flashError(errorThrown,{header: com.em.Alert.ERROR});
						}
					});
				} else {
					return;
				}
			});
		});
	}},

	/**
	 * Repaints the table
	 */
	repaintTable: function() {
		table.fnDraw();
	},

	/**
	 * Configures the name autocomplete of the filter
	 * @param selector
	 */
	configureAuto: function(selector) { with (this) {
		$(selector).autocomplete({
			source: function(request, response) {
				$.ajax({
					url: url.toAutocomplete,
					dataType: 'json',
					data: {name_auto: request.term},
					success: function(data, textStatus, XMLHttpRequest) {
						response($.map(data.items, function(item) {
							return {
								label: item
							};
						}));
					}
				});
			}
		});
	}},

	/**
	 * Validates Taxi form
	 * @param selector
	 */
	setValidatorForm : function(selector) {
		validator = $(selector).validate({
			rules:{
				'firstName':{
					required: true,
					maxlength: 45
				},
				'lastName':{
					required: true,
					maxlength: 45
				},
				'ci':{
					number: true,
					required: true,
					maxlength: 15
				},
				'number':{
					number: true,
					required: true,
					maxlength: 10
				},
				'phone':{
					number: true,
					required: true,
					maxlength: 15
				},
				'mark':{
					required: true,
					maxlength: 45
				},
				'plaque':{
					required: true,
					maxlength: 45
				},
				'typeMark':{
					maxlength: 45
				},
				'model':{
					number: true,
					maxlength: 45
				},
				'color':{
					maxlength: 45
				}
			},
			messages: {
				'firstName': 'Ingrese su nombre',
				'lastName': 'Ingrese su apellido',
				'ci': {
					required: 'Ingrese su cedula de Identidad',
					number: 'Ingrese un numero valido',
					maxlength: 'Por favor, introduzca un maximo de 15 caracteres.'
				}
			}
		});
	},

	/**
	 * Sets url for action side server
	 * @param url json
	 */
	setUrl: function(url) {
		this.url = url;
	},

	/**
	 * Gets number position of name in array data
	 * @param array containing sub-arrays with the structure name->valname, value->valvalue
	 * @param name is the string we are looking for and must match with valname
	 */
	getPosition: function(data, name) {
		var pos = -1;
		for ( var i = 0; i < data.length; i++) {
			if (data[i].name == name) {
				pos = i;
			}
		}
		return pos;
	},

	/**
	 * Shows alert if it exists, if not create a new instance of alert and show it
	 * @param message to show
	 * @param header of the message
	 */
	showAlert: function(message, header) {with (this) {
		if (this.alert == undefined) {
			this.alert = new com.em.Alert();
		}
		alert.show(message, header);
	}},

	/**
	 * Shows flash message success if it exists, if not creates a new instance of flash message success and shows it.
	 * @param message string
	 * @param header string
	 */
	flashSuccess: function(message, header) {with (this) {
		if (this.alert == undefined) {
			this.alert = new com.em.Alert();
		}
		alert.flashSuccess(message, header);
	}},

	/**
	 * Shows flash message error if it exists, if not creates a new instance of flash message error and shows it.
	 * @param message string
	 * @param header string
	 */
	flashError: function(message, header) {with (this) {
		if (this.alert == undefined) {
			this.alert = new com.em.Alert();
		}
		alert.flashError(message, header);
	}}
};