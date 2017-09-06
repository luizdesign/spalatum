const https = require('http');

console.log('entrouuuu');

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
 * @param  {String} uri [fragment endpoint]
 * @return {Promise}
 */
const fetchFragment = (uri) => {
  // const options = {
  //   path: op.uri,
  //   host: op.proxy || ''
  // };

  // const options = {
  //   path: '/portugues-ingles/traducao/fone.html',
  //   host: 'www.linguee.com.br'
  // };

  // console.log(options);

  return new Promise((resolve, reject) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    try {
      https.get(uri, (res) => {
        requestHandler(res, resolve, reject);
      });
    } catch (error) {
      console.log("errouuuuu");
      console.log(error);
    }
  });
}

module.exports = fetchFragment;
