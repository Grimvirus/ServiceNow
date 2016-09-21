
var arrayUtil = new ArrayUtil();

var gr = new GlideRecord("kb_knowledge_base");
gr.query();
while (gr.next()) {
var readers = [];
var writers = [];

// read
var gr1 = new GlideRecord("kb_uc_can_read_mtom");
gr1.addQuery("kb_knowledge_base", String(gr.sys_id));
gr1.query();
while (gr1.next()) {
readers.push(String(gr1.user_criteria.name));
}

// write
var gr2 = new GlideRecord("kb_uc_can_contribute_mtom");
gr2.addQuery("kb_knowledge_base", String(gr.sys_id));
gr2.query();
while (gr2.next()) {
writers.push(String(gr2.user_criteria.name));
}

gs.log("|"+gr.title+"|"+gr.kb_managers.getDisplayValue().split("), ").join(")#")+"|"+readers.join("#")+"|"+writers.join("#"));

}

