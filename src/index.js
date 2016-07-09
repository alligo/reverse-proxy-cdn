/**
 * Main file. Run with command `node index.js` or similar
 *
 * @package       reverse-proxy-cdn
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var http = require('http'), Request = require('request');
var PORT = 8888;


/**
 * 
 * @param   {Event/Request}  req
 * @param   {Event/Response} res
 * @returns void
 */
function forEachRequest(req, res) {
  // http://somewhere.com/noo.bin
  //var remoteUrl = domainexample + req.url;
  //var remoteUrl = req.url.substr(1); // remove primeira /
  //Request(remoteUrl).pipe(res);
  var remoteUrl = getValidURL(req.url); // remove primeira /
  if (remoteUrl) {
    returnObject(remoteUrl, res);
  } else {
    returnInvalidObject(remoteUrl, res);
  }
}

/**
 * Return a valid remote url if is valid, and false if fail
 *
 * @param   {String}       url  URL
 * @returns {String|FALSE}
 */
function getValidURL(url) {
  var result = url && url.substr ? url.substr(1) : false;
  console.log('getValidURL ' + result);
  if (result.indexOf('http') !== 0) {
    result = false;
  }

  return result;
}
/**
 * Handle a invalid request
 *
 * @param   {Strong}         remoteUrl  remote url
 * @param   {Event/Response} res
 * @returns {void}
 */
function returnInvalidObject(remoteUrl, res) {
  console.log("INFO: invalid request " + remoteUrl);
}

/**
 * Handle a valid request
 *
 * @param   {Strong}         remoteUrl  remote url
 * @param   {Event/Response} res
 * @returns {void}
 */
function returnObject(remoteUrl, res) {
  console.log("DEBUG: requested " + remoteUrl);
  Request(remoteUrl).pipe(res);
}

http.createServer(forEachRequest).listen(PORT);