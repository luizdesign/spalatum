const superagent = require('./request-client');

module.exports = (req, res, next) => {
  superagent.set(req.headers);
  next();
};
