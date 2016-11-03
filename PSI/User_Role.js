var gr = new GlideRecord("sys_user_has_role");
gr.addQuery("granted_by", "!=", "");
gr.addQuery("granted_by", "!=", "571a0ec04fedd200ce393fb28110c744"); // PF Access Management
gr.query();
while (gr.next()) {
// check if user is still in the group
var gr2 = new GlideRecord("sys_user_grmember");
gr2.addQuery("user", String(gr.user));
gr2.addQuery("group", String(gr.granted_by));
gr2.query();
if (!gr2.hasNext()) {
gs.log("|"+String(gr.user.name)+"|"+String(gr.user.user_name)+"|"+ String(gr.role.name) +"|"+String(gr.granted_by.name)+"|User is not in Granted by Group");
}

// check if role is still in group
var gr2 = new GlideRecord("sys_group_has_role");
gr2.addQuery("role", String(gr.role));
gr2.addQuery("group", String(gr.granted_by));
gr2.query();
if (!gr2.hasNext()) {
gs.log("|"+String(gr.user.name)+"|"+String(gr.user.user_name)+"|"+ String(gr.role.name) +"|"+String(gr.granted_by.name)+"|Role is not in Group");
}

}
