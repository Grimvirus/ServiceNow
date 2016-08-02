var gr = new GlideRecord("sys_user");
gr.addEncodedQuery("active=true^GOTOuser_nameNOT LIKE-admin");
gr.query();
while (gr.next()){
  GlideSessions.lockOutSessionsInAllNodes(String(gr.user_name));
}
