const loggerEngine = require('bunyan');

/**
 * Logger (see the configs in https://github.com/trentm/node-bunyan)
 * @type {loggerEngine}
 */
const spalatumLogger = loggerEngine.createLogger({
  name: 'spalatum_logs',
  streams: [
    /**
     * Print the log in stdout
     */
    {
      stream: process.stdout,
    },
  ],
});

const logRequestFormat = (request, response, startTime) => {
  if (!(request.req && response.headers)) {
    return false;
  }

  return {
    'content-length': `${response.headers['content-length'] || '-'}`,
    'content-type': `${response.headers['content-type'] || '-'}`,
    date: `${response.headers.date || '-'}`,
    method: `${request.method || '-'}`,
    reqok: `${response.ok || '-'}`,
    'response-time': `${new Date().getTime() - startTime || '-'}ms`,
    status: `${response.statusCode || '-'}`,
    'url-path': `${request.req.path || '-'}`,
    vhost: `${request.host || '-'}`,
  };
};

module.exports = {
  spalatumLogger,
  logRequestFormat,
};
