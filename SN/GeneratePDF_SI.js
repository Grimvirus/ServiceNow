/**
 * PFGeneralForm would be to extend GeneralForm and then override all of the methods in the extension.
 *
 * @author SERVICE-NOW\Cailiang.Xu
 */
var PFGeneralForm = Class.create();

/**
 * Utility to create a PDF for the form
 * @param table, table id, target table, target id
 */
PFGeneralForm.generate = function(name, sys_id, targetTable, targetId, fileName, html) {
	gs.log("Incoming -> PFGeneralForm.generate");
	var PFgeneralForm = new PFGeneralForm({
		tableId : (sys_id) ? sys_id : null,
		tableName : name,
		targetTable : targetTable,
		targetId : targetId,		
		generalDebug : null,
		mode : 'pdf',
		fileName : fileName
	});
	
	PFgeneralForm.start();
	PFgeneralForm.document.addHTML(html); 
	PFgeneralForm.createPDF();
	
};

var PFgeneralForm = {
	initialize : function() {
		GeneralForm.prototype.initialize.apply(this, arguments);
	},
	
	_setFileName : function() {
		gs.log("Coming into _setFileName");
		return;
	},
	
	type : 'PFGeneralForm'
};
PFGeneralForm.prototype = Object.extendsObject(GeneralForm, PFgeneralForm);
