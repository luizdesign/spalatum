/* eslint global-require: 0, import/no-dynamic-require: 0 */

const http = require('http');

const MockServer = filePath =>
  http.createServer((req, res) => {
    res.writeHead(
      200,
      {
        'Content-Type': 'text/html',
      },
    );
    res.write(require(filePath));
    res.end();
  });

module.exports = MockServer;
