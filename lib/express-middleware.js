const superagent = require('./fragment-request');

module.exports = (req, res, next) => {
  superagent
    .set(req.headers)
    .set('spalatum-referer', process.env.npm_package_name);

  next();
};
