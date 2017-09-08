const URL = require('url').URL;
const http = require('http');
const https = require('https');

/**
 * Returns the correct NodeJs Protocol Object based on request protocol
 * @param  {String} protocol [The request protocol]
 * @return {Object}
 */
const getProtocolObject = protocol => (
  protocol === 'http:'
    ? http
    : https
);

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
 * Factory an Url object based on fragment attributes
 * @param  {Object} fragmentAttributes [fragment tag attributes]
 * @return {Object}
 */
const FactoryFetchOptions = (fragmentAttributes) => {
  const fetchOptions = new URL(fragmentAttributes.href);

  if (fragmentAttributes.proxy) {
    fetchOptions.path = fragmentAttributes.href;
    fetchOptions.host = fragmentAttributes.proxy;
  }

  return fetchOptions;
};

/**
 * Returns the fragment request promise
 *
 * @param  {Object} fragmentAttributes [fragment tag attributes]
 * @return {Promise}
 */
const fetchFragment = (fragmentAttributes) => {
  const fetchOptions = FactoryFetchOptions(fragmentAttributes);
  const protocolObject = getProtocolObject(fetchOptions.protocol);

  return new Promise((resolve, reject) => {
    protocolObject.get(fetchOptions, (res) => {
      requestHandler(res, resolve, reject);
    });
  });
};

module.exports = fetchFragment;
