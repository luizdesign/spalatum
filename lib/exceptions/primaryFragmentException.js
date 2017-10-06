const ExtendableError = require('./extendableError.js');

class PrimaryFragmentException extends ExtendableError {
  constructor(message = 'Must have only one fragment tag as primary', statusCode) {
    super(message);
    this.name = 'PrimaryFragmentException';
    this.statusCode = statusCode;
  }
}

module.exports = PrimaryFragmentException;
