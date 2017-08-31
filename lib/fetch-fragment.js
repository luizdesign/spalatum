const http = require('http');

/**
 * Returns the fragment request promise
 *
 * @param  {String} uri [fragment endpoint]
 * @return {Promise}
 */
const fetchFragment = uri =>
  new Promise((resolve, reject) => {
    let response = '';

    http.get(uri, (res) => {
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        response += chunk;
      });
      res.on('end', () => {
        const body = response.replace(/\/static/g, 'http://www.catho.com.br/static');

        return resolve(body);
      });
      res.on('error', (error) => {
        reject(new Error(error));
      });
    });
  });

module.exports = fetchFragment;
