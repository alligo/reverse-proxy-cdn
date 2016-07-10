/**
 * Main file. Run with command `node index.js` or similar
 *
 * @package       reverse-proxy-cdn
 * @copyright     Copyright (C) 2016 Alligo Tecnologia Ltda.
 * @author        Emerson Rocha Luiz <emerson at alligo.com.br>
 */

var http = require('http')
        , Request = require('request')
        , Conf = require('./configuration.json')
        , PORT = 8888;

(function () {
  //Conf.allowedDomains = Conf.allowedDomains[0] = "*" ? true : Conf.allowedDomains;
  //Conf.deniedDomains = Conf.deniedDomains[0] = "*" ? true : Conf.deniedDomains;
  console.log(Conf);
})();


/**
 * 
 * @param   {Event/Request}  req
 * @param   {Event/Response} res
 * @returns void
 */
function forEachRequest(req, res) {
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

  console.log("isAllowedURL(result)", isAllowedURL(result));

  return isAllowedURL(result) ? result : false;
}

/**
 * 
 * @param {type} url
 * @returns {Boolean}
 */
function isAllowedURL(url) {
  var plainUrl = "";
  if (url.indexOf('http') !== 0) {
    console.log('isAllowedURL DENY: (no http) url[' + url + ']');
    return false;
  }

  return true;
  // @todo resolve bugs after this line (fititnt, 2016-07-10 02:31)

  plainUrl = url.replace('https://', '').replace('http://', '');

  if (Conf.allowedDomains[0] !== "*") {
    for (var i; i < Conf.allowedDomains.length; i++) {
      if (Conf.allowedDomains[i].indexOf(plainUrl) === 0) {
        console.log('isAllowedURL OK: url[' + url + '], rule [' + Conf.allowedDomains[i] + ']');
        return true;
      }
    }
//    Conf.allowedDomains.forEach(function (val, idx) {
//      if (val.indexOf(plainUrl) === 0) {
//        console.log('isAllowedURL OK: url[' + url + '], rule [' + val + ']');
//        return true;
//      }
//    });
  }
  if (Conf.deniedDomains[0] === "*") {
    return false;
  }
  for (var i; i < Conf.deniedDomains.length; i++) {
    if (Conf.deniedDomains[i].indexOf(plainUrl) === 0) {
      console.log('isAllowedURL DENY: url[' + url + '], rule [' + Conf.deniedDomains[i] + ']');
      return true;
    }
  }
//  Conf.allowedDomains.forEach(function (val, idx) {
//    if (val.indexOf(plainUrl) === 0) {
//      console.log('isAllowedURL DENY: url[' + url + '], rule [' + val + ']');
//      return true;
//    }
//  });

  return true;
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
  res.statusCode = 404;
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

http.createServer(forEachRequest).listen(PORT, function () {
  console.log("reverse-proxy-cdn crawler is listening on port: http://localhost:%s", PORT);
});