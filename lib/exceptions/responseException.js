const ExtendableError = require('./extendableError.js');

class ResponseException extends ExtendableError {
  constructor({ message = 'Fragment request failed', statusCode }) {
    super(message);
    this.name = 'ResponseException';
    this.statusCode = statusCode;
  }
}

module.exports = ResponseException;
