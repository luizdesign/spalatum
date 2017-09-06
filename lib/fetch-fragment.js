const URL = require('url').URL;
const protocolFns = {
  'http:': require('http'),
  'https:': require('https')
};

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
  const slaveUri  = new URL(options.uri);
  const protocolFn = protocolFns[slaveUri.protocol];

  const ops = {
    path: options.uri
  };

  if (options.proxy) {
    ops.host = options.proxy
  }

  return new Promise((resolve, reject) => {
    protocolFn.get(ops, (res) => {
      requestHandler(res, resolve, reject);
    });
  });
}

module.exports = fetchFragment;
