

var sm = new sn_ws.RESTMessageV2();
sm.setEndpoint("http://transport.opendata.ch/v1/connections?from=Au%20ZH&to=Bern");
sm.setHttpMethod("get");
sm.setRequestHeader("Accept","Application/json");
var response = sm.execute();

var httpResponseStatus = response.getStatusCode();
var responseBody = JSON.parse(response.getBody());

gs.log(httpResponseStatus);
// gs.log(responseBody);
gs.log(responseBody.connections.length);

for (var c in responseBody.connections) {
var gdtS = new GlideDateTime();
gdtS.setNumericValue(responseBody.connections[c].from.departureTimestamp+"000");

var gdtE = new GlideDateTime();
gdtE.setNumericValue(responseBody.connections[c].to.arrivalTimestamp+"000");

gs.log(responseBody.connections[c].from.station.name + " -> " + responseBody.connections[c].to.station.name + " @ " + String(gdtS.getLocalTime()).split(" ")[1] + " | " + String(gdtE.getLocalTime()).split(" ")[1] );

for (var s in responseBody.connections[c].sections) {
var sec = responseBody.connections[c].sections;
var gdtSS = new GlideDateTime();
gdtSS.setNumericValue(sec[s].departure.departureTimestamp+"000");
var gdtES = new GlideDateTime();
gdtES.setNumericValue(sec[s].arrival.arrivalTimestamp+"000");

gs.log(" + @" + String(gdtSS.getLocalTime()).split(" ")[1] + " " + sec[s].departure.station.name + " -> @" + String(gdtES.getLocalTime()).split(" ")[1] + " " + sec[s].arrival.station.name);
}

}
