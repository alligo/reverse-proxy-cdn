
var http = require('http');


var PORT=8888; 

var http = require('http'),
    request = require('request');

http.createServer(function (req, res) {
  // http://somewhere.com/noo.bin
  //var remoteUrl = domainexample + req.url;
  var remoteUrl = req.url.substr(1); // remove primeira /
  request(remoteUrl).pipe(res);
}).listen(PORT);