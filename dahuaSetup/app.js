var dahuaOps = require('./dahualib.js');

/*chage camera's username, password, IP, and URI here*/
var options = {
	username: "admin",
	password: "abc12345",
	ip: "192.168.1.108",
	uri: "/cgi-bin/configManager.cgi?action=setConfig&VideoColor[0][0].Brightness=60&VideoColor[0][0].Contrast=50&VideoColor[0][0].Saturation=60&VideoColor[0][0].Gamma=55"
};

dahuaOps.init(options);
			 
console.log("Setting Dahua Camera parameters to: ", 
	"/cgi-bin/configManager.cgi?action=setConfig&VideoColor[0][0].Brightness=60&VideoColor[0][0].Contrast=50&VideoColor[0][0].Saturation=60&VideoColor[0][0].Gamma=55")

dahuaOps.setParams();