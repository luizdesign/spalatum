const ExtendableError = require('./extendableError.js');

class PrimaryFragmentException extends ExtendableError {
  constructor({ message, statusCode, fragmentUrl }) {
    super(message);
    this.name = 'PrimaryFragmentException';
    this.statusCode = statusCode;
    this.fragmentUrl = fragmentUrl;
  }
}

module.exports = PrimaryFragmentException;
