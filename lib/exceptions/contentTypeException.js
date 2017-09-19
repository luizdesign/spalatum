const ExtendableError = require('./extendableError.js');

class ContentTypeException extends ExtendableError {
  constructor(message = 'Fragment content-type isn\'t text/html') {
    super(message);
    this.name = 'ContentTypeException';
  }
}

module.exports = ContentTypeException;
