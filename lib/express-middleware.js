const superagent = require('./fragment-request');

module.exports = (req, res, next) => {
  superagent.use((request) => {
    request.set(req.headers);
    return request;
  });

  next();
};
