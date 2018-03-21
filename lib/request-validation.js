/**
 * Request validation object with public methods
 * @type {Object}
 */
const requestValidation = {
  /**
   * Validate if a response field value are the same of the desired content
   * @param {Any} content [acceptable content]
   * @param {Any} responseContent [response content]
   * @return {Boolean}
   */
  validateField: (content, responseContent) => responseContent === content,

  /**
   * Validate the reponse content length
   * @param {Number} contentLength [acceptable content length]
   * @param {Object} responseObject [response object]
   * @return {Boolean}
   */
  validateContentLength: (contentLength, length) =>
    length >= contentLength,

  /**
   * Validate that status code isn't error
   * @param {Number} status [received status code]
   * @return {Boolean}
   */
  validateStatusCode: status => status < 400,

  /**
   * Validate the request response
   * @param {Object} validateObject [Object with acceptable validations]
   * @property {Number} validateObject.acceptStatusCode [acceptable status code]
   * @property {String} validateObject.acceptContentType [acceptable content type]
   * @property {Number} validateObject.acceptMinContentLength [acceptable minimun content length]
   * @param {Object} responseObject [response object]
   * @return {Boolean}
   */
  validateRequest: (validateObject, responseObject) =>
    requestValidation.validateField(validateObject.acceptStatusCode, responseObject.status)
      && requestValidation.validateField(
        validateObject.acceptContentType, responseObject.type,
      )
      && requestValidation.validateContentLength(
        validateObject.acceptMinContentLength, responseObject.text.length,
      ),
};

module.exports = requestValidation;
