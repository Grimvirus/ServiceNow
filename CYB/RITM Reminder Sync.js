var gr = new GlideRecord("sc_task");
gr.addQuery("u_reminder_event", "!=", "").addOrCondition("request_item.u_reminder_event", "!=", "");
gr.addQuery("active", true);
gr.query();
gs.log(gr.getRowCount());
while (gr.next()) {

if (gr.u_reminder_event && gr.request_item.u_reminder_event) {
//if (gr.u_reminder_event!=gr.request_item.u_reminder_event) {
gs.log(gr.u_reminder_event+"|"+gr.request_item.u_reminder_event+"|"+(gr.u_reminder_event==gr.request_item.u_reminder_event));
//}
} else {
gs.log(gr.request_item.number+"|"+gr.u_reminder_event+"|"+gr.active+"|"+gr.request_item.u_reminder_event+"|"+(gr.u_reminder_event==gr.request_item.u_reminder_event));
}

}
