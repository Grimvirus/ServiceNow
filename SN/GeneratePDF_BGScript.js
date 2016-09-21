var cert = '<br/><br/><br/><h1><strong>CAD/PDM</strong></h1><br/><h3>Computer Aided Design / Product Data Management</h3><br/><span style="align:center"><img align="middle" src="https://dev15176.service-now.com/line.png" width="400px" height="5px"/></span><br/><h3>Global Application Lifecycle Management</h3><h3>presents this certificate to</h3><br/><br/><h1><strong>Oliver Dösereck</strong></h1><h2>123456</h2><br/><br/><h3>In recognition of professional</h3><h3>achievement by successfully</h3><h3>completing</h3><br/><h1><strong>ECTR Reader</strong></h1><h1><strong>Basic Training</strong></h1><h1><strong><span style="color:#808080">e-learning</span></strong></h1><br/><br/><h3>Schaan | 21 September 2016</h3><br/><h3>Global Training Manager</h3><h3>Marcel Oehler</h3>';


var html = '<div><img src="https://dev15176.service-now.com/bg_skillport_cert_top.jpg" width="595px" height="120px"/></div><table border="0" cellpadding="0" cellspacing="0"><tr><td width="66%" valign="top" align="center">'+cert+'</td><td width="34%"><img src="https://dev15176.service-now.com/bg_skillport_cert_side.jpg" width="" height=""/></td></tr></table>'; 

var gdt = new GlideDateTime(); 

var gr = new GlideRecord("sys_attachment");
gr.addQuery("table_sys_id", "e8caedcbc0a80164017df472f39eaed1");
gr.deleteMultiple();

PFGeneralForm.generate("incident", "e8caedcbc0a80164017df472f39eaed1", "incident", "e8caedcbc0a80164017df472f39eaed1", "od_"+String(gdt.getNumericValue())+".pdf", html);

// Dependencies:
// SI: PFGeneralForm
// SI: extends GeneralForm
// SI: extends General
// SI: calls GeneralPDF
// SI: calls iTextPDFUtil
// SI: calls GeneralFormJava
// SI: calls GeneralDebug
