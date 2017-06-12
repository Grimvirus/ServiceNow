var sm = new sn_ws.RESTMessageV2(); 
sm.setRequestHeader("Content-Type","Application/json"); 
sm.setRequestHeader("Accept","Application/json"); 
sm.setRequestHeader("Authorization","SSWS 00K3-Sms8JKdJM4sG9L4ukDGGZ1aAuJ0qlQjLceFEW"); 
sm.setEndpoint("http://ksa.okta.com/api/v1/users?filter=status%20eq%20%22DEPROVISIONED%22"); 
sm.setHttpMethod("get"); 
var response = sm.execute(); 

var responseBody = response.getBody(); 

gs.log(responseBody); 

var obj = JSON.parse(responseBody); 

for (var i = 0 ; i < obj.length ; i++) { 
//gs.log(obj[i].profile.firstName + " " + obj[i].profile.lastName + " | " + obj[i].status); 
if (obj[i].status == "DEPROVISIONED") { 
killIt(obj[i]); 
} 
} 

if (!obj.length) { 
gs.log(obj.profile.firstName + " " + obj.profile.lastName + " | " + obj.status); 
if (obj.status == "DEPROVISIONED") { 
killIt(obj); 
} 
} 

function killIt(user) { 
gs.log("deleting: " + user.id);
var sm = new sn_ws.RESTMessageV2(); 
sm.setRequestHeader("Content-Type","Application/json"); 
sm.setRequestHeader("Accept","Application/json"); 
sm.setRequestHeader("Authorization","SSWS 00K3-Sms8JKdJM4sG9L4ukDGGZ1aAuJ0qlQjLceFEW"); 
sm.setEndpoint("http://ksa.okta.com/api/v1/users/"+user.id); 
sm.setHttpMethod("delete"); 
var response = sm.execute(); 
}
