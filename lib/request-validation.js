/**
 * Request validation object with public methods
 * @type {Object}
 */
const requestValidation = {
  /**
   * Validate the reponse status code
   * @param {Number} status [acceptable status code]
   * @param {Object} responseObject [response object]
   * @return {Boolean}
   */
  validateStatus: (status, responseObject) => responseObject.status === status,

  /**
   * Validate the response content type
   * @param {String} contentType [acceptable content type]
   * @param {Object} responseObject [response object]
   * @return {Boolean}
   */
  validateContentType: (contentType, responseObject) => responseObject.type === contentType,

  /**
   * Validate the reponse content length
   * @param {Number} contentLength [acceptable content length]
   * @param {Object} responseObject [response object]
   * @return {Boolean}
   */
  validateContentLength: (contentLength, responseObject) =>
    responseObject.text.length >= contentLength,

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
    requestValidation.validateStatus(validateObject.acceptStatusCode, responseObject)
      && requestValidation.validateContentType(
        validateObject.acceptContentType, responseObject,
      )
      && requestValidation.validateContentLength(
        validateObject.acceptMinContentLength, responseObject,
      ),
};

module.exports = requestValidation;
