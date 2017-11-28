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

  const date = new Date(response.headers.date);

  const format = {
    log_format: 'morgan',
    'X-Transaction-Id': response.headers['X-Transaction-Id'],
    bytes: response.headers['content-length'],
    'content-type': response.headers['content-type'],
    '@timestamp': !isNaN(date) ? date.toISOString() : null,
    method: request.method,
    reqok: response.ok,
    duration: new Date().getTime() - startTime,
    status: response.statusCode,
    urlpath: request.req.path,
    vhost: request.host,
    apptype: 'fragment',
  };

  Object.keys(format).forEach((prop) => {
    if (!format[prop]) {
      delete format[prop];
    }
  });

  return format;
};

module.exports = {
  spalatumLogger,
  logRequestFormat,
};
