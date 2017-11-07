const superagent = require('./request-client');

/**
 * An middleware to be used with Expreess
 */
module.exports = (req, res, next) => {
  superagent.set(req.headers);
  next();
};
