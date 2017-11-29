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

/* eslint-disable */
spalatumLogger._emit = (record, noemit) => {
  delete record.v;
  delete record.pid;
  delete record.hostname;
  delete record.time;

  loggerEngine.prototype._emit.call(spalatumLogger, record, noemit);
};
/* eslint-enable */

const logRequestFormat = (request, response, startTime) => {
  if (!(request.req && response.headers)) {
    return false;
  }

  const date = new Date(response.headers.date);

  const format = {
    '@timestamp': !isNaN(date) ? date.toISOString() : null,
    apptype: 'fragment',
    bytes: response.headers['content-length'],
    content: response.headers['content-type'],
    duration: new Date().getTime() - startTime,
    log_format: 'morgan',
    method: request.method,
    status: response.statusCode,
    urlpath: request.req.path,
    'user-agent': request.header['user-agent'],
    vhost: request.host,
    'X-Transaction-Id': request.header['x-transaction-id'],
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
