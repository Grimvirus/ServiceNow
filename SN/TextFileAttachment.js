var gr = new GlideRecord("sc_req_item");
gr.get("4705aff4dbdaf2009a1a7cfeaf96194c");

var sa = new GlideSysAttachment();
var attachmentId = sa.write(gr, "test2.txt", "application/txt", "Oli has some text\r\neat it!");
gs.log(attachmentId);
