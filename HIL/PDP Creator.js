

// DD.MM.YYYY - Author - Comments 
// 06.07.2016 - OD - Execute PDP Creator file 

try { 
(function(){ 
var current = new GlideRecord("sc_req_item"); 
current.get("badc0f294fa022005633bc511310c745"); 

var parameters = []; 
// PDPUserCreator.exe "INC001234" "C:\Temp" "Raymond Eberle" "EBERRAY" "Switzerland" "P" "Product Manager Maintain" "Technical Developer" 

parameters.push(String(current.number)); // RITM 
//parameters.push(String(gs.getProperty("com.hilti.pdp.target"))); 
parameters.push(String("C:\\Applications\\PDP")); 
parameters.push(String(current.variables.required_for.name)); 
parameters.push(String(current.variables.required_for.user_name)); 
parameters.push(String(current.variables.location.getDisplayValue())); 
if (current.variables.system == "Production") { 
parameters.push(String("P")); 
} else { 
parameters.push(String("P")); 
} 

// Get Privleges 
var gr = new GlideRecord("item_option_new"); 
gr.addEncodedQuery("variable_set=efa645c670a23100c4c8c7a839dee1d3^GOTOnameLIKEchk_^active=true"); 
gr.query(); 
while (gr.next()) { 
if (current.variables[gr.name] == "true" || current.variables[gr.name] == true) { 
parameters.push(String(gr.question_text)); 
} 
} 

var fn = ""; 
fn = gs.getProperty("com.hilti.pdp.filepath"); 

if (!fn) { 
return; 
} 

var mid = new GlideRecord("ecc_agent"); 
mid.addQuery("status", "Up"); 
mid.query(); 
if (mid.next()) { 
var commandprobe1 = new CommandProbeES(String(mid.name)); 
commandprobe1.addParameter("skip_sensor", "true"); 
commandprobe1.setCommand(fn + ' \"' + parameters.join('\" \"') + '\"'); 
//gs.log(commandprobe1.create()); 


var probe = SncProbe.get("Windows - Powershell");
        probe.setName("Windows - Powershell");
        probe.setSource("127.0.0.1");
        probe.addParameter("test.ps1","C:\\Applications\\PDP\\PDPUserCreator.ps1 \"" + parameters.join('\" \"') + "\"");
probe.addParameter("skip_sensor", true);
        probe.create(String(mid.name));

return; 
} else { 
return; 
} 
})(); 
} catch(err) { 
gs.eventQueue("script.error", current, "ERROR: Execute PDPUserCreator", err + " in line:" + err.lineNumber); 
}
