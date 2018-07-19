function dahuaOps() {}
module.exports = dahuaOps;

var request = require("request"),
    crypto = require('crypto');


var realm = 'Login to 3L08942PAA8AECE',
    http_method = 'GET',
    //username = 'admin',
    //password = 'abc12345',
    full_uri = '/cgi-bin/configManager.cgi?action=setConfig&VideoColor[0][0].Brightness=60&VideoColor[0][0].Contrast=50&VideoColor[0][0].Saturation=60&VideoColor[0][0].Gamma=55',
    ip = '192.168.1.108',
    qop = 'auth',
    nc = '00000001',
    algorithm = 'MD5',
    opaque = '3fd83f11d2cf03b2cef8e4555820db51cf4d3935',
    cnonce = '0a4f113b';

var do_uri = full_uri.substring(0,full_uri.indexOf("?"));
console.log("do_uri is :",do_uri);
var paramDist = {};

function resolveUri() {
    // var act_uri = full_uri,
    var act_uri = full_uri.substring(full_uri.indexOf("?")+1);

    console.log('act_uri is :',act_uri);
    var parameters = act_uri.split('&');
    console.log("parameters is: ", parameters);

    parameters.forEach(function(element) {
        console.log("element is: para name  " + element.split("=")[0] + " and para val is: " + element.split("=")[1]);
        paramDist[element.split("=")[0]] = element.split("=")[1];
    });

    console.log("the parameters dict is: ", paramDist);
}

function firstRequest(callback){
    var options = { 
      method: 'GET',
      url: 'http://' + ip + do_uri,
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

dahuaOps.init = function(username, password) {
    this.username = username;
    console.log("full is : ",this.username)
    this.password = password;
    console.log("full is : ",this.password);
}; 

/*main function starts here*/
dahuaOps.setParams = function() {
  firstRequest(function(data, error){
      if (error) throw new Error(error);

      data = data.replace("\"", "");
      data = data.replace("\"", "");
      console.log("data is: ", data);

      /*Generate response based on first http request (Digest Auth Method)*/
      var ha1 = crypto.createHash('md5').update(this.username + ':' + realm + ':' + this.password).digest('hex');
      var ha2 = crypto.createHash('md5').update(http_method + ':' + full_uri).digest('hex');
      var response = crypto.createHash('md5').update(ha1 + ':' +
                                                     data + ':' + 
                                                     nc + ':' + 
                                                     cnonce + ':' + 
                                                     qop + ':' + 
                                                     ha2).digest('hex');

      var auth_string = 'Digest username="' 
                        + this.username 
                        + '", realm="'+ realm 
                        + '", nonce="' + data 
                        + '", uri="' + full_uri 
                        + '", algorithm="'+ algorithm 
                        + '", qop="' + qop
                        + '", nc=' + nc 
                        + ', cnonce="'+ cnonce 
                        + '", opaque="' 
                        + opaque + 
                        '", response="' + response 
                        + '"';

      console.log("auth string is: ", auth_string);

      resolveUri();

      var options = { method: 'GET',
        url: 'http://' + ip + do_uri,
        qs: paramDist,
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

        // console.log(" 2nd response is: ", response);
      });  
  });
}