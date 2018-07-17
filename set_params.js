var request = require("request"),
    crypto = require('crypto');

var username = 'admin',
    password = 'abc123';

function firstRequest(callback){
    var options = { 
      method: 'GET',
      url: 'http://192.168.0.3/cgi-bin/configManager.cgi',
      qs: { 
          action: 'setConfig',
          'VideoColor[0][0].Brightness': '60',
          'VideoColor[0][0].Contrast': '50',
          'VideoColor[0][0].Saturation': '60',
          'VideoColor[0][0].Gamma': '55' 
       },
    };

    request(options, function (error, response, body) {
      if (error) {            
        return callback(null, error);;
      }

      var auth_info = response.headers['www-authenticate'];
      console.log("auth info is: ", auth_info);
      var params = String(auth_info).split(',')
      var nonce = params[2].split('=')[1];
      console.log("nonce is: ", nonce);
      return callback(nonce, false);;
    });
}


firstRequest(function(data, error){
    if (error) throw new Error(error);

    data = data.replace("\"", "");
    data = data.replace("\"", "");
    console.log("data is: ", data);

    /*Get response based on first http request*/
    var ha1 = crypto.createHash('md5').update(username + ':' + 'Login to 3L08942PAA8AECE' + ':' + password).digest('hex');
    var ha2 = crypto.createHash('md5').update('GET:' + '/cgi-bin/configManager.cgi?action=setConfig&VideoColor[0][0].Brightness=60&VideoColor[0][0].Contrast=50&VideoColor[0][0].Saturation=60&VideoColor[0][0].Gamma=55').digest('hex');
    var response = crypto.createHash('md5').update(ha1 + ':' + data + ':00000001:0a4f113b:auth:' + ha2).digest('hex');

    var auth_string = 'Digest username="admin", realm="Login to 3L08942PAA8AECE", nonce="' + data + '", uri="/cgi-bin/configManager.cgi?action=setConfig&VideoColor[0][0].Brightness=60&VideoColor[0][0].Contrast=50&VideoColor[0][0].Saturation=60&VideoColor[0][0].Gamma=55", algorithm="MD5", qop=auth, nc=00000001, cnonce="0a4f113b", opaque="3fd83f11d2cf03b2cef8e4555820db51cf4d3935", response="' + response + '"';

    console.log("auth string is: ", auth_string);

    var options = { method: 'GET',
      url: 'http://192.168.0.3/cgi-bin/configManager.cgi',
      qs: 
       { action: 'setConfig',
         'VideoColor[0][0].Brightness': '60',
         'VideoColor[0][0].Contrast': '50',
         'VideoColor[0][0].Saturation': '60',
         'VideoColor[0][0].Gamma': '55' },
      headers: 
       {  
          'Connection': 'keep-alive',
          'Cache-Control': 'no-cache',
          'Accept': '*/*',
          'accept-encoding': 'gzip, deflate',
          'cache-control': 'no-cache',
          Authorization: auth_string
       } 
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    });  
});
