const http = require('http');

/**
 * Http request handler
 * @param  {Object}   res     [Response object]
 * @param  {Function} resolve [Promise resolve function]
 * @param  {Function} reject  [Promise reject function]
 * @return {Undefined}
 */
const requestHandler = (res, resolve, reject) => {
  let response = '';

  res.setEncoding('utf8');
  // Request stream data event
  res.on('data', (chunk) => {
    response += chunk;
  });
  // Request finish event
  res.on('end', () => {
    resolve(response);
  });
  // Request error event
  res.on('error', (error) => {
    reject(new Error(error));
  });
};

/**
 * Returns the fragment request promise
 *
 * @param  {String} uri [fragment endpoint]
 * @return {Promise}
 */
const fetchFragment = uri =>
  new Promise((resolve, reject) => {
    http.get(uri, (res) => {
      requestHandler(res, resolve, reject);
    });
  });

module.exports = fetchFragment;
