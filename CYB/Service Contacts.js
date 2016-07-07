var grS = new GlideRecord("u_service");
grS.query();
while (grS.next()) {

var types = ["Technical","Billing","Administrative"];
var log = [];
var show = false;
log.push(String(grS.u_name));

for (var i = 0 ; i < types.length ; i++) {
var grC = new GlideAggregate("u_service_contact");
grC.addAggregate("COUNT");
grC.addQuery("u_service", String(grS.sys_id));
grC.addQuery("u_type", types[i]);
grC.query();
if  (grC.next()) {
if (grC.getAggregate("COUNT") > 0) {
show = true;
log.push(grC.getAggregate("COUNT"));
} else {
log.push(0);
}
}
}

if (show) {
gs.log(log.join("|"));
}

}


