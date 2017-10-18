const httpProxy = require('http-proxy');

const MockProxyServer = target =>
  httpProxy.createServer({
    target,
  });

module.exports = MockProxyServer;
