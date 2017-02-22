var probe = new SncProbe();

//probe.setTopic("Command");
probe.setTopic("SSHCommand");
 
//probe.setName("ssh HOST -p 5522 ls -la");
probe.setName("ls -la");

probe.setSource("213.158.132.76");
probe.addParameter("port", 5522);  
probe.create("DEVSERVER");  

for (bla in probe) {
gs.log(bla);
}
