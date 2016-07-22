var html = '<p align="center"><font size="2"> </font></p> <p><font size="2">{{Date}}</font></p> <p><font size="2"><strong style="font-size: small;">COMPANY, Inc</strong><span style="font-size: small;">.<br /></span><br /></font></p> <p><font size="2">COMPANY ADDRESS</font>'; 


var testPDF = new GeneralForm({ 
tableId : "e8caedcbc0a80164017df472f39eaed1", 
tableName : "incident", 
targetTable : "incident", 
targetId : "e8caedcbc0a80164017df472f39eaed1", 
generalDebug : null, 
mode : 'pdf', 
pageSize: 'Legal' 
}); 

gs.log(testPDF.pageSize); 


testPDF.start(); 
testPDF.document.addHTML(html); 
testPDF.createPDF();
