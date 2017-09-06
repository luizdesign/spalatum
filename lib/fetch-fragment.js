const URL = require('url').URL;
const requestFns = {
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

const getFetchOptions = (options) => {
  if (options.proxy) {
    return {
      path: options.uri,
      host: options.proxy,
    };
  }

  return options.uri;
}

/**
 * Returns the fragment request promise
 *
 * @param  {Object} options [fragment fetch options]
 * @return {Promise}
 */
const fetchFragment = (options) => {
  const requestFn = requestFns[
    (new URL(options.uri)).protocol
  ];

  return new Promise((resolve, reject) => {
    requestFn.get(getFetchOptions(options), (res) => {
      requestHandler(res, resolve, reject);
    });
  });
}

module.exports = fetchFragment;
