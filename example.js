var dahuaOps = require('./set_params.js');

/*chage camera's username, password, IP, and URI here*/
dahuaOps.init("admin",
			  "abc12345",
			  "192.168.1.108");
dahuaOps.setParams();