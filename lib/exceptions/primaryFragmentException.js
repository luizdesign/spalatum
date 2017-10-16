const ExtendableError = require('./extendableError.js');

class PrimaryFragmentException extends ExtendableError {
  constructor(message, statusCode) {
    super(message);
    this.name = 'PrimaryFragmentException';
    this.statusCode = statusCode;
  }
}

module.exports = PrimaryFragmentException;
