
var http = require('http');


var PORT=8080; 
var domainexample = 'http://cdn.fititnt.org';

var http = require('http'),
    request = require('request'),
    remote = domainexample;

http.createServer(function (req, res) {
  // http://somewhere.com/noo.bin
  //var remoteUrl = domainexample + req.url;
  var remoteUrl = req.url.substr(1); // remove primeira /
  request(remoteUrl).pipe(res);
}).listen(PORT);