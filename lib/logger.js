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
    /**
     * Save the log in file path, grouped by 1 day
     * and expire the file log each 7 days
     */
    {
      type: 'rotating-file',
      path: './logs/spalatum_logs.log',
      period: '1d',
      count: 7,
    },
  ],
});

module.exports = spalatumLogger;
