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

/**
 * Callback to execute for each request
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

  return isAllowedURL(result) ? result : false;
}

/**
 * Graceful exit
 *
 * @param   {Event/Response} res
 * @returns {Event/Response}
 */
function gracefulErrorHandling(res, res2) {
  if (Conf.onErrors && Conf.onErrors.statusCodes.indexOf(res.statusCode) !== -1) {
    console.log(res);
    res.statusCode = Conf.onErrors.response.statusCode;
    res.headers["Cache-Control"] = Conf.onErrors.response["Cache-Control"];
    res.headers["Content-Type"] = Conf.onErrors.response["Content-Type"];
    //res.write(Conf.onErrors.response.body);
    //res.writeHead(200, {'Content-Type': 'text/plain'});
    //res.end();
    res2.writeHead( Conf.onErrors.response.statusCode, {"Content-Type": Conf.onErrors.response["Content-Type"]});
    res2.write(Conf.onErrors.response.body);
//    console.log(res2)
//    res2.end();
//    res2 = {"write": function(){}};
  }

  return res2;
}

/**
 * Check if URL is allowed to crawler
 *
 * @param   {String} url
 * @returns {Boolean}
 */
function isAllowedURL(url) {
  var plainUrl = "", i;
  if (url.indexOf('http') !== 0) {
    Conf.debug && console.log('DEBUG: isAllowedURL DENY: (no http) url[' + url + ']');
    return false;
  }

  plainUrl = url.replace('https://', '').replace('http://', '');

  if (Conf.deniedStrings) {
    for (i = 0; i < Conf.deniedStrings.length; i++) {
      if (plainUrl.indexOf(Conf.deniedStrings[i]) !== -1) {
        Conf.debug && console.log('DEBUG: isAllowedURL DENY (deniedStrings): url[' + url + '], rule [' + Conf.deniedStrings[i] + ']');
        return false;
      }
    }
  }

  if (Conf.allowedDomains[0] !== "*") {
    //console.log("DEBUG isAllowedURL,  allowedDomains !== *", Conf.allowedDomains.length);
    for (i = 0; i < Conf.allowedDomains.length; i++) {
      //Conf.debug && console.log('loop', Conf.allowedDomains[i].indexOf(plainUrl), Conf.allowedDomains[i], plainUrl);
      if (plainUrl.indexOf(Conf.allowedDomains[i]) === 0) {
        Conf.debug && console.log('DEBUG: isAllowedURL OK: url[' + url + '], rule [' + Conf.allowedDomains[i] + ']');
        return true;
      }
    }
  }

  if (Conf.deniedDomains[0] === "*") {
    //console.log("DEBUG: isAllowedURL, deniedDomains === *")
    return false;
  }

  for (i = 0; i < Conf.deniedDomains.length; i++) {
    if (plainUrl.indexOf(Conf.deniedDomains[i]) === 0) {
      //console.log('DEBUG: isAllowedURL DENY: url[' + url + '], rule [' + Conf.deniedDomains[i] + ']');
      return false;
    }
  }

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
  Conf.debug && console.log("DEBUG: invalid request " + remoteUrl);
  res.writeHead(401, {"Content-Type": "application/json"});
  res.write('{"code": 401, "msg": "Unauthorized"}');
  res.end();
}

/**
 * Handle a valid request
 *
 * @param   {Strong}         remoteUrl  remote url
 * @param   {Event/Response} res2
 * @returns {void}
 */
function returnObject(remoteUrl, res2) {
  Conf.debug && console.log("DEBUG: requested " + remoteUrl);

  // Proxies are not tested... yet
  if (Conf.proxyList && Conf.proxyList.length) {
    Request = Request.defaults({'proxy': Conf.proxyList[[Math.floor(Math.random() * Conf.proxyList.length)]]});
  }

  Request(remoteUrl).on('response', function (res) {
    res.headers['x-cdn'] = 'alligo';
    delete res.headers['expires'];
    delete res.headers['pragma'];
    res.headers["Cache-Control"] = Conf["Cache-Control"];
    res2 = gracefulErrorHandling(res, res2);
    // ...
  }).pipe(res2);
}

http.createServer(forEachRequest).listen(PORT, function () {
  console.log("reverse-proxy-cdn crawler is listening on port: http://localhost:%s", PORT);
});