const https = require('https');

/**
 * Http request handler
 * @param  {Object}   res     [Response object]
 * @param  {Function} resolve [Promise resolve function]
 * @param  {Function} reject  [Promise reject function]
 * @return {Undefined}
 */
const requestHandler = (res, resolve, reject) => {
  let stream = '';

  res.setEncoding('utf8');
  // Request stream data event
  res.on('data', (chunk) => {
    stream += chunk;
  });
  // Request finish event
  res.on('end', () => {
    resolve(stream);
  });
  // Request error event
  res.on('error', (error) => {
    reject(new Error(error));
  });
};

/**
 * Returns the fragment request promise
 *
 * @param  {Object} options [fragment fetch options]
 * @return {Promise}
 */
const fetchFragment = (options) => {
  const ops = {
    path: options.uri,
    host: options.proxy
  };

  return new Promise((resolve, reject) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      https.get(ops, (res) => {
        requestHandler(res, resolve, reject);
      });
    } catch (error) {
      process.stdout.write(error);
    }
  });
}

module.exports = fetchFragment;
