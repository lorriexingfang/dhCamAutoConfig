function dahuaOps() {}
module.exports = dahuaOps;

var request = require("request"),
    crypto = require('crypto');


var realm = 'Login to 3L08942PAA8AECE',
    http_method = 'GET',
    qop = 'auth',
    nc = '00000001',
    algorithm = 'MD5',
    opaque = '3fd83f11d2cf03b2cef8e4555820db51cf4d3935',
    cnonce = '0a4f113b';

var paramDist = {};
var DEBUG = false;

function resolveUri(frui) {
    var act_uri = frui.substring(frui.indexOf("?")+1);
    var parameters = act_uri.split('&');

    parameters.forEach(function(element) {
        paramDist[element.split("=")[0]] = element.split("=")[1];
    });
    DEBUG&&console.log("The parameters dict is: ", paramDist);

    return paramDist;
}

dahuaOps.firstRequest = function(callback){
    do_uri = this.full_uri.substring(0, this.full_uri.indexOf("?"));

    var options = { 
      method: 'GET',
      url: 'http://' + this.ip + do_uri,
      timeout: 5000
    };

    request(options, function(error, response, body) {
        if (error) {
          return callback(null, error);;
        }

        var auth_info = response.headers['www-authenticate'];
        var params = String(auth_info).split(',')
        var nonce = params[2].split('=')[1];
        DEBUG&&console.log("nonce is: ", nonce);

        return callback(nonce, false);
    });
}

dahuaOps.init = function(options) {
    this.username = options.username;
    this.password = options.password;
    this.ip = options.ip;
    this.full_uri = options.uri;
}; 

/*main function starts here*/
dahuaOps.setParams = function() {
  var that = this;
  this.firstRequest(function(data, error){
      if (error) {
          console.log("Fail to send first http request, check:\n1) if running client is in the same LAN with camera\n2) set 192.168.1.108 as the static IP in your running client. Exit ...")
          throw new Error(error);
      }

      data = data.replace(/\"/g, "");

      /*Generate response based on first http request (Digest Auth Method)*/
      var ha1 = crypto.createHash('md5').update(that.username + ':' + realm + ':' + that.password).digest('hex');
      var ha2 = crypto.createHash('md5').update(http_method + ':' + that.full_uri).digest('hex');
      var response = crypto.createHash('md5').update(ha1 + ':' +
                                                     data + ':' + 
                                                     nc + ':' + 
                                                     cnonce + ':' + 
                                                     qop + ':' + 
                                                     ha2).digest('hex');

      var auth_string = 'Digest username="' 
                        + that.username 
                        + '", realm="'+ realm 
                        + '", nonce="' + data 
                        + '", uri="' + that.full_uri 
                        + '", algorithm="'+ algorithm 
                        + '", qop="' + qop
                        + '", nc=' + nc 
                        + ', cnonce="'+ cnonce 
                        + '", opaque="' + opaque
                        + '", response="' + response//response 
                        + '"';
      DEBUG&&console.log("auth string is: ", auth_string);

      resolveUri(that.full_uri);

      var options = { 
          method: 'GET',
          url: 'http://' + that.ip + do_uri,
          qs: paramDist,
          timeout: 5000,
          headers: 
          {  
              Authorization: auth_string
          } 
      };

      request(options, function (error, response, body) {
          if ((!error) && (response.statusCode === 200)) {
            console.log("Config camera successfully!")
          } else {
            console.log("Fail to set up dahua camera. Exit ...")
            throw new Error(error);
          } 
      });  
  });
}

process.on('uncaughtException', function (err) {
      console.error((new Date).toUTCString() + ' uncaughtException:', err.message)
      console.error(err.stack)
      process.exit(1)
});