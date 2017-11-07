const superagent = require('superagent-defaults')();
require('superagent-proxy')(superagent.request);

module.exports = superagent;
