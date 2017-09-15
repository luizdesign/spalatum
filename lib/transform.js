/**
 * Transform types object with the public methods
 * @type {Object}
 */
const Types = {
  /**
   * Transform the string to base64
   * @param  {String} string [string to be transformed]
   * @return {String}
   */
  toBase64: string => new Buffer(string).toString('base64'),
  /**
   * Transform the base64 string to utf8 string
   * @param  {String} base64 [base64 string to be transformed]
   * @return {String}
   */
  toStringFromBase64: base64 => new Buffer(base64, 'base64').toString('utf8'),
};

module.exports = Types;
