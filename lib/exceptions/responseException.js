const ExtendableError = require('./extendableError.js');

class ResponseException extends ExtendableError {
  constructor(message = 'Fragment status code isn\'t 200') {
    super(message);
    this.name = 'ResponseException';
  }
}

module.exports = ResponseException;
