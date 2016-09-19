var html = '<div><img src="https://dev15176.service-now.com/bg_skillport_cert_top.jpg" width="595px" height="120px"/></div><table border="0" cellpadding="0" cellspacing="0"><tr><td width="66%" valign="top" align="left">main</td><td width="34%"><img src="https://dev15176.service-now.com/bg_skillport_cert_side.jpg" width="" height=""/></td></tr></table>'; 

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
