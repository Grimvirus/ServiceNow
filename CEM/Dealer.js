var arr2_0 = [];
var arr2_1 = [];
var arr2_2 = [];
var count_0 = 0;
var count_1 = 0;
var count_2 = 0;
var gr2 = new GlideRecord("sc_req_item");
gr2.addQuery("u_dealer", "!=", "");
gr2.addQuery("u_dealer.u_dealer_number", "!=", "00000");
gr2.orderBy("u_dealer.u_dealer_number");
gr2.query();
while (gr2.next()) {
if (String(gr2.u_dealer.u_dealer_number).length == 5) {

var gr3 = new GlideRecord("u_dealer");
gr3.addEncodedQuery("u_dealer_numberENDSWITH"+String(gr2.u_dealer.u_dealer_number));
gr3.addQuery("u_dealer_number", "!=", String(gr2.u_dealer.u_dealer_number));
gr3.addQuery("sys_class_name", "u_dealer");
gr3.query();
if (gr3.getRowCount() == 0) {
arr2_0.push(String(gr2.u_dealer.u_dealer_number));
count_0++;
} else if (gr3.getRowCount() == 1) {
arr2_1.push(String(gr2.u_dealer.u_dealer_number));
count_1++;
} else {
var tmp = [];
while (gr3.next()) {
tmp.push(String(gr3.u_dealer_number));
}
arr2_2.push(String(gr2.u_dealer.u_dealer_number)+" ("+tmp.join(",")+")");
count_2++;
}

}
}

gs.log("RITM with Dealer, with 5-digit Number and 0 corresponding 7-digit Number: "+count_0);
gs.log(arr2_0);
gs.log("RITM with Dealer, with 5-digit Number and 1 corresponding 7-digit Number: "+count_1);
gs.log(arr2_1);
gs.log("RITM with Dealer, with 5-digit Number and 2+ corresponding 7-digit Number: "+count_2);
gs.log(arr2_2);
