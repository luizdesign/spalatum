const ExtendableError = require('./extendableError.js');

class ResponseException extends ExtendableError {
  constructor(message = 'Fragment status code isn\'t successful') {
    super(message);
    this.name = 'ResponseException';
  }
}

module.exports = ResponseException;
